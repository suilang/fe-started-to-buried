# Git 分支总结

本章介绍 Git 的分支模型，结合 Gitflow 工作流进行总结。

## 1. 分支简介

### 分支概念

Git 分支本质上是指向提交对象的可变指针（40字节的 SHA-1 值）。创建分支就是创建一个可以移动的指针。

**为什么 Git 分支操作如此轻量？**

传统版本控制系统（如 SVN）创建分支需要复制整个项目文件，速度慢且占用空间。而 Git 创建分支仅需创建一个 41 字节的文件（40 字节 SHA-1 + 换行符），因为：

1. **分支只是指针**：指向某个提交对象，不复制文件
2. **提交对象不可变**：每次提交创建新对象，而不是修改现有对象
3. **快照存储**：Git 存储文件的快照，而非差异

**分支的工作原理图示**：

```
假设当前提交历史：

    C0 ← C1 ← C2 ← C3 (master)
                  ↑
                (HEAD)

创建 testing 分支后：

    C0 ← C1 ← C2 ← C3 (master, testing)
                  ↑
                (HEAD → master)

切换到 testing 分支并提交后：

    C0 ← C1 ← C2 ← C3 (master)
                   \
                    C4 (testing)
                    ↑
                  (HEAD → testing)

再切回 master 并提交：

    C0 ← C1 ← C2 ← C3 ← C5 (master)
                   \       ↑
                    C4   (HEAD)
                    ↑
                (testing)
```

### 分支核心机制

```
提交对象 → 树对象 → blob 对象
  ↑
  └── 包含指向前一个提交对象的指针（父对象）
```

**详细解释**：

Git 的数据结构包含三种对象：

1. **提交对象（Commit Object）**：
   - 包含指向树对象的指针
   - 包含作者、提交者、提交信息
   - 包含父提交的指针（0个：初始提交；1个：普通提交；2个：合并提交）
   
2. **树对象（Tree Object）**：
   - 记录目录结构
   - 包含 blob 对象和其他树对象的指针

3. **Blob 对象（Blob Object）**：
   - 存储文件内容
   - 以 SHA-1 哈希值命名
   - 相同内容的文件共享同一个 blob

**HEAD、分支、提交的关系**：

```
HEAD 文件内容：ref: refs/heads/master

refs/heads/master 文件内容：a1b2c3d4...（提交哈希）

提交对象 a1b2c3d4 包含：
├── 树对象指针
├── 父提交指针
├── 作者信息
└── 提交信息
```

- **HEAD**：指向当前所在的本地分支（引用的引用）
- **master**：默认分支名（不是特殊分支）
- **分支创建**：仅创建指针，不复制文件

### 基本操作

```bash
git branch              # 列出所有分支
git branch <name>      # 创建新分支
git branch -d <name>   # 删除分支
git branch -m <old> <new>  # 重命名分支

git checkout <branch>  # 切换分支
git checkout -b <name> # 创建并切换分支（新语法推荐）
git switch <branch>    # 切换分支（新语法）
git switch -c <name>   # 创建并切换（新语法）
```

**详细操作示例**：

```bash
# 1. 创建分支（停留在当前分支）
git branch feature-login    # 创建新分支，但不切换

# 2. 查看分支详细信息
git branch -v              # 显示分支和最后一次提交
git branch -vv             # 显示分支、最后提交和上游分支

# 3. 删除分支
git branch -d feature-login       # 安全删除（已合并的分支）
git branch -D feature-login       # 强制删除（未合并的分支也删除）

# 4. 重命名分支
git branch -m old-name new-name   # 重命名分支
git branch -M new-name            # 重命名当前分支

# 5. 切换分支
git checkout feature-login        # 传统方式
git switch feature-login          # 新语法（推荐，语义更清晰）

# 6. 创建并切换分支
git checkout -b feature-login     # 传统方式
git switch -c feature-login       # 新语法（推荐）
git switch -c feature-login origin/develop  # 基于远程分支创建
```

**checkout vs switch 的区别**：

| 命令 | 功能 | 说明 |
|------|------|------|
| `git checkout <branch>` | 切换分支 | 功能过多，容易混淆 |
| `git checkout -b <name>` | 创建并切换 | 同上 |
| `git checkout <file>` | 恢复文件 | 同上 |
| `git switch <branch>` | 切换分支 | 语义清晰，专门用于分支 |
| `git switch -c <name>` | 创建并切换 | 同上 |

