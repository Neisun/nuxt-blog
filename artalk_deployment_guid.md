# Artalk 评论系统部署与 Nginx HTTPS 反向代理配置指南

## 环境信息

- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64-bit
- **公网 IP**: 123.57.228.104
- **域名**: comment.myhns.cn
- **SSL 证书路径**: `/etc/nginx/ssl/myhns.cn.cer` & `/etc/nginx/ssl/myhns.cn.key`（通配符证书）
- **Docker 版本**: CE 26.1.3
- **Nginx**: 已安装并运行

---

## 一、清理旧环境

```bash
# 停止并删除旧 Artalk 容器，清除数据目录
docker rm -f artalk && rm -rf /root/artalk
```

## 二、部署 Artalk 容器

```bash
# 创建数据目录
mkdir -p /root/artalk

# 启动 Artalk 容器（注意：容器内服务监听 23366，映射到宿主机 8080）
docker run -d \
  --name artalk \
  --restart always \
  -p 8080:23366 \
  -v /root/artalk:/data \
  artalk/artalk-go:latest
```

## 三、初始化管理员账号

```bash
docker exec artalk artalk admin \
  --username 填用户 \
  --password 填密码 \
  --email 填邮箱
```

## 四、设置站点信息（直接写入 SQLite）

> ⚠️ Artalk 的 `artalk.yml` 仅用于初始化，已有站点信息存储在 SQLite 数据库中，修改配置文件不会同步更新。

```bash
# 更新站点名称和关联 URL
docker exec artalk sqlite3 /data/artalk.db \
  "UPDATE sites SET name='胡乃嵩的博客', urls='https://blog.myhns.cn' WHERE id=1;"
```

## 五、配置 Nginx HTTPS 反向代理

创建配置文件 `/etc/nginx/conf.d/comment.conf`：

```nginx
# HTTP → HTTPS 强制重定向
server {
    listen 80;
    server_name comment.myhns.cn;
    return 301 https://$host$request_uri;
}

# HTTPS 反向代理至 Artalk
server {
    listen 443 ssl http2;
    server_name comment.myhns.cn;

    ssl_certificate     /etc/nginx/ssl/myhns.cn.cer;
    ssl_certificate_key /etc/nginx/ssl/myhns.cn.key;

    location / {
        proxy_pass http://127.0.0.1:8080;  # 指向宿主机映射端口
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

验证并重载 Nginx：

```bash
nginx -t && nginx -s reload
```

## 六、添加可信域名（关键步骤）

Artalk 默认拒绝非可信域名的请求，必须显式添加 `https://blog.myhns.cn`。

**方法：编辑配置文件**

```bash
# 在宿主机编辑挂载的配置文件
vi /root/artalk/data/artalk.yml
```

找到或添加 `trusted_domains` 字段：

```yaml
trusted_domains:
  - https://blog.myhns.cn
```

保存后重启容器使配置生效：

```bash
docker restart artalk
```

> 💡 也可通过管理后台「设置 → 安全」页面添加，效果相同。

## 七、验证部署

```bash
# 测试 HTTPS 正常响应
curl -I https://comment.myhns.cn/sidebar/

# 测试 HTTP 重定向（必须携带 Host 头模拟域名访问）
curl -I -H "Host: comment.myhns.cn" http://123.57.228.104/
```

预期结果：

- HTTPS 请求返回 `HTTP/2 200`
- HTTP 请求返回 `301 Moved Permanently`

---

## 八、表情包 CDN 镜像配置（国内访问）

### 问题

Artalk 默认从 `https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json` 加载表情包，但 `cdn.jsdelivr.net` 在国内访问不稳定（连接被重置），导致评论框表情加载失败：

```
GET https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json net::ERR_CONNECTION_RESET
[Emoticons] Load Failed: TypeError: Failed to fetch
```

### 解决

前端初始化时通过 `emoticons` 配置项改用 `fastly.jsdelivr.net` 镜像（国内可访问）：

```ts
Artalk.init({
  // ...其余配置
  emoticons:
    "https://fastly.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json",
});
```

> 实测（2026-11）：`fastly.jsdelivr.net` 返回 200，`cdn.jsdelivr.net` 连接失败。

---

## 后续事项

1. 确认 DNS A 记录 `comment.myhns.cn` 已指向 `123.57.228.104`
2. 在博客前端嵌入 Artalk JS SDK 并测试评论提交功能
3. （可选）配置邮件通知、Gravatar 头像、Markdown 支持等高级功能
