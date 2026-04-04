# Git 基础总结

本章介绍 Git 的核心命令和基础操作，结合实用的使用技巧。

## 1. 获取 Git 仓库

### 初始化仓库

在已存在目录中初始化：

```bash
git init
```

这会创建 `.git` 子目录，但文件还未被跟踪。

### 克隆现有仓库

```bash
git clone <url>                    # 克隆到当前目录
git clone <url> myproject          # 克隆并指定目录名
```

支持的协议：`https://`、`git://`、`ssh://`

## 2. 记录更新到仓库

### 文件状态变化周期

```
工作目录 → 暂存区 → Git仓库
(未跟踪)   (已暂存)   (已提交)
```

### 基本命令

```bash
git add         # 暂存文件（跟踪新文件/暂存修改）
git add .                 # 暂存所有修改
git commit -m "message"   # 提交暂存区的文件
git commit -am "message"  # 直接提交已跟踪文件的修改（跳过暂存）
```

### 实际工作场景

**场景一：新建项目并首次提交**

```bash
# 1. 初始化仓库
git init

# 2. 创建 .gitignore 文件（在添加文件之前）
echo "node_modules/\n.env\n.DS_Store" > .gitignore

# 3. 添加所有文件到暂存区
git add .

# 4. 查看将要提交的内容
git status

# 5. 确认无误后提交
git commit -m "Initial commit: 项目初始化"
```

**场景二：修改部分文件并分批提交**

```bash
# 假设修改了多个文件，但想分多次提交

# 1. 查看修改了哪些文件
git status

# 2. 只暂存登录相关的修改
git add src/login.js src/styles/login.css

# 3. 提交第一次修改
git commit -m "feat: 优化登录页面样式"

# 4. 再暂存其他修改
git add src/utils.js

# 5. 提交第二次修改
git commit -m "fix: 修复工具函数bug"
```

**场景三：撤销错误操作**

```bash
# 场景1: 暂存了不该暂存的文件
git add secret.key  # 错误：不应该提交密钥文件
git reset HEAD secret.key  # 取消暂存

# 场景2: 修改了文件但想放弃修改
git restore config.js  # 丢弃工作区修改

# 场景3: 提交信息写错了
git commit --amend -m "正确的提交信息"
```

### 技巧：查看状态

```bash
git status                # 查看详细状态
git status -s             # 简洁输出
git status --short        # 同上
```

状态标记：
- `??` - 未跟踪的新文件
- `A` - 新添加到暂存区
- `M` - 修改过
- `D` - 删除

### 技巧：.gitignore 文件

忽略不需要版本控制的文件：

```bash
# 忽略所有 .log 文件
*.log

# 忽略 build 目录
build/

# 但跟踪 lib.jar
!lib.jar

# 忽略当前目录下的 TODO
/TODO

# 忽略 doc 目录下所有 .pdf 文件
doc/**/*.pdf
```

## 3. 查看提交历史

### 基本命令

```bash
git log                        # 查看提交历史
git log -p                     # 显示每次提交的差异
git log --stat                 # 显示统计信息
git log --oneline              # 单行显示
git log --graph                # 图形化显示分支
git log --author="name"        # 按作者过滤
git log --since="2024-01-01"   # 按时间过滤
git log --grep="keyword"       # 按提交说明过滤
```

### 常用组合

```bash
# 查看最近3次提交
git log -3

# 单行图形化显示所有分支
git log --oneline --graph --all

# 查看特定文件的修改历史
git log -p 
```

### 技巧：对比差异

```bash
git diff                  # 工作区 vs 暂存区
git diff --staged         # 暂存区 vs 最新提交
git diff HEAD             # 工作区 vs 最新提交
git diff commit1 commit2  # 比较两个提交
```

## 4. 撤消操作

### 修改最后一次提交

```bash
git commit --amend        # 修改最后一次提交的信息或添加遗漏的文件
```

### 撤消暂存

```bash
git reset HEAD <file>     # 取消暂存某个文件
git reset HEAD            # 取消所有暂存
```

### 撤消修改

```bash
git checkout -- <file>    # 丢弃工作区的修改（危险！）
git restore <file>        # 同上（新语法，更安全）
git restore --staged <file>  # 取消暂存但保留修改
```

### 技巧：使用 restore 更安全地撤消

```bash
# 从暂存区恢复，工作区保留修改
git restore --staged file.txt

# 从 HEAD 恢复，丢弃所有修改
git restore file.txt

# 使用 git restore 可以更精细地控制
git restore -p <file>     # 交互式选择要恢复的部分
```

### 常见撤消场景详解

**场景一：提交后发现遗漏文件**

