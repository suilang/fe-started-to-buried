# 前端安全与认证

前端安全是Web开发中至关重要的一环，涉及用户身份认证、数据传输安全、跨域资源共享、常见攻击防护等多个方面。本章节将系统整理前端安全相关的核心知识。

## 一、身份认证

### 1. Cookie 与 Session

传统的身份认证方式，通过服务端存储Session，客户端存储Cookie来实现用户状态保持。

**核心知识点：**
- Cookie的工作原理与属性（HttpOnly、Secure、SameSite）
- Session的存储机制与安全考虑
- Cookie vs Session的优缺点对比
- 分布式环境下的Session共享问题

### 2. JWT (JSON Web Token)

无状态的身份认证方案，服务端无需存储Session，适合分布式系统和微服务架构。

**核心知识点：**
- JWT的结构：Header、Payload、Signature
- JWT的签名算法（HS256、RS256）
- JWT的存储方式（localStorage vs Cookie）
- JWT的安全隐患与最佳实践
- JWT的刷新机制（Refresh Token）

### 3. OAuth 2.0

开放授权协议，允许第三方应用在用户授权下访问用户资源，无需暴露用户密码。

**核心知识点：**
- OAuth 2.0的四种授权模式
  - 授权码模式（Authorization Code）- 最安全，适合服务端应用
  - 隐式授权模式（Implicit）- 适合纯前端应用（已不推荐）
  - 密码模式（Resource Owner Password Credentials）- 信任度高
  - 客户端凭证模式（Client Credentials）- 服务间通信
- OAuth 2.0流程详解
- Access Token与Refresh Token
- PKCE扩展（Proof Key for Code Exchange）

### 4. SSO 单点登录

一次登录，多系统共享认证状态，提升用户体验。

**核心知识点：**
- SSO的核心原理
- 同域SSO实现方案（共享Cookie）
- 跨域SSO实现方案
  - CAS（Central Authentication Service）
  - OAuth 2.0方式
- SLO单点登出

### 5. OIDC (OpenID Connect)

在OAuth 2.0基础上增加身份认证层，提供用户身份信息。

**核心知识点：**
- OIDC与OAuth 2.0的关系
- ID Token的结构与验证
- 用户信息获取（UserInfo Endpoint）

## 二、传输安全

### 1. HTTPS

HTTP的安全版本，通过SSL/TLS加密传输数据。

**核心知识点：**
- HTTPS的工作原理
- SSL/TLS握手过程
- 数字证书与CA机构
- 混合加密机制
- 前端HTTPS配置与强制跳转

### 2. 跨域安全

### CORS (Cross-Origin Resource Sharing)

浏览器安全策略，控制跨域资源访问。

**核心知识点：**
- 同源策略（Same-Origin Policy）
- CORS的工作原理
- 简单请求与预检请求（Preflight）
- Access-Control相关响应头
- 凭证携带（withCredentials）
- 常见跨域解决方案对比

## 三、常见攻击与防护

### 1. XSS (Cross-Site Scripting) 跨站脚本攻击

攻击者注入恶意脚本，窃取用户信息或执行恶意操作。

**核心知识点：**
- XSS攻击类型
  - 反射型XSS
  - 存储型XSS
  - DOM型XSS
- XSS防护措施
  - 输入过滤与输出编码
  - Content Security Policy (CSP)
  - HttpOnly Cookie
- 前端框架的XSS防护机制

### 2. CSRF (Cross-Site Request Forgery) 跨站请求伪造

诱导用户在已登录状态下发起恶意请求。

**核心知识点：**
- CSRF攻击原理
- CSRF防护措施
  - CSRF Token
  - SameSite Cookie
  - 验证Referer/Origin头
- 前后端分离项目的CSRF防护

### 3. 点击劫持 (Clickjacking)

攻击者将恶意页面嵌入iframe，诱导用户点击。

**核心知识点：**
- 点击劫持攻击原理
- X-Frame-Options响应头
- CSP的frame-ancestors指令

### 4. 中间人攻击 (MITM)

攻击者拦截并可能篡改通信数据。

**核心知识点：**
- 中间人攻击原理
- HTTPS的防护作用
- HSTS (HTTP Strict Transport Security)
- 证书绑定（Certificate Pinning）

## 四、前端安全最佳实践

### 1. 敏感数据处理

- 避免在前端存储敏感信息
- localStorage vs sessionStorage的安全考虑
- 敏感数据传输加密

### 2. 第三方脚本安全

- 第三方脚本的风险评估
- Subresource Integrity (SRI)
- 外部脚本的加载策略

### 3. 安全响应头

- Content-Security-Policy (CSP)
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

## 学习路线建议

1. **入门阶段**：理解Cookie/Session、HTTPS基础、同源策略
2. **进阶阶段**：掌握JWT、OAuth 2.0、CORS配置
3. **深入阶段**：理解XSS/CSRF防护、CSP策略、SSO实现
4. **实战阶段**：结合项目实践，建立完整的安全防护体系

---

安全无小事，前端安全需要开发者在每个环节都保持警惕。本章节内容将持续更新完善。