**推荐使用 `switch` 和 `restore` 替代 `checkout` 的部分功能**，使命令语义更明确。

## 2. 分支的新建与合并

### 新建分支

```bash
git branch testing     # 创建 testing 分支
git checkout testing   # 切换到 testing 分支

# 或一步完成
git checkout -b testing
```

### 新建分支的详细场景

**场景一：开发新功能**

```bash
# 1. 确保当前分支是最新的
git checkout main
git pull origin main

# 2. 创建并切换到新功能分支
git switch -c feature/user-authentication

# 3. 开发过程中，定期提交
git add .
git commit -m "feat: 添加登录页面"

# 4. 开发完成后，推送到远程
git push -u origin feature/user-authentication
```

**场景二：从特定提交创建分支**

```bash
# 查看提交历史，找到需要创建分支的提交
git log --oneline -5

# 从特定提交创建分支
git switch -c hotfix-123 abc1234

# 或者使用 checkout
git checkout -b hotfix-123 abc1234
```

**场景三：查看分支创建位置**

```bash
# 查看分支是从哪个提交创建的
git log --oneline --graph --all

# 查看分支之间的差异
git log main..feature/user-auth  # feature 有但 main 没有的提交
git diff main...feature/user-auth  # 分支分叉后的变化
```

### 合并分支

```bash
# 切换到主分支
git checkout master

# 合并目标分支
git merge testing

# 删除已合并的分支
git branch -d testing
```

### 合并分支的详细场景

**场景一：快进合并（Fast-Forward）**

当目标分支是当前分支的直接延续时，Git 只需移动指针：

```bash
# 合并前：
# main:    A --- B
#                   \
# feature:           C --- D

git checkout main
git merge feature

# 合并后（快进）：
# main:    A --- B --- C --- D
# feature:           C --- D

# 特点：线性历史，不创建合并提交
```

**场景二：三方合并（Three-Way Merge）**

当两个分支都有新提交时，Git 会创建合并提交：

```bash
# 合并前：
# main:    A --- B --- C
#                   \
# feature:           E --- F

git checkout main
git merge feature

# 合并后：
# main:    A --- B --- C --- G (合并提交)
#                   \       /
# feature:           E --- F

# 特点：保留分支历史，创建合并提交
```

**场景三：禁用快进合并**

```bash
# 强制创建合并提交，即使可以快进
git merge --no-ff feature

# 优点：保留分支历史，清晰看到功能分支的完整提交
# 缺点：多一个合并提交
```

**场景四：压缩合并（Squash Merge）**

将分支的所有提交压缩成一个提交：

```bash
git merge --squash feature
git commit -m "feat: 添加用户认证功能"

# 优点：保持主分支历史简洁
# 缺点：丢失分支的详细提交历史
```

### 合并冲突

```bash
# 冲突时手动编辑文件
git add <resolved-file>
git commit              # 完成合并提交

# 取消合并
git merge --abort
```

### 合并冲突的详细处理流程

**场景：两个分支修改了同一文件的同一位置**

```bash
# 1. 尝试合并
git checkout main
git merge feature

# 2. 出现冲突提示
# CONFLICT (content): Merge conflict in index.js
# Automatic merge failed; fix conflicts and then commit the result.

# 3. 查看冲突文件
git status
# Unmerged paths:
#   both modified: index.js

# 4. 打开冲突文件，查看冲突标记
```

**冲突文件的格式**：

```
<<<<<<< HEAD
当前分支的内容
=======
要合并分支的内容
>>>>>>> feature
```

**解决冲突的方法**：

```bash
# 方法1: 手动编辑文件
# 打开冲突文件，删除冲突标记，保留正确的内容
# 然后标记为已解决
git add index.js

# 方法2: 使用合并工具
git mergetool

# 方法3: 选择某一方的版本
git checkout --ours index.js      # 使用当前分支的版本
git checkout --theirs index.js    # 使用合并分支的版本

# 方法4: 使用 Git 的自动合并策略
git merge -X theirs feature       # 优先使用 feature 分支的版本

# 5. 完成合并
git commit -m "merge: 合并 feature 分支，解决冲突"
```

**冲突解决的完整示例**：

