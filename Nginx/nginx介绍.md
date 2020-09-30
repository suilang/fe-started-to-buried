Nginx因为它的稳定性、丰富的模块库、灵活的配置和低系统资源的消耗而闻名。

## nginx 的优点

1. 高并发。静态小文件
2. 占用资源少。2万并发、10个线程，内存消耗几百M。
3. 功能种类比较多。web,cache,proxy。每一个功能都不是特别强。
4. 支持epoll模型，使得nginx可以支持高并发。
5. nginx 配合动态服务和Apache有区别。（FASTCGI 接口）
6. 利用nginx可以对IP限速，可以限制连接数。
7. 配置简单，更灵活。

## nginx应用场合

1. 静态服务器。（图片，视频服务）另一个lighttpd。并发几万，html，js，css，flv，jpg，gif等。
2. 动态服务，nginx——fastcgi 的方式运行PHP，jsp。（PHP并发在500-1500，MySQL 并发在300-1500）。
3. 反向代理，负载均衡。日pv2000W以下，都可以直接用nginx做代理。
4. 缓存服务。类似 SQUID,VARNISH。
5. 负载均衡
6. 安全防护
7. 访问限制
8. 访问认证



## 安装nginx

在maxOS上安装nginx

1. 确保已经安装homebrew
2. 更新brew版本：`brew --update`
3. 安装nginx：` brew install nginx`

## 验证安装

```
# 查看nginx配置文件目录
$ open /usr/local/etc/nginx/

# 启动nginx
$ nginx

# 查看版本
$ nginx -v
```

当安装成功并且启动nginx后，打开浏览器访问`localhost:8080`，就能看到nginx的欢迎页



## 关键文件、命令和目录


### nginx文件和目录


- /etc/nginx/：配置文件的默认根目录

- /etc/nginx/nginx.conf 默认的配置文件

- /etc/nginx/conf.d/ 包含默认的HTTP服务器配置文件，文件以.conf结尾，并且文件被

  /etc/nginx/nginx.conf文件内的顶层http模块所引用

- /var/log/nginx/ 默认的log日志位置，在这个目录下可以找到access.log 和error.log 文件

| 路径                                                         | 类型     | 作用                        |
| :----------------------------------------------------------- | :------- | :-------------------------- |
| /etc/nginx  /etc/nginx/nginx.conf /etc/nginx/conf.d /etc/nginx/conf.d/default.conf | 配置文件 | Nginx主配置文件             |
| /etc/nginx/fastcgi_params /etc/nginx/scgi_params /etc/nginx/uwsgi_params | 配置文件 | Cgi、Fastcgi、Uwcgi配置文件 |
| /etc/nginx/win-utf /etc/nginx/koi-utf /etc/nginx/koi-win     | 配置文件 | Nginx编码转换映射文件       |
| /etc/nginx/mime.types                                        | 配置文件 | http协议的Content-Type      |
| /etc/rc.d/init.d/nginx /etc/rc.d/init.d/nginx-debug /etc/sysconfig/nginx /etc/sysconfig/nginx-debug | 配置文件 | 配置系统守护进程管理器      |
| /etc/logrotate.d/nginx                                       | 配置文件 | Nginx日志轮询,日志切割      |
| /usr/sbin/nginx /usr/sbin/nginx-debug                        | 命令     | Nginx终端管理命令           |
| /usr/share/doc/nginx-1.12.2 /usr/share/man/man8/nginx.8.gz   | 目录     | Nginx的帮助手册             |
| /var/cache/nginx                                             | 目录     | Nginx的缓存目录             |
| /var/log/nginx                                               | 目录     | Nginx的日志目录             |
| /etc/nginx/modules /usr/lib64/nginx /usr/lib64/nginx/modules | 目录     | Nginx模块目录               |
| /usr/share/nginx /usr/share/nginx/html /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html | 目录     | Nginx默认站点目录           |



### nginx命令

- nginx -h 显示help菜单
- nginx -v 显示nginx版本
- nginx -V：显示nginx版本、构建信息和配置参数
- nginx -t：测试nginx配置
- nginx -T： 测试nginx配置并且打印有效的配置到命令窗
- nginx -s signal： 发送信号给nginx主进程，包含 stop、quit、reload和reopen。

| 信号量 | 用途                      |
| ------ | ------------------------- |
| stop   | 立即结束nginx进程         |
| quit   | 在完成当前任务后结束进程  |
| reload | 使用配置文件重启nginx进行 |
| reopen | 指示nginx重新打开日志文件 |



###  配置符号参考


| 容量符号 | 含义   |
| -------- | ------ |
| k,K      | 千字节 |
| m,M      | 兆字节 |

| 时间符号 | 含义         |
| -------- | ------------ |
| ms       | 毫秒         |
| s        | 秒           |
| m        | 分钟         |
| h        | 小时         |
| d        | 日           |
| w        | 周           |
| M        | 一个月, 30天 |
| y        | 年, 365 天   |



## Nginx编译参数

查看Nginx编译参数

```
nginx -V
```