```bash
# 1. 提交后发现忘记添加某个文件
git commit -m "Add login feature"
# 突然发现忘记添加 config.js

# 2. 解决方案：添加遗漏文件并修改提交
git add config.js
git commit --amend --no-edit  # 追加到上一次提交，不修改提交信息

# 或者修改提交信息
git commit --amend -m "Add login feature and config"
```

**场景二：提交到了错误的分支**

```bash
# 1. 在 main 分支上提交了应该提交到 feature 分支的代码
git checkout main
git commit -m "Add new feature"  # 错误的提交！

# 2. 撤销提交，但保留修改
git reset --soft HEAD~1

# 3. 切换到正确的分支
git checkout feature

# 4. 重新提交
git commit -m "Add new feature"
```

**场景三：撤销已推送的提交**

```bash
# 方案1: 创建反向提交（推荐，适合已推送到远程的情况）
git revert <commit-hash>
git push origin main

# 方案2: 强制回退（危险！仅适合未推送或个人分支）
git reset --hard HEAD~1
git push origin main --force  # 警告：会改写历史，团队分支禁用！
```

**场景四：误删文件恢复**

```bash
# 场景1: 删除了工作区的文件（未提交删除操作）
git restore deleted-file.js

# 场景2: 已提交删除，想恢复文件
# 查找删除该文件的提交
git log --oneline --all -- deleted-file.js
# 恢复文件
git checkout <commit-before-delete> -- deleted-file.js

# 场景3: 使用 git restore 从特定提交恢复
git restore --source=HEAD~2 deleted-file.js
```

**场景五：想看某个文件的旧版本**

```bash
# 查看文件的历史版本
git log --oneline filename.js

# 查看特定版本的文件内容
git show abc1234:filename.js

# 恢复到特定版本（不提交）
git restore --source=abc1234 filename.js

# 恢复并提交
git checkout abc1234 -- filename.js
git commit -m "Revert filename.js to version abc1234"
```

**重要区别总结**：

| 命令 | 工作区 | 暂存区 | 提交历史 | 安全性 |
|------|--------|--------|----------|--------|
| `git restore <file>` | 丢弃修改 | - | 不变 | ⚠️ 危险 |
| `git restore --staged <file>` | 保留修改 | 取消暂存 | 不变 | ✅ 安全 |
| `git reset --soft HEAD~1` | 保留修改 | 保留修改 | 撤销提交 | ✅ 安全 |
| `git reset --mixed HEAD~1` | 保留修改 | 取消暂存 | 撤销提交 | ✅ 安全 |
| `git reset --hard HEAD~1` | 丢弃修改 | 丢弃修改 | 撤销提交 | ❌ 危险 |
| `git revert <commit>` | 新建反向提交 | - | 新增提交 | ✅ 最安全 |

## 5. 远程仓库的使用

### 基本操作

```bash
git remote -v                     # 查看远程仓库
git remote add <name> <url>       # 添加远程仓库
git remote remove <name>          # 删除远程仓库
git remote rename <old> <new>     # 重命名远程仓库
git remote show <name>            # 查看远程仓库详情
```

### 拉取和推送

```bash
git fetch <remote>                # 拉取但不合并不
git pull <remote> <branch>        # 拉取并合并
git push <remote> <branch>        # 推送到远程
git push -u <remote> <branch>     # 推送并设置上游分支
```

### 技巧：解决拉取冲突

```bash
# 拉取时遇到冲突
git pull --rebase <remote> <branch>  # 使用变基代替合并

# 解决冲突后
git add .
git rebase --continue
```

### 团队协作常见场景

**场景一：参与开源项目（Fork 工作流）**

```bash
# 1. Fork 项目后，克隆你的 Fork 仓库
git clone https://github.com/your-username/project.git
cd project

# 2. 添加上游仓库（原始仓库）
git remote add upstream https://github.com/original-owner/project.git

# 3. 创建功能分支
git checkout -b feature/new-feature

# 4. 开发完成后，确保代码是最新的
git fetch upstream
git rebase upstream/main

# 5. 推送到你的 Fork
git push origin feature/new-feature

# 6. 在 GitHub/GitLab 上创建 Pull Request
```

**场景二：团队协作（特性分支工作流）**

```bash
# 1. 从主分支创建特性分支
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# 2. 开发过程中定期同步主分支
git fetch origin
git rebase origin/main  # 或者 git merge origin/main

# 3. 开发完成后推送到远程
git push origin feature/user-authentication

# 4. 在远程平台创建 Merge Request / Pull Request

# 5. 代码合并后删除本地特性分支
git checkout main
git pull origin main
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication  # 删除远程分支
```

**场景三：紧急修复生产环境问题**

```bash
# 1. 基于生产标签创建修复分支
git checkout -b hotfix/login-bug v1.2.0

# 2. 修复问题
git add .
git commit -m "fix: 修复登录超时问题"

# 3. 创建修复标签
git tag -a v1.2.1 -m "Hotfix: 修复登录bug"

# 4. 推送修复
git push origin hotfix/login-bug
git push origin v1.2.1

# 5. 合并回主分支
git checkout main
git merge hotfix/login-bug
git push origin main
```

**场景四：多人协作时解决冲突**

```bash
# 1. 推送时发现远程有新提交
git push origin main
# 报错: ! [rejected] main -> main (fetch first)

# 2. 先拉取远程更新
git pull origin main

# 3. 如果有冲突，手动解决冲突文件
# 打开冲突文件，会看到类似内容：
# <<<<<<< HEAD
# 你的修改
# =======
# 他人的修改
# >>>>>>> origin/main

# 4. 编辑文件，保留正确的代码
# 5. 标记冲突已解决
git add resolved-file.js

# 6. 完成合并
git commit -m "merge: 解决与远程main分支的冲突"

# 7. 再次推送
git push origin main
```

## 6. 打标签

### 创建标签

```bash
git tag                          # 列出所有标签
git tag -l "v1.8.5*"             # 搜索标签
git tag -a v1.4 -m "version 1.4" # 创建附注标签
git tag v1.4-lw                  # 创建轻量标签
```

### 操作标签

```bash
git show v1.4                    # 查看标签详情
git push origin v1.4             # 推送标签到远程
git push origin --tags           # 推送所有标签
git tag -d v1.4                  # 删除本地标签
git push origin :refs/tags/v1.4  # 删除远程标签
git checkout -b <branch> <tag>   # 从标签创建分支
```

### 技巧：使用标签发布版本

**场景一：版本发布完整流程**

```bash
# 步骤1: 确保代码是最新的
git checkout main
git pull origin main

# 步骤2: 确认要打标签的提交（查看最近的提交记录）
git log --oneline -5

# 步骤3: 为当前提交打标签（推荐使用附注标签）
git tag -a v1.0.0 -m "Release v1.0.0: 新增用户登录功能"

# 步骤4: 推送标签到远程仓库
git push origin v1.0.0

# 步骤5: 验证标签
git show v1.0.0
```

**场景二：为历史提交补打标签**

```bash
# 查看历史提交，找到需要打标签的提交
git log --oneline --all

# 为特定提交打标签（使用提交哈希）
git tag -a v0.9.0 abc1234 -m "Release v0.9.0"

# 推送标签
git push origin v0.9.0
```

**场景三：标签与分支的关系**

```bash
# 从标签创建修复分支（用于修复历史版本的bug）
git checkout -b hotfix-v1.0.1 v1.0.0

# 修复完成后，创建新标签
git tag -a v1.0.1 -m "Hotfix: 修复登录问题"
git push origin v1.0.1

# 切换回标签查看代码状态
git checkout v1.0.0  # 进入"游离 HEAD"状态
git checkout -b test-v1.0.0  # 基于标签创建测试分支
```

**场景四：删除错误的标签**

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
# 或者使用旧语法
git push origin :refs/tags/v1.0.0
```

**常见问题解答**：

Q: 标签应该打在提交前还是提交后？  
A: **标签必须打在提交后**。标签是指向特定提交的指针，没有提交就无法创建标签。

Q: 附注标签和轻量标签怎么选？  
A: **推荐使用附注标签**（`-a` 选项），因为它包含创建者、日期、说明等信息，适合版本发布。轻量标签只是简单的指针，适合临时标记。

Q: 标签会自动推送到远程吗？  
A: **不会**。`git push` 默认不推送标签，需要显式推送：
- `git push origin <tagname>` 推送单个标签
- `git push origin --tags` 推送所有标签

## 7. Git 别名

### 创建别名

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.last 'log -1 HEAD'
git config --global alias.unstage 'reset HEAD --'
```

### 实用别名推荐

```bash
# 简写常用命令
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.graph "log --oneline --graph --all"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"

# 快速操作
git config --global alias.co "checkout"
git config --global alias.ci "commit"
git config --global alias.st "status -sb"
git config --global alias.df "diff"
```

## 8. 总结

Git 基础命令的核心：

1. **获取仓库**：`git init` 或 `git clone`
2. **记录更新**：`git add` + `git commit`
3. **查看状态**：`git status`、`git log`、`git diff`
4. **撤消操作**：`git reset`、`git restore`、`git checkout`
5. **远程协作**：`git remote`、`git fetch/pull/push`
6. **版本标记**：`git tag`
7. **提高效率**：`git alias`

> **技巧提示**：
> - 养成经常查看 `git status` 的习惯
> - 使用 `.gitignore` 排除不需要跟踪的文件
> - 提交前仔细检查 `git diff`
> - 为常用命令设置别名提高效率