```bash
# 假设 main 和 feature 都修改了 config.js

# Step 1: 查看冲突
git status

# Step 2: 查看冲突详情
git diff

# Step 3: 编辑文件解决冲突
# 原文件内容：
# <<<<<<< HEAD
# const apiUrl = "https://api.example.com";
# =======
# const apiUrl = "https://dev.example.com";
# >>>>>>> feature

# 解决后：
# const apiUrl = "https://api.example.com";  // 生产环境

# Step 4: 标记为已解决
git add config.js

# Step 5: 查看是否还有其他冲突
git status

# Step 6: 完成合并
git commit

# 如果想放弃合并
git merge --abort
```

**查看合并结果**：

```bash
# 查看合并历史
git log --oneline --graph

# 查看合并提交的详情
git show <merge-commit-hash>

# 查看哪些文件有冲突
git diff --name-only --diff-filter=U
```

## 3. 分支管理

### 查看分支

```bash
git branch              # 列出本地分支
git branch -r          # 列出远程分支
git branch -a          # 列出所有分支
git branch -v          # 显示分支和最后一次提交
git branch --merged    # 已合并到当前分支的分支
git branch --no-merged # 未合并到当前分支的分支
```

### 查看分支的实用场景

**场景一：查看分支详细信息**

```bash
# 查看所有分支及其最后一次提交
git branch -v

# 输出示例：
# * main       a1b2c3d [origin/main] feat: 添加登录功能
#   develop    e4f5g6h [origin/develop] fix: 修复样式问题
#   feature-1  i7j8k9l feat: 开发新功能

# 查看分支及其上游分支
git branch -vv

# 输出示例：
# * main       a1b2c3d [origin/main: ahead 2] feat: 添加登录功能
#   develop    e4f5g6h [origin/develop: behind 1] fix: 修复样式问题
#   feature-1  i7j8k9l [origin/feature-1: gone] feat: 开发新功能

# ahead: 本地领先远程的提交数
# behind: 本地落后远程的提交数
# gone: 远程分支已删除
```

**场景二：查找已合并/未合并的分支**

```bash
# 查看已合并到 main 的分支（可以安全删除）
git checkout main
git branch --merged

# 输出示例：
#   develop
#   feature/old-feature

# 查看未合并的分支（包含尚未合并的工作）
git branch --no-merged

# 输出示例：
#   feature/new-feature
#   hotfix/urgent-fix

# 批量删除已合并的分支
git branch --merged | grep -v "\*" | grep -v "main\|develop" | xargs git branch -d
```

**场景三：查找包含特定提交的分支**

```bash
# 查看哪些分支包含某个提交
git branch --contains a1b2c3d

# 查看哪些分支不包含某个提交
git branch --no-contains a1b2c3d

# 查看远程分支是否包含某个提交
git branch -r --contains a1b2c3d
```

**场景四：查看分支创建时间和历史**

```bash
# 查看分支的创建时间
git reflog show feature-1

# 查看分支的提交历史
git log --oneline --graph feature-1

# 查看分支分叉点
git merge-base main feature-1
```

### 远程分支

```bash
git push origin <branch>     # 推送本地分支到远程
git push origin <local>:<remote>  # 推送并指定远程分支名

git checkout -b <branch> origin/<branch>  # 检出远程分支
git checkout --track origin/<branch>      # 同上

git fetch origin               # 获取远程更新
git pull origin <branch>       # 获取并合并
```

### 删除远程分支

```bash
git push origin --delete <branch>   # 删除远程分支
git push origin :<branch>           # 同上（旧语法）
```

## 4. 分支开发工作流

### 常见工作流

#### 长期分支

- **master/main**：稳定分支，只接受发布版本
- **develop/next**：集成分支，开发最新功能
- **特性分支**：从 develop 创建，开发完成后合并回去

#### 短期分支

- **功能分支**：开发新功能
- **修复分支**：修复 bug
- **发布分支**：准备发布

## 5. Gitflow 工作流

Gitflow 是一种成熟的分支管理策略，适用于有固定发布周期的项目。

### 分支类型

