# 博客部署与版本回滚指南

本文档记录博客的 CI/CD 部署链路，以及「每次部署打 tag + 发 Release」和「一键回滚」的完整机制与命令解释。

## 一、部署链路总览

```
push main
   │
   ▼
GitHub Actions（.github/workflows/deploy.yml）
   │  1. 安装依赖
   │  2. pnpm generate 生成静态站 → .output/public
   │  3. 算版本号
   │  4. 打包产物 → .output/release.zip
   │  5. ossutil 清空并上传到 OSS
   │  6. 创建 GitHub Release（打 tag + 挂上 release.zip）
   ▼
阿里云 OSS（线上静态站）
```

核心原则：**「有 Release = 这次构建确实部署成功了」**，因为 Release 是在 OSS 上传成功之后才创建的。

## 二、deploy.yml 关键步骤逐条解释

### 1. 生成版本号（这一步还没有真正打 tag）

```yaml
- name: Generate version tag
  id: version
  run: echo "tag=v$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)" >> "$GITHUB_OUTPUT"
```

- `date +%Y%m%d-%H%M%S`：格式化当前时间，如 `20261114-153000`；
- `git rev-parse --short HEAD`：当前 commit 的短哈希（前 7 位），如 `abc1234`；
- 拼出 `v20261114-153000-abc1234` 作为版本号；
- `>> "$GITHUB_OUTPUT"`：写入 GitHub Actions 的步骤输出文件，配合 `id: version`，后续用 `${{ steps.version.outputs.tag }}` 引用。

> 注意：这一步只是「算出」版本号字符串，真正打 tag 在最后一步。

### 2. 打包产物

```yaml
- name: Package release artifact
  run: |
    cd .output/public
    zip -q -r ../release.zip .
```

- `run: |`：`|` 表示后面是多行 shell 脚本，逐行执行；
- `cd .output/public`：进入构建产物目录；
- `zip -q -r ../release.zip .`：
  - `-q` 静默、`-r` 递归、`../release.zip` 输出到 `.output/release.zip`、`.` 打包当前目录全部内容。

### 3. 上传 OSS

```yaml
- name: Upload to OSS
  env:
    OSS_BUCKET: ${{ secrets.OSS_BUCKET }}
  run: |
    ossutil rm "oss://${OSS_BUCKET}/" -r -f || true
    ossutil cp -r .output/public/ "oss://${OSS_BUCKET}/" -f
```

- 先 `rm -r` 清空桶（`|| true` 表示即使报错也继续，防止首次部署时桶为空报错）；
- 再 `cp -r` 把 `.output/public/` 全部上传。

### 4. 真正打 tag + 发 Release + 挂压缩包

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    tag_name: ${{ steps.version.outputs.tag }}
    name: Release ${{ steps.version.outputs.tag }}
    files: .output/release.zip
    generate_release_notes: true
```

- `uses: softprops/action-gh-release@v2`：调用现成的 GitHub Action，封装了「打 tag + 建 Release + 传附件」；
- `tag_name`：真正打 tag 的地方，指向当前 commit；
- `files`：把 `release.zip` 作为附件挂到 Release 上；
- `generate_release_notes: true`：根据最近 commit 自动生成 release 说明。

这个 action 底层等价于：

```bash
git tag v20261114-153000-abc1234
git push origin v20261114-153000-abc1234
gh release create v20261114-153000-abc1234 --title "..." --generate-notes
gh release upload v20261114-153000-abc1234 .output/release.zip
```

> 压缩包挂在 **GitHub Release 的 Assets 附件区**，存在 GitHub 侧，不在 OSS、也不在 git 仓库里。仓库 → Releases → 对应版本 → Assets 可下载。

## 三、rollback.yml 回滚流程

手动触发（`workflow_dispatch`），填一个旧版本 tag，自动完成：

1. `gh release download <tag> --pattern 'release.zip'`：从 GitHub 下载那个版本的产物；
2. `unzip`：解压；
3. `ossutil rm + cp`：和部署一样，清空并重新上传到 OSS。

```yaml
- name: Download release artifact
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    mkdir -p /tmp/rollback
    gh release download "${{ inputs.tag }}" --pattern 'release.zip' --dir /tmp/rollback
```

> 回滚不会产生新的 tag/Release，本质是把某个历史版本的产物重新上线。

## 四、GitHub Actions 语法：run / uses / with / env

一个 job 由多个 `steps` 组成，每个 step 二选一：

| 关键字  | 作用                                    | 类比       |
| ------- | --------------------------------------- | ---------- |
| `run:`  | 直接在 runner 上执行 shell 命令         | 自己敲命令 |
| `uses:` | 调用一个别人写好的 Action（可复用步骤） | 调函数     |
| `with:` | 给 `uses:` 的那个 Action 传参数         | 传参       |
| `env:`  | 设置环境变量（`run:` 里的命令能读到）   | 环境变量   |

规则：

- `with:` 只能配合 `uses:` 出现，不能配合 `run:`；
- `env:` 可以配合 `run:`，也可以给 `uses:` 的 action 传环境变量；
- 一个 step 要么 `run:`、要么 `uses:`，不能同时有（有 `uses` 时通常配 `with`，有 `run` 时通常配 `env`）。

举例（来自 deploy.yml）：

```yaml
# 例1：用 action + 传参
- name: Setup pnpm
  uses: pnpm/action-setup@v4 # 调用现成 action
  with:
    version: 12.16.1 # 传参

# 例2：直接跑命令 + 环境变量
- name: Generate static site
  env:
    NUXT_PUBLIC_ARTALK_SERVER: ${{ secrets.NUXT_PUBLIC_ARTALK_SERVER }} # 设环境变量
  run: pnpm generate # 直接跑 shell 命令
```

## 五、日常操作手册

### 部署

push 到 main 即可，自动部署 + 打版本。查看版本历史：仓库 → Releases。

### 回滚

1. 仓库 → Actions → 左侧选 **Rollback to a Release**；
2. 点 **Run workflow**，填入要回退的 tag（如上一个正常版本）；
3. 跑完即完成回退。

### 手动触发部署

仓库 → Actions → 左侧选 **Deploy to Aliyun OSS** → **Run workflow**。
