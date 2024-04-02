# 目录推到远程 git 仓库

- 配置 Git:

```
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

- 初始化仓库

```
git init
```

- 将本地仓库链接到远程仓库:

```
git remote add origin <你的远程仓库URL>
```

- 获取远程仓库的最新状态

```
git fetch origin
```