| --prefix=/etc/nginx                                       | 程序安装目录和路径                 |
| --------------------------------------------------------- | ---------------------------------- |
| --sbin-path=/usr/sbin/nginx                               | Nginx启动停止命令                  |
| --modules-path=/usr/lib64/nginx/modules                   | Nginx模块路径                      |
| --conf-path=/etc/nginx/nginx.conf                         | Nginx主配置文件路径                |
| --error-log-path=/var/log/nginx/error.log                 | Nginx错误日志路径                  |
| --http-log-path=/var/log/nginx/access.log                 | Nginx访问日志路径                  |
| --pid-path=/var/run/nginx.pid                             | NginxPid路径                       |
| --lock-path=/var/run/nginx.lock                           | Nginx锁路径                        |
| --http-client-body-temp-path=/var/cache/nginx/client_temp | client头部临时缓存文件             |
| --http-proxy-temp-path=/var/cache/nginx/proxy_temp        | proxy临时缓存文件                  |
| --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp    | fastcgi临时缓存文件                |
| --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp        | uwsgi临时缓存文件                  |
| --http-scgi-temp-path=/var/cache/nginx/scgi_temp          | scgi临时缓存文件                   |
| --user=nginx                                              | 设定Nginx进程启动用户              |
| --group=nginx                                             | 设定Nginx进程启动组(安全)          |
| --with-cc-opt                                             | 设置额外的参数将被添加到CFLAGS变量 |
| --with-ld-opt                                             | 设置附加的参数, 链接系统库         |



## Nginx常用模块

Nginx模块分为 Nginx官方模块以及Nginx第三方模块

| Nginx编译选项              | 模块作用                                                   |
| :------------------------- | :--------------------------------------------------------- |
| ngx_http_core_module       | 包含一些核心的http参数配置，对应Nginx的配置区块部分        |
| ngx_http_access_module     | 访问控制模块，用来控制网站用户对Nginx的访问                |
| ngx_http_gzip_module       | 压缩模块，对Nginx返回的数据压缩，属于性能优化模块          |
| ngx_http_fastcgi_module    | fastci模块，和动态应用相关的模块，例如PHP                  |
| ngx_http_proxy_module      | proxy代理模块                                              |
| ngx_http_upstream_module   | 负载均衡模块，可以实现网站的负载均衡功能及节点的健康检查。 |
| ngx_http_rewrite_module    | URL地址重写模块                                            |
| ngx_http_limit_conn_module | 限制用户并发连接数及请求数模块                             |
| ngx_http_limit_req_module  | 限制Nginx request processing rate根据定义的key             |
| ngx_http_log_module        | 访问日志模块，以指定的格式记录Nginx客户访问日志等信息      |
| ngx_http_auth_basic_module | Web认证模块，设置Web用户通过账号密码访问Nginx              |
| nginx_http_ssl_module      | ssl模块，用于加密的http连接，如https                       |



## Nginx内置变量

http核心模块的内置变量

> http请求变量
> Nginx内置变量
> 自定义变量

```
$uri: 当前请求的uri，不带参数
$request_uri: 请求的uri，带完整参数
$host: http请求报文中host首部,如果没有则以处理此请求的虚拟主机的主机名代替
$hostname: nginx服务运行在主机的主机名
$remote_addr: 客户端IP
$remote_port: 客户端端口
$remote_user: 使用用户认证时客户端用户输入的用户名
$request_filename: 用户请求中的URI经过本地root或alias转换后映射的本地文件路径
$request_method: 请求方法, GET POST PUT
$server_addr: 服务器地址
$server_name: 服务器名称
$server_port: 服务器端口
$server_protocol: 服务器向客户端发送响应时的协议, 如http/1.1 http/1.0
$scheme:在请求中使用scheme, 如http://xxx.com中的http
$http_HEADER: 匹配请求报文中指定的HEADER
$http_host: 匹配请求报文中的host首部
$document_root: 当前请求映射到的root配置
```



## HTTP状态码（HTTP Status Code）

是用以表示网页服务器HTTP响应状态的3位数字代码。

- 301—永久移动。被请求的资源已被永久移动位置；
- 302—请求的资源现在临时从不同的 URI 响应请求；
- 305—使用代理。被请求的资源必须通过指定的代理才能被访问；
- 307—临时跳转。被请求的资源在临时从不同的URL响应请求；
- 400—错误请求；
- 402—需要付款。该状态码是为了将来可能的需求而预留的，用于一些数字货币或者是微支付；
- 403—禁止访问。服务器已经理解请求，但是拒绝执行它；
- 404—找不到对象。请求失败，资源不存在；
- 406—不可接受的。请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体；

---

- **408**—请求超时；
- **409**—冲突。由于和被请求的资源的当前状态之间存在冲突，请求无法完成；
- **413**—响应实体太大。服务器拒绝处理当前请求，请求超过服务器所能处理和允许的最大值。
- **417**—期望失败。在请求头 Expect 中指定的预期内容无法被服务器满足；
- **418**—我是一个茶壶。超文本咖啡罐控制协议，但是并没有被实际的HTTP服务器实现；
- **420**—方法失效。
- **422**—不可处理的实体。请求格式正确，但是由于含有语义错误，无法响应；
- **500**—服务器内部错误。服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理；
- 502 -- 请求后端失败
- 504 请求超时