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

```bash
# 为提交打标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 推送特定标签
git push origin v1.0.0

# 查看标签对应的提交
git log -1 --format=format:"%H %s" v1.0.0
```

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