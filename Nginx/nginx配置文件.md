## Nginx配置文件

Nginx主配置文件`/etc/nginx/nginx.conf`是一个纯文本类型的文件，整个配置文件是以区块的形式组织的。一般，每个区块以一对大括号`{}`来表示开始与结束。

nginx配置文件主要分为四个部分：

```text
main{ 
#（全局设置）
    http{ 
    #服务器
        upstream{} #（负载均衡服务器设置：主要用于负载均衡和设置一系列的后端服务器）
        server{ 
            #（主机设置：主要用于指定主机和端口）
            location{} #（URL匹配特点位置的设置）
        }
    }
}
```

server继承main，location继承server，upstream即不会继承其他设置也不会被继承。

![](https://gblobscdn.gitbook.com/assets%2F-LwxCt2HvJChlAQU1DVQ%2F-Lx1AsxMSEgCwFBH7iwF%2F-Lx1BLZFbW3QBExE1aJk%2Fimage.png?alt=media&token=53469164-df10-4ea3-a995-e4c49804ea49)

## 一、main全局配置

用于设置运行时一些与具体业务无关的参数，如工作进程数，工作组等

```text
user  www www;
worker_processes 4;
worker_cpu_affinity 0001 0010 0100 1000;
error_log  /var/logs/nginx_error.log  crit;
pid        /usr/local/webserver/nginx/nginx.pid;
worker_rlimit_nofile 65535;
```



* `user www www;`: 指定nginx进程使用什么用户启动
* `worker_processes 4;` : 指定启动多少进程来处理请求，一般情况下设置成CPU的核数，如果开启了ssl和gzip更应该设置成与逻辑CPU数量一样甚至为2倍，可以减少I/O操作。使用`grep ^processor /proc/cpuinfo | wc -l`查看CPU核数。
* `worker_cpu_affinity 0001 0010 0100 1000;`: 在高并发情况下，通过设置将CPU和具体的进程绑定来降低由于多核CPU切换造成的寄存器等现场重建带来的性能损耗。如worker\_cpu\_affinity 0001 0010 0100 1000; （四核）。
* `error_log /var/logs/nginx_error.log crit;`: error\_log是个主模块指令，用来定义全局错误日志文件。日志输出级别有debug、info、notice、warn、error、crit可供选择，其中，debug输出日志最为最详细，而crit输出日志最少。
* `pid /usr/local/webserver/nginx/nginx.pid;`: 指定进程存放pid文件的位置，关闭nginx后文件会被删除。
* `worker_rlimit_nofile 65535;`: 用于指定一个nginx进程可以打开的最多文件描述符数目，这里是65535，需要使用命令“ulimit -n 65535”来设置。

## 二、events模块

```bash
events{
  use epoll;
  worker_connections      65536;
}
```

* `use epoll;`use是个事件模块指令，用来指定Nginx的工作模式。Nginx支持的工作模式有select、poll、kqueue、epoll、rtsig和/dev/poll。其中select和poll都是标准的工作模式，kqueue和epoll是高效的工作模式，不同的是epoll用在Linux平台上，而kqueue用在BSD系统中。对于Linux系统，epoll工作模式是首选。在操作系统不支持这些高效模型时才使用select。
* `worker_connections 65536;`每一个worker进程能并发处理（发起）的最大连接数（包含与客户端或后端被代理服务器间等所有连接数）。nginx作为反向代理服务器，计算公式 `最大连接数 = worker_processes * worker_connections/4`，所以这里客户端最大连接数是65536，这个可以增到到8192都没关系，看情况而定，但不能超过后面的worker\_rlimit\_nofile。当nginx作为http服务器时，计算公式里面是除以2。进程的最大连接数受Linux系统进程的最大打开文件数限制，在执行操作系统命令`ulimit -n 65536`后`worker_connections`的设置才能生效。

**Nginx基于IO多路复用**

IO复用解决的是并发性的问题，Socket作为复用,

- IO复用(串行,产生阻塞)
- IO复用(多线程, 消耗大)
- IO多路复用(主动上报)

多个描述符的I/O操作都能在一个线程内并发交替地顺序完成，这就叫I/O多路复用，这里的 "复用"指的是复用同一个线程。

IO多路复用的实现方式有select、poll、Epool

select缺点
1.能够监视文件描述符的数量存在最大限制
2.线性遍历扫描效率低下

epool模型
1.每当FD(文件描述符)就绪，采用系统的回调函数之间将fd放入,效率更高。
2.最大连接无限制

## 三、http模块

```text
http{
  include       mime.types;
  default_type  application/octet-stream;
  #charset  gb2312;
  }
```



* include是个主模块指令，实现对配置文件所包含的文件的设定，可以减少主配置文件的复杂度。类似于Apache中的include方法。
* default\_type属于HTTP核心模块指令，这里设定默认类型为二进制流，也就是当文件类型未定义时使用这种方式，例如在没有配置PHP环境时，Nginx是不予解析的，此时，用浏览器访问PHP文件就会出现下载窗口。
* charset gb2312; 指定客户端编码格式。

### 3.1 基本参数

```text
server_names_hash_bucket_size 128;
client_header_buffer_size 32k; 
large_client_header_buffers 4 128k; 
client_max_body_size 10m; 
client_body_buffer_size 128k; 
sendfile on ; 
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 65 : 
client_body_timeout 60s;
send_timeout 60s;
```



* `server_names_hash_bucket_size 128;`: 服务器名字的hash表大小。
* `client_header_buffer_size 32k;`：用来指定来自客户端请求头的header buffer 大小。对于大多数请求，1K的缓存已经足够了，如果自定义了消息头或有更大的cookie，可以增大缓存区大小。
* `large_client_header_buffers 4 128k;`：用来指定客户端请求中较大的消息头的缓存最大数量和大小，4为个数，128k为大小，最大缓存为4个128KB。
* `client_max_body_size 10m;` : 允许客户端请求的最大单文件字节数。如果有上传较大文件，请设置它的限制值。
* `client_body_buffer_size 128k;`: 缓冲区代理缓冲用户端请求的最大字节数。
* `sendfile on ;` : 开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，减少用户空间到内核空间的上下文切换。对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。开启 `tcp_nopush on;` 和`tcp_nodelay on;` 防止网络阻塞。
* `keepalive_timeout 65 :` : 长连接超时时间，单位是秒，这个参数很敏感，涉及浏览器的种类、后端服务器的超时设置、操作系统的设置，可以另外起一片文章了。长连接请求大量小文件的时候，可以减少重建连接的开销，但假如有大文件上传，65s内没上传完成会导致失败。如果设置时间过长，用户又多，长时间保持连接会占用大量资源。
* `client_body_timeout 60s;` : 用于设置客户端请求主体读取超时时间，默认是60s。如果超过这个时间，客户端还没有发送任何数据，nginx将返回`Request time out(408)`错误。
* `send_timeout :` : 用于指定响应客户端的超时时间。这个超时仅限于两个连接活动之间的时间，如果超过这个时间，客户端没有任何活动，Nginx将会关闭连接。

**sendfile**
传统文件传输, 在实现上其实是比较复杂的, 其具体流程细节如下：

> 1.调用read函数，文件数据被复制到内核缓冲区
> 2.read函数返回，文件数据从内核缓冲区复制到用户缓冲区
> 3.write函数调用，将文件数据从用户缓冲区复制到内核与socket相关的缓冲区。
> 4.数据从socket缓冲区复制到相关协议引擎。
> 传统文件传输数据实际上是经过了四次复制操作:
> 硬盘—>内核buf—>用户buf—>socket缓冲区(内核)—>协议引擎
> 也就是说传统的文件传输需要经过多次上下文的切换才能完成拷贝或读取, 效率不高。

sendfile文件传输是在内核中操作完成的, 函数直接在两个文件描述符之间传递数据, 从而避免了内核缓冲区数据和用户缓冲区数据之间的拷贝, 操作效率很高, 被称之为零拷贝。

> 1.系统调用sendfile函数通过 DMA 把硬盘数据拷贝到 kernel buffer，
> 2.数据被 kernel 直接拷贝到另外一个与 socket 相关的 kernel buffer。
> 3.DMA把数据从kernel buffer直接拷贝给协议栈。
> 
> 这里没有用户空间和内核空间之间的切换，在内核中直接完成了从一个buffer到另一个buffer的拷贝。

### 3.2 gzip模块设置
该模块对图片及视频的压缩效果不好，建议只压缩css、js、html等
```text
gzip on;
gzip_min_length 1k;
gzip_buffers    4 16k;
gzip_http_version 1.1;
gzip_comp_level 6;
gzip_types text/html text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
gzip_vary on;
```

* `gzip on;`开启gzip压缩输出
* `gzip_min_length 1k;` 最小压缩文件大小，页面字节数从header头的Content-Length中获取。默认值为0，不管多大页面都压缩，建议设置成大于1K的字节数，小于1K可能会越压越大。
* `gzip_buffers 4 16k;` 压缩缓冲区，表示申请四个16K的内存作为压缩结果流缓存，默认是申请与原始数据大小相同的内存空间来存储gzip压缩结果。
* `gzip_http_version 1.1;` 用于设置识别HTTP协议版本，默认是1.1，目前主流浏览器都已成指出。（默认1.1，前端如果是squid2.5请使用1.0）
* `gzip_comp_level 6;` 压缩等级，1压缩比最小，处理速度最快，9压缩比最大，传输速度快，但是消耗CPU资源。
* `gzip_types text/plain application/x-javascript text/css application/xml;`压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
* `gzip_vary on;` 和http头有关系，会在响应头加个 Vary: Accept-Encoding ，可以让前端的缓存服务器缓存经过gzip压缩的页面，例如，用Squid缓存经过Nginx压缩的数据。
* `gzip_proxied any;` Nginx作为反向代理的时候启用，决定开启或者关闭后端服务器返回的结果是否压缩，匹配的前提是后端服务器必须要返回包含”Via”的 header头。
* `limit_zone crawler $binary_remote_addr 10m;` 开启限制IP连接数的时候需要使用

### 3.3 日志配置
Nginx日志主要分为两种：访问日志和错误日志。两种日志都可以选择性关闭，默认都是打开的。

```
//配置语法: 包括: error.log access.log
Syntax: log_format name [escape=default|json] string ...;
Default:    log_format combined "...";
Context:    http

//Nginx默认配置
log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

$remote_addr    //表示客户端地址
$remote_user    //http客户端请求nginx认证用户名
$time_local     //Nginx的时间
$request        //Request请求行, GET等方法、http协议版本
$status         //respoence返回状态码
$body_bytes_sent    //从服务端响应给客户端body信息大小
$http_referer       //http上一级页面, 防盗链、用户行为分析
$http_user_agent    //http头部信息, 客户端访问设备
$http_x_forwarded_for   //http请求携带的http信息
```

**access_log**
access_log指令用来指定日志文件的存放路径（包含日志文件名）、格式和缓存大小，具体如下：
`access_log path(存放路径) [format(自定义日志格式名称) [buffer=size | off]]`
举例说明如下：

```
access_log logs/access.log main;
```

如果想关闭日志，可以如下：
`access_log off;`
能够使用access_log指令的字段包括：http、server、location。

需要注意的是：Nginx进程设置的用户和组必须对日志路径有创建文件的权限，否则，会报错。
Nginx支持为每个location指定强大的日志记录。同样的连接可以在同一时间输出到不止一个的日志中。

**错误日志**

错误日志主要记录客户端访问Nginx出错时的日志，格式不支持自定义。通过错误日志，你可以得到系统某个服务或server的性能瓶颈等。因此，将日志好好利用，你可以得到很多有价值的信息。错误日志由指令error_log来指定，具体格式如下：
`error_log path(存放路径) level(日志等级)`
path含义同access_log，level表示日志等级，具体如下：
`[ debug | info | notice | warn | error | crit ]`
从左至右，日志详细程度逐级递减，即debug最详细，crit最少。
举例说明如下：
```
error_log logs/error.log info;
```
需要注意的是：`error_log off`并不能关闭错误日志，而是会将错误日志记录到一个文件名为off的文件中。
正确的关闭错误日志记录功能的方法如下：
`error_log /dev/null;`
上面表示将存储日志的路径设置为“垃圾桶”。

### 3.4 stub_status 模块监控
stub_status模块主要用于查看Nginx的一些状态信息. 
本模块默认是不会编译进Nginx的,如果你要使用该模块,则要在编译安装Nginx时指定:
```
./configure –with-http_stub_status_module 
```
查看已安装的 Nginx 是否包含 stub_status 模块
```
nginx -V 
```
```
nginx version: nginx/0.6.32  

built by gcc 3.4.6 20060404 (Red Hat 3.4.6-10)  

configure arguments: --user=nginx --group=nginx --prefix=/home/nginx --with-http_stub_status_module   
```
`--with-http_stub_status_module`记录Nginx客户端基本访问状态信息

具体配置如下:
```
 location /mystatus {
    stub_status on;
    access_log off;
    allow SOME.IP.ADD.RESS;
    deny all;
}
```

重启nginx，访问http://ip:port/mystatus 得到Nginx_status概述
```
Active connections:2    //Nginx当前活跃连接数
server accepts handled requests
16     16     19
// server表示Nginx启动到现在共处理了16个连接。
// accepts表示Nginx启动到现在共成功创建16次握手。
// 请求丢失数=(握手数-连接数)可以看出,本次状态显示没有丢失请求。
// handled requests，表示总共处理了19次请求。
Reading     // Nginx读取到客户端的 Header 信息数。
Writing     // Nginx返回给客户端的 Header 信息数。
Waiting    // Nginx开启keep-alive长连接情况下, 既没有读也没有写, 建立连接情况
```

### 3.5 Nginx下载站点
Nginx默认是不允许列出整个目录浏览下载。
```
Syntax: autoindex on | off;
Default:    
autoindex off;
Context:    http, server, location

//autoindex常用参数
autoindex_exact_size off;
默认为on， 显示出文件的确切大小，单位是bytes。
修改为off，显示出文件的大概大小，单位是kB或者MB或者GB。

autoindex_localtime on;
默认为off，显示的文件时间为GMT时间。
修改为on， 显示的文件时间为文件的服务器时间。

charset utf-8,gbk;
默认中文目录乱码，添加上解决乱码。
```
配置目录浏览功能
```
//开启目录浏览
location / {
    root html;
    autoindex on;
    autoindex_localtime on;
    autoindex_exact_size off;
}
```

### 3.6 访问限制
nginx可以通过limit_conn_zone 和limit_req_zone两个组件来对客户端访问目录和文件的访问频率和次数进行限制，

** 访问连接限制**
```
//全局定义连接限制
Syntax:  limit_conn_zone key zone=name:size;
Default: —
Context: http
//引用连接限制
Syntax: limit_conn zone number;
Default: —
Context: http, server, location
```
示例如下：
```
http {
  imit_conn_zone $binary_remote_addr zone=one:10m;
  ............

  server {
    listen       80;
    server_name  www.abc.com;
    location / {
      limit_conn one 1;  #这将指定一个地址只能同时存在一个连接。“one”与上面的对应，也可以自定义命名
      limit_rate 300k;
  }

}
```
其中`  imit_conn_zone $binary_remote_addr zone=one:10m;`
定义一个叫“one”的记录区，总容量为 10M，以变量 $binary_remote_addr 作为会话的判断基准（即一个地址一个会话）。

`limit_conn one 1`：限制每个IP只能发起一个并发连接。

`limit_rate 300k`： 对每个连接限速300k. 注意，这里是对连接限速，而不是对IP限速。如果一个IP允许两个并发连接，那么这个IP就是限速limit_rate×2。

**访问频率限制**

```
//全局定义请求限制
Syntax:  limit_conn_zone key zone=name:size rate=rate;
Default: —
Context: http
//引用请求限制
Syntax: limit_conn zone number [burst=number] [nodelay];
Default: —
Context: http, server, location


//具体配置如下:
http {
//http段配置请求限制, rate限制速率，限制一秒钟最多一个IP请求
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
    ...
    server {
    ...  

        location / {
        //1r/s只接收一个请求,其余请求拒绝处理并返回错误码给客户端
            limit_req zone=req_zone;
        //请求超过1r/s,剩下的将被延迟处理,请求数超过burst定义的数量, 多余的请求返回503
            #limit_req zone=req_zone burst=3 nodelay;
        }

```

上面的参数会让nginx 每个IP一秒钟只处理一个请求，但是仍然会有很多还在队列里面等待处理，这样也会占用很多tcp连接，如果加上nodelay就会立即丢弃

**limit_conn_log_level**

语法： limit_conn_log_level info | notice | warn | error

默认值： error

使用字段： http, server, location

指定当连接数超过设定的最大连接数，服务器限制连接时的日志等级。

**访问ip限制**

Nginx 的访问控制模块默认就会安装，而且写法也非常简单，可以分别有多个allow,deny，允许或禁止某个ip或ip段访问，依次满足任何一个规则就停止往下匹配。

```
location /nginx-status {
  stub_status on;
  access_log off;
  allow 192.168.10.100;
  allow 172.29.73.0/24;
  deny all;
}
```



### 3.7 隐藏版本号

Nginx默认是显示版本号的，暴露出来的版本号就容易变成攻击者可利用的信息。所以，从安全的角度来说，隐藏版本号会相对安全些！

在http中添加该配置：server_tokens off;


## 四、配置虚拟主机

### 1. 配置流程

1. 复制一段完整的server标签段，到结尾。注意：要放在http的结束大括号前，也就是server标签段放入http标签。
2. 更改server\_name 及对应网页的root根目录。
3. 检查配置文件语法，平滑重启服务。
4. 创建server\_name 对应网页的根目录，并且建立测试文件，如果没有index首页会出现403错误。
5. 对客户端server\_name 的主机做host 解析或DNS配置。并检查（ping）。
6. 浏览器访问，或者在Linux客户端做host解析，用wget或curl 访问。

http服务上支持若干虚拟主机。每个虚拟主机一个对应的server配置项，配置项里面包含该虚拟主机相关的配置。

```text
server {
        listen       80;    //监听端口, 默认80
        server_name  blog.biglittleant.cn; //提供服务的域名或主机名
        
        //控制网站访问路径
        location / {
            root   /usr/share/nginx/html;   //存放网站路径
            index  index.html index.htm;    //默认访问首页文件
        }
        //错误页面,统一定义错误页面
        //定义请求错误, 指定错误代码
        error_page   500 502 503 504  /50x.html;
        //错误代码重定向到新的Locaiton
        location = /50x.html {
            root   html;
        }
    }
```

* `listen 80;` 监听端口，默认80，小于1024的要以root启动。可以为listen \*:80、listen 127.0.0.1:80等形式。
* `server_name blog.biglittleant.cn;` 服务器名，如localhost、[www.example.com](http://www.example.com/)，可以通过正则匹配。
* `root /usr/share/nginx/html` 定义服务器的默认网站根目录位置。如果locationURL匹配的是子目录或文件，root没什么作用，一般放在server指令里面或/下。
* `index index.jsp index.html index.htm` 定义路径下默认访问的文件名，一般跟着root放。

### 2. location模块的写法

proxy\_pass [http://backend](http://backend/)

```text
proxy_redirect off;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

## 五、负载均衡

问题：需要将负载分配给两个或者更多的服务器
方案：使用nginx的HTTP 模块实现负载均衡

使用nginx做负载均衡的两大模块：
upstream 定义负载节点池。
location 模块 进行URL匹配。

### upstream模块

nginx 的负载均衡功能依赖于 ngx_http_upstream_module模块，所支持的代理方式有 proxy_pass(一般用于反向代理),fastcgi_pass(一般用于和动态程序交互),memcached_pass,proxy_next_upstream,fastcgi_next_pass,memcached_next_pass 。

**upstream 模块应该放于http{}标签内。**

模块写法：

```
upstream backend {
    # 调度算法
    ip_hash; 
    
    # 后端服务器配置
    server backend1.example.com       weight=5;
    server backend2.example.com:8080;
    server backup1.example.com:8080   backup;
    server backup2.example.com:8080   backup;
   
    # 长链接设置
    keepalive 100;
}
```

#### 调度算法

- 轮询(rr)：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器故障，故障系统自动清除，使用户访问不受影响。
- 轮询权值(weight)：weight值越大，分配到的访问几率越高，主要用于后端每个服务器性能不均的情况。
- ip_hash：每个请求按访问IP的hash结果分配，这样来自同一个IP的固定访问一个后端服务器，主要解决动态网站session共享的问题。
- url_hash：按照访问的URL的hash结果来分配请求，是每个URL定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率，nginx本身不支持，如果想使用需要安装nginx的hash软件包。
- fair：这个算法可以依据页面大小和加载时间长短智能的进行负载均衡，也就是根据后端服务器的响应时间来分配请求，相应时间短的优先分配，默认不支持，如果想使用需要安装upstream_fail模块。
- least_conn：最少链接数，哪个机器连接数少就分发。



#### 后端服务器配置

语法：`server IP 调度状态`

server指令指定后端服务器IP地址和端口，同时还可以设定每个后端服务器在负载均衡调度中的状态。

- down 表示当前的server暂时不参与负载均衡。
- backup 预留的备份服务器，当其他所有的非backup服务器出现故障或者忙的时候，才会请求backup机器，因为这台集群的压力最小。
- max_fails 允许请求失败的次数，默认是1，当超过最大次数时，返回proxy_next_upstream模块定义的错误。0表示禁止失败尝试，企业场景：2-3.根据业务需求去配置。
- fail_timeout，在经历了max_fails次失败后，暂停服务的时间。根据业务需求配置。常规业务2-3秒合理。

### location 模块

作用：基于一个指令设置URI。

基本语法：

```
Syntax: location [ = | ~ | ~* | ^~ ] uri { ... }
location @name { ... }
Default:    —
Context:    server, location
```

- =     严格匹配。如果请求匹配这个location，那么将停止搜索并立即处理此请求
- ~     区分大小写匹配(可用正则表达式)
- ~*    不区分大小写匹配(可用正则表达式)
- !~    区分大小写不匹配
- !~*   不区分大小写不匹配
- ^~    如果把这个前缀用于一个常规字符串,那么告诉nginx 如果路径匹配那么不测试正则表达式

> 匹配是有优先级的，不是按照nginx的配置文件进行。

nginx首先检查使用前缀字符串定义的位置(前缀位置)，选择并记住匹配前缀最长的位置。然后按照正则表达式在配置文件中出现的顺序检查正则表达式。正则表达式的搜索在第一个匹配时终止，并使用相应的配置。如果没有找到与正则表达式的匹配，则使用前面记住的前缀位置配置。

如果最长的匹配前缀位置有“^~”修饰符，则不检查正则表达式

另外，使用" = "修饰符可以定义URI和位置的精确匹配。如果找到了精确的匹配，搜索将终止。例如，如果“/”请求频繁发生，定义“location = /”将加速处理这些请求，因为搜索在第一次比较之后立即终止。

> 如果一个位置是由一个以斜杠字符结尾的前缀字符串定义的，并且请求由proxy_pass、fastcgi_pass、uwsgi_pass、scgi_pass、memcached_pass或grpc_pass处理，则执行特殊的处理。对于URI等于此字符串但不带斜杠的请求的响应，一个带有代码301的永久重定向将被返回到所请求的URI，并附加斜杠。

Location区段匹配示例
```
location = / {
　　# 只匹配 / 的查询.
　　[ configuration A ]
}
location / {
　　# 匹配任何以 / 开始的查询，但是正则表达式与一些较长的字符串将被首先匹配。
　　[ configuration B ]
}
location ^~ /images/ {
　　# 匹配任何以 /images/ 开始的查询并且停止搜索，不检查正则表达式。
　　[ configuration C ]
}
location ~* \.(gif|jpg|jpeg)$ {
　　# 匹配任何以gif, jpg, or jpeg结尾的文件，但是所有 /images/ 目录的请求将在Configuration C中处理。
　　[ configuration D ]
} 
```

各请求的处理如下例：
```
■/ → configuration A
■/documents/document.html → configuration B
■/images/1.gif → configuration C
■/documents/1.jpg → configuration D
```

示例二
```
location / {
           return 401;
        }
location = / {
    return 402;
}
location /documents/ {
    return 403;
}
location ^~ /images/ {
    return 404;
}
location ~* \.(gif|jpg|jpeg)$ {
    return 500;
}
```

结果
```
# curl -I -s -o /dev/null -w "%{http_code}\n" http://10.0.0.7/
402

# curl -I -s -o /dev/null -w "%{http_code}\n" http://10.0.0.7/index.html
401

# curl -I -s -o /dev/null -w "%{http_code}\n" http://10.0.0.7/documents/document.html 
403

# curl -I -s -o /dev/null -w "%{http_code}\n" http://10.0.0.7/images/1.gif
404

# curl -I -s -o /dev/null -w "%{http_code}\n" http://10.0.0.7/dddd/1.gif  
500
```

**匹配的优先顺序:** `= > ^~（匹配固定字符串，忽略正则）> 完全相等 >~*>空>/` 。
工作中尽量将'='放在前面

#### alias与root的区别

- root   实际访问文件路径会拼接URL中的路径
- alias  实际访问文件路径不会拼接URL中的路径

示例如下：

```
location ^~ /sta/ {  
   alias /usr/local/nginx/html/static/;  
}
```

- 请求：http://test.com/sta/sta1.html
- 实际访问：/usr/local/nginx/html/static/sta1.html 文件

```
location ^~ /tea/ {  
   root /usr/local/nginx/html/;  
}
```

- 请求：http://test.com/tea/tea1.html
- 实际访问：/usr/local/nginx/html/tea/tea1.html 文件

alias后面必须要用“/”结束，否则会找不到文件的

#### try_files

```
Syntax:	try_files file ... uri;
				try_files file ... =code;
```
检查文件是否按指定顺序存在，并使用第一个找到的文件进行请求处理;处理在当前上下文中执行。文件的路径根据根指令和别名指令由file参数构造。可以通过在名称的末尾指定一个斜杠来检查目录是否存在，例如“$uri/”。

如果没有找到任何文件，将进行内部重定向到最后一个参数中指定的uri。

```
location /images/ {
    try_files $uri /images/default.gif;
}

location = /images/default.gif {
    expires 30s;
}
```
或者
```
location / {
    try_files /system/maintenance.html
              $uri $uri/index.html $uri.html
              @mongrel;
}

location @mongrel {
    proxy_pass http://mongrel;
}
```
该配置可以配合 React的Browser路由模式，避免出现404， 示例如下
```
location /react {
    alias /project/react/;
    try_files $uri /react/index.html;
  }
```
该方式也会存在缺点，只要/index.html存在，服务端就不会响应404，即使客户端请求了实际不存在的JS/CSS/图片文件。

要使非HTML请求实际资源不存在时响应404，方法是：若请求的资源不是HTML，则放弃尝试后备文件。
```
location /react {
    alias /project/react/;
    set $fallback_file /index.html;
    if ($http_accept !~ text/html) {
        set $fallback_file $uri;
    }
    try_files $uri $fallback_file;
  }
```


#### last 和 break关键字的区别

（1）last 和 break 当出现在location 之外时，两者的作用是一致的没有任何差异

（2）last 和 break 当出现在location 内部时：

- last    使用了last 指令，rewrite 后会跳出location 作用域，重新开始再走一次刚才的行为
- break  使用了break 指令，rewrite后不会跳出location 作用域，它的生命也在这个location中终结

#### permanent 和 redirect关键字的区别

- rewrite … permanent  永久性重定向，请求日志中的状态码为301
- rewrite … redirect     临时重定向，请求日志中的状态码为302

