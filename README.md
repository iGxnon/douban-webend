# 豆瓣 Web

# 链接

+ [https://douban.skygard.cn](https://douban.skygard.cn)

# 前端部分

> 说实话，我目前没有任何前端项目开发的经验
>
> 所以我感觉这次考核对我来说是一个比较大的挑战，但也是我磨练前端技术的一个契机
>
> 毕竟我发现我平时分配给前端学习的时间属实是太少了🤣

# 后端部分

## 豆瓣 RESTful API

> 红岩寒假考核
>
> 一款仿豆瓣电影的后端 **RESTful API** 项目
>
> 基于gin的单体服务

## API 文档

+ [HTML 格式/可测试](https://api.douban.skygard.cn:8080/docs)
+ [Markdown 格式](./API.md)
+ [OpenAPI(Swagger) 格式](http://douban.skygard.cn/swagger/openapi.json)

## 持续构建

+ [http://jenkins.skygard.cn/job/douban-webend/](http://jenkins.skygard.cn/job/douban-webend/)

## 实现的Features

+ 用户账户

  >  登录，注册，短信验证登录，邮箱验证，第三方登录(支持 gitee 和 github)，账户信息增删改查
  >
  >  jwt 认证
  >
  >  无  session，方便进行横向拓展

+ 热重载

+ 日志集中

+ 数据的增删改查(主体)

+ Redis 验证码数据缓存

## 常见漏洞防护

+ XSS 

  > 攻击思路就是往网站里注入恶意js

  > 解决思路
  >
  > 1. 对用户的输入进行正则检测，如手机号码，邮箱地址等
  > 2. 对不能正则检测的(如用户评论)，前端做好 HTML 转义
  > 3. 对一些关键词替换，如 `javascript:` ，`<script>` 替换成 `javascript：`，`[script]`

+ CSRF

  > 攻击思路就是在别的网站诱导用户对本站进行高危操作，如更改密码

  > 解决思路
  >
  > 1. 高危操作需要短信或者邮箱验证
  > 2. 通过包含在在请求头的JWT来认证，并且保证前端在处理外链跳转时不允许把JWT写入请求头(避免泄露)
  > 3. 不使用 cookie 保存登录令牌

  > 虽然 cookie 的 samesite 属性设置成 lax 或者 strict 能够预防 CSRF ，但前提是用户的浏览器支持 samesite

+ SQL 注入

  > 攻击思路就是注入恶意SQL语句

  > 解决思路
  >
  > 1. 严格的正则检测
  > 2. 对不能正则检测的数据使用 SQL 预处理

## 整体架构

### 分层

+ 整体分了 **4** 层：dao service controller api
+ 各层分工

> dao：和数据库IO层
>
> service:：整体的服务逻辑层
>
> controller：service 调度
>
> api：controller 调度｜入参检测

### Response

> 封装了一个Error：ServerError 和一个 RespData
>
> 用于返回最后的JSON response
>

## 集群部署

> 一个好的代码肯定得有一个好的部署方案，这样才会保证服务的**高可用性**
>
> ~~更何况是我写的这种垃圾代码呢，放到实际生产环境只能靠堆配置才能勉强提供服务~~

### 前端部署

> 前端的文件全部部署到对象存储中，并开启 CDN 加速
>
> 域名解析到不同的储存桶上，借用 DNS 解析来做负载均衡

### 日志部署

> 使用标准库的 log 和 gin 自带的日志
>
> 日志会写到服务器本地文件和控制台
>
> 集群内的服务器定时会向中央日志仓库(COS)发送日志

### 后端部署

> 容器化后端程序后部署到容器服务中（例如 tencent cloud 的云托管）
>
> 常规部署

# 总结

+ 初探分布式(太深奥了)，集群部署
+ 容器化
+ 数据库的一些零散的知识
+ 应用了一学期所学的知识
+ 项目很多地方重复性很高(懒得抽离)
+ 某些问题上也没有想最好的方案而是能用就行(
+ 数据库方面只停留在会敲几个SQL语句而已...
+ 为了防止恶意代码注入攻击做了很多正则检测
+ 在枯燥的 CRUD 中保持好心情...
