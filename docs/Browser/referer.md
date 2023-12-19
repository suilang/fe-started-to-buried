# Referer策略

浏览器在发起网络请求时携带的`Referer`头部用于标识请求发起的源页面地址。它主要有以下用途：

- 来源追踪：服务器可以通过`Referer`头部了解用户从哪个页面链接跳转过来的，这对于分析网站流量来源很有帮助。
- 防盗链：网站可以检查`Referer`头部来确定请求是否由授权的来源发起，以防止其他网站盗用资源。
- 缓存优化：代理服务器或CDN可能会根据`Referer`头部决定是否提供缓存内容。
- 个性化内容：网站可能根据`Referer`提供定制化内容或推荐。

但是，也存在隐私问题，因为`Referer`可能会泄露用户浏览信息。因此，有时会通过`HTTP`头部的`Referrer-Policy`来控制`Referer`头部的发送策略。

`Referrer-Policy` 可以由前端或服务端设置。

## 前端设置

在HTML中，可以通过`<meta>`标签来指定：

```html
<meta name="referrer" content="no-referrer">
```

关于`meta`标签中`name`为`referrer`时，`content`可以是以下几个值：

- `no-referrer`：不发送referer头部。
- `origin`：发送referer头部，但只包含主域部分。
- `no-referrer-when-downgrade`：默认值，对于跨协议请求（例如从HTTPS网页到HTTP网页），不发送`referer`头部；对于同协议请求，发送`referer`头部，但只包含主域部分。
- `origin-when-cross-origin`：对于跨域请求，发送`referer`头部，但只包含主域部分；对于同域请求，发送完整URL路径作为`referer`。
- `unsafe-url`：发送完整URL路径作为`referer`，包括路径和查询参数。

当你将`meta`标签的`content`设置为`unsafe-url`时，它会将`referer`设置为完整的URL路径，包括路径和查询参数。这可能会带来以下安全风险：

- 隐私泄露：完整的URL路径可能包含敏感信息，例如会话标识、个人身份信息等。将完整URL路径作为`referer`可能会泄露这些敏感信息给第三方网站。
- 信息泄露：通过`referer`头部，网站所有者可以获得访问来源的信息，包括从哪个网页跳转过来。使用完整URL路径作为`referer`可能会泄露用户访问来源的信息。
- 跨站请求伪造（CSRF）：完整URL作为`referer`可能会增加跨站请求伪造攻击的风险，攻击者可以利用`referer`来伪装请求来源，从而进行恶意操作。

请注意，虽然在某些情况下使用`unsafe-url`可以满足你的需求，但它可能会增加安全风险。在使用时，请确保评估并采取适当的安全措施来保护用户隐私和防止潜在的攻击。

## 服务端设置

在HTTP响应头中设置`Referrer-Policy`：

```js
Referrer-Policy: no-referrer
```

当服务端在响应中设置`Referrer-Policy`时，它会影响浏览器在处理当前页面的后续请求时`Referer`头部的发送行为。也就是说，服务端设置的`Referrer-Policy`会影响当前页面加载后续资源或发起的其他请求的`Referer`传递策略。

在实际应用中，通常希望服务端预先设置好`Referrer-Policy`，这样浏览器在接收到第一次响应后，就能够按照这个策略处理所有后续请求。如果服务端在后续的响应中改变或重新设置`Referrer-Policy`，那么浏览器将按照最新的策略处理接下来的请求。