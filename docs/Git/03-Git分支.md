# Git 分支总结

本章介绍 Git 的分支模型，结合 Gitflow 工作流进行总结。

## 1. 分支简介

### 分支概念

Git 分支本质上是指向提交对象的可变指针（40字节的 SHA-1 值）。创建分支就是创建一个可以移动的指针。

### 分支核心机制

```
提交对象 → 树对象 → blob 对象
  ↑
  └── 包含指向前一个提交对象的指针（父对象）
```

- **HEAD**：指向当前所在的本地分支
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

## 2. 分支的新建与合并

### 新建分支

```bash
git branch testing     # 创建 testing 分支
git checkout testing   # 切换到 testing 分支

# 或一步完成
git checkout -b testing
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

### 合并冲突

```bash
# 冲突时手动编辑文件
git add <resolved-file>
git commit              # 完成合并提交

# 取消合并
git merge --abort
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

### 基本用法

```bash
# 变基到目标分支
git checkout feature
git rebase develop

# 变基后快进合并
git checkout develop
git merge feature
```

### 变基 vs 合并

| 特性 | 变基 | 合并 |
|------|------|------|
| 历史 | 线性整洁 | 保留分叉历史 |
| 安全性 | 需要小心 | 更安全 |
| 使用场景 | 保持历史清晰 | 保留完整历史 |

### 黄金法则

**不要对已推送到远程的提交进行变基！**

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