| 分支 | 命名 | 用途 | 生命周期 |
|------|------|------|----------|
| master/main | - | 生产分支 | 永久 |
| develop | - | 开发分支 | 永久 |
| feature/* | 功能名 | 开发新功能 | 临时 |
| release/* | 版本号 | 准备发布 | 临时 |
| hotfix/* | 问题描述 | 紧急修复 | 临时 |

### 分支关系图

```
master  ───●─────────────────●───────────●───
            ↑                 ↑           ↑
             \               /           /
              \             /           /
release/v1.0   ╲           /           /
                ╲         /           /
                 ●───●───●            /
              ↑                 ↑     ↑
               \               /     /
                ●─────────────●─────●
              ↑                     ↑
               \                   /
hotfix/v1.0.1   ●─────────●────────
                    ↑
                     \
                      ●───●───●
                           ↑
                            \
                             ●───●───●
                           ↑
                            \
feature/*  ●───●───●───●───●
                    ↑
                     \
                      ●───●───●
```

### Gitflow 命令

#### 初始化 Gitflow

```bash
# 需要先初始化
git flow init
```

或手动创建：

```bash
# 创建 develop 分支
git checkout -b develop master

# 推送 develop 分支
git push -u origin develop
```

#### 功能开发流程

```bash
# 开始新功能
git checkout -b feature/my-feature develop

# 开发完成后，合并到 develop
git checkout develop
git merge --no-ff feature/my-feature

# 删除功能分支
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

#### 发布流程

```bash
# 创建发布分支
git checkout -b release/v1.0.0 develop

# 进行发布准备（小修复）
git commit -m "Release prep"

# 完成发布，合并到 master 和 develop
git checkout master
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"

git checkout develop
git merge --no-ff release/v1.0.0

# 删除发布分支
git branch -d release/v1.0.0
```

#### 紧急修复流程

```bash
# 创建 hotfix 分支
git checkout -b hotfix/v1.0.1 master

# 修复问题
git commit -m "Hotfix"

# 合并到 master
git checkout master
git merge --no-ff hotfix/v1.0.1
git tag -a v1.0.1 -m "Hotfix v1.0.1"

# 合并到 develop
git checkout develop
git merge --no-ff hotfix/v1.0.1

# 删除 hotfix 分支
git branch -d hotfix/v1.0.1
```

### Gitflow 工具

使用 `git-flow` 工具简化操作：

```bash
# 安装
brew install git-flow

# 功能开发
git flow feature start my-feature
git flow feature finish my-feature

# 发布
git flow release start v1.0.0
git flow release finish v1.0.0

# 修复
git flow hotfix start v1.0.1
git flow hotfix finish v1.0.1
```

## 6. 变基（Rebase）

### 什么是变基？

将一个分支的修改"重播"到另一个分支上，使提交历史更加线性。

**变基的工作原理**：

```
变基前：
    A --- B --- C (main)
           \
            D --- E (feature)

执行 git checkout feature && git rebase main：

    A --- B --- C (main)
                 \
                  D' --- E' (feature)

变基后，feature 分支的提交被重新应用到 main 的最新提交之后
```

**变基 vs 合并对比图**：

```
使用合并（git merge）：
    A --- B --- C --- F (main)  ← 合并提交
           \       /
            D --- E (feature)

使用变基（git rebase）：
    A --- B --- C (main)
                 \
                  D' --- E' (feature)
                  
然后快进合并：
    A --- B --- C --- D' --- E' (main, feature)
```

### 基本用法

```bash
# 变基到目标分支
git checkout feature
git rebase develop

# 变基后快进合并
git checkout develop
git merge feature
```

### 变基的详细场景

**场景一：功能分支保持最新**

```bash
# 在功能分支上工作时，定期同步主分支

# 1. 开始功能开发
git checkout -b feature/new-api main
# ... 进行一些提交 ...

# 2. 主分支有新的提交，同步到功能分支
git checkout main
git pull origin main

# 3. 变基功能分支
git checkout feature/new-api
git rebase main

# 4. 如果有冲突，解决冲突
# Git 会暂停变基，让你解决冲突
# 编辑冲突文件
git add <resolved-file>
git rebase --continue

# 5. 变基完成后，强制推送到远程
git push origin feature/new-api --force-with-lease
```

**场景二：整理提交历史**

```bash
# 将多个小提交合并成一个大提交
git checkout feature/new-api
git rebase -i main

# 或者基于最近的 N 个提交
git rebase -i HEAD~3

# 编辑器中显示：
# pick a1b2c3d feat: 添加登录页面
# pick e4f5g6h fix: 修复登录样式
# pick i7j8k9l fix: 修复登录逻辑

# 修改为：
# pick a1b2c3d feat: 添加登录页面
# squash e4f5g6h fix: 修复登录样式
# squash i7j8k9l fix: 修复登录逻辑

# 保存后，编辑合并后的提交信息
```

**场景三：修改历史提交**

```bash
# 修改最近 3 个提交中的某一个
git rebase -i HEAD~3

# 将需要修改的提交标记为 edit
# edit a1b2c3d feat: 添加登录页面
# pick e4f5g6h fix: 修复登录样式

# Git 会暂停在 a1b2c3d 这个提交
# 修改文件
git add <modified-file>
git commit --amend

# 继续变基
git rebase --continue
```

### 变基 vs 合并

| 特性 | 变基 | 合并 |
|------|------|------|
| 历史 | 线性整洁 | 保留分叉历史 |
| 安全性 | 需要小心 | 更安全 |
| 使用场景 | 保持历史清晰 | 保留完整历史 |

**什么时候使用变基？**

✅ **适合使用变基的场景**：
- 本地开发的功能分支，尚未推送
- 需要保持提交历史整洁
- 需要合并多个小提交

❌ **不适合使用变基的场景**：
- 已推送到远程的分支
- 与他人共享的分支
- 需要保留完整历史记录

**什么时候使用合并？**

✅ **适合使用合并的场景**：
- 合并公共分支（如 main, develop）
- 已推送到远程的功能分支
- 需要保留完整的历史记录
- 团队协作的分支

### 黄金法则

**不要对已推送到远程的提交进行变基！**

**为什么？**

```
假设场景：
1. 你推送了分支 feature 到远程
2. 团队成员拉取了 feature 并基于它开发
3. 你对 feature 进行了变基并强制推送
4. 团队成员再次拉取时会出现冲突

问题根源：
变基会重写历史，创建新的提交对象

原始提交：
A --- B --- C (feature)
团队成员基于 C 提交

变基后：
A --- B' --- C' (feature)
团队成员的 C 和新的 C' 冲突
```

**如果必须变基已推送的分支**：

```bash
# 使用 --force-with-lease 而不是 --force
git push origin feature --force-with-lease

# --force-with-lease 更安全，会检查远程分支是否被其他人更新
# 如果远程分支有新的提交，推送会失败
```

### 变基冲突处理

```bash
# 1. 变基时遇到冲突
git rebase main
# CONFLICT (content): Merge conflict in index.js

# 2. 查看冲突文件
git status

# 3. 手动解决冲突
# 编辑冲突文件，删除冲突标记

# 4. 标记为已解决
git add <resolved-file>

# 5. 继续变基
git rebase --continue

# 6. 如果想跳过这个提交
git rebase --skip

# 7. 如果想放弃变基
git rebase --abort
```

### 交互式变基

```bash
# 修改最近3个提交
git rebase -i HEAD~3

# 命令：
# pick   - 保留提交
# reword - 修改提交信息
# edit   - 暂停以修改
# squash - 合并到前一个提交
# drop   - 删除提交
```

### 变基技巧

```bash
# 合并多个提交
git rebase -i HEAD~3
# 将后面的提交改为 squash

# 拆分提交
git rebase -i HEAD~1
# 将 commit 改为 edit
git reset HEAD^
git add .
git commit
git commit
git rebase --continue
```

## 7. 远程分支

### 跟踪分支

```bash
# 查看跟踪关系
git branch -vv

# 设置上游分支
git branch -u origin/branch
git branch --set-upstream-to=origin/branch
```

### 远程分支的详细操作

**场景一：克隆远程仓库并工作**

```bash
# 1. 克隆仓库（自动创建跟踪关系）
git clone https://github.com/user/project.git
cd project

# 2. 查看远程分支
git remote -v                # 查看远程仓库
git branch -r                # 查看远程分支
git branch -a                # 查看所有分支

# 输出示例：
# * main                    # 本地分支
#   remotes/origin/HEAD -> origin/main
#   remotes/origin/main     # 远程分支
#   remotes/origin/develop
#   remotes/origin/feature-login

# 3. 查看本地分支与远程分支的跟踪关系
git branch -vv

# 输出示例：
# * main  a1b2c3d [origin/main] feat: 添加功能
```

**场景二：检出远程分支**

```bash
# 方法1: 自动创建跟踪分支
git checkout feature-login
# Git 会自动创建本地分支并跟踪远程分支

# 方法2: 显式创建跟踪分支
git checkout -b feature-login origin/feature-login

# 方法3: 使用 switch 命令
git switch -c feature-login origin/feature-login

# 方法4: 使用 track 参数
git checkout --track origin/feature-login
```

**场景三：推送分支到远程**

```bash
# 1. 推送新分支并设置跟踪关系
git push -u origin feature-new
# 或
git push --set-upstream origin feature-new

# 2. 推送已跟踪的分支
git push

# 3. 推送所有本地分支
git push --all origin

# 4. 推送并强制覆盖（谨慎使用）
git push --force origin feature-new
# 更安全的方式
git push --force-with-lease origin feature-new

# 5. 推送标签
git push origin v1.0.0
git push origin --tags
```

**场景四：拉取远程更新**

```bash
# 1. 拉取当前分支的更新
git pull

# 2. 拉取并变基（推荐）
git pull --rebase

# 3. 拉取指定远程分支
git pull origin main

# 4. 只获取不合并
git fetch origin

# 5. 查看 fetch 的更新
git log HEAD..origin/main

# 6. 合并 fetch 的更新
git merge origin/main
```

**场景五：管理远程分支**

```bash
# 1. 添加远程仓库
git remote add upstream https://github.com/original/project.git

# 2. 查看远程仓库详情
git remote show origin

# 输出示例：
# * remote origin
#   Fetch URL: https://github.com/user/project.git
#   Push  URL: https://github.com/user/project.git
#   HEAD branch: main
#   Remote branches:
#     main     tracked
#     develop  tracked
#   Local branches configured for 'git pull':
#     main     merges with remote main
#   Local refs configured for 'git push':
#     main     pushes to main (up to date)

# 3. 删除远程分支
git push origin --delete feature-old

# 4. 清理本地的远程分支引用
git remote prune origin

# 5. 删除本地跟踪已删除的远程分支
git fetch -p
# 或
git fetch --prune
```

### 团队协作常见场景

**场景一：团队成员创建了新分支**

```bash
# 1. 获取远程更新
git fetch origin

# 2. 查看新的远程分支
git branch -r

# 3. 检出并跟踪新分支
git checkout -b feature-login origin/feature-login
```

**场景二：远程分支被强制推送**

```bash
# 如果远程分支被 rebase 或 amend，需要重置本地分支

# 方法1: 重置到远程分支
git fetch origin
git reset --hard origin/feature-login

# 方法2: 变基到远程分支
git fetch origin
git rebase origin/feature-login
```

**场景三：解决推送冲突**

```bash
# 1. 推送失败
git push origin feature-login
# ! [rejected] feature-login -> feature-login (fetch first)

# 2. 拉取远程更新
git pull --rebase origin feature-login

# 3. 如果有冲突，解决冲突
git add <resolved-file>
git rebase --continue

# 4. 再次推送
git push origin feature-login
```

**场景四：同步 Fork 仓库**

```bash
# 1. 添加上游仓库
git remote add upstream https://github.com/original/project.git

# 2. 获取上游更新
git fetch upstream

# 3. 合并上游更新到本地
git checkout main
git merge upstream/main

# 4. 推送到自己的 Fork
git push origin main
```

### 拉取和推送

```bash
# 设置默认上游并推送
git push -u origin branch

# 推送当前分支
git push

# 推送所有分支
git push --all origin

# 删除远程分支
git push origin --delete branch
```

## 8. 总结

### 分支操作要点

1. **创建分支**：`git branch` 或 `git checkout -b`
2. **切换分支**：`git checkout` 或 `git switch`
3. **合并分支**：`git merge`（保持历史）或 `git rebase`（线性历史）
4. **删除分支**：本地用 `-d`，远程用 `--delete`

### Gitflow 最佳实践

1. **master/main**：始终保持可发布状态
2. **develop**：集成所有功能分支
3. **功能分支**：从 develop 创建，合并回 develop
4. **发布分支**：从 develop 创建，合并到 master 和 develop
5. **hotfix 分支**：从 master 创建，修复后合并到两者

### 注意事项

- 变基只用于本地开发，不要在公共分支上使用
- 合并前确保代码已测试
- 及时删除已合并的临时分支
- 使用有意义的分支命名规范