# git常用操作及配置

## Centos7更新git版本

**背景描述**：  
CentOS7上的Git版本`太陈旧`，在使用过程中会遇到问题，因此需要`升级git版本`。

```shell
# 查看git版本 # git --version git version 1.8.3.1 # 系统版本：（CentOS 7.6） # cat /etc/redhat-release CentOS Linux release 7.6.1810 (Core)
```

### Linux配置[git命令](https://so.csdn.net/so/search?q=git%E5%91%BD%E4%BB%A4&spm=1001.2101.3001.7020)自动补全

```shell
# 下载git-completion.sh wget -O /etc/profile.d/git-completion.sh https://raw.github.com/git/git/master/contrib/completion/git-completion.bash
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/59cefb59d1df5ec0ebe592a87fca1466.png)

### Centos7使用SCL源安装git2–推荐

[https://blog.csdn.net/omaidb/article/details/126462159](https://blog.csdn.net/omaidb/article/details/126462159)

### Centos7使用yum安装git236版本-IUS源

参考: [https://blog.csdn.net/omaidb/article/details/126462236](https://blog.csdn.net/omaidb/article/details/126462236)

## github加速

在`https://github.com`前面加上`https://ghproxy.com/`,如下图：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d0e56ebd24fbb7827a5dd1990feba196.png)

```shell
# 使用hosts wget -c https://gitee.com/fliu2476/github-hosts/raw/main/hosts # 合并github的hosts到/etc/hosts echo hosts >> /etc/hosts
```

## Windows安装git命令行版

```shell
# 安装git客户端 choco install git -y
```

使用`cmder`中的`git纯命令行`

```shell
# 安装cmder终端 choco install cmder -y
```

`cmder`终端的`Windows`版`git`[命令行](https://so.csdn.net/so/search?q=%E5%91%BD%E4%BB%A4%E8%A1%8C&spm=1001.2101.3001.7020)路径：  
`C:\tools\Cmder\vendor\git-for-windows\cmd\git.exe`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8ba0cc468db48dc152180a42534c5983.png)  
在`pwsh7`的`$Profile`中配置`git`的`Alias`

```shell
# 配置git的Alias Set-Alias git "C:\tools\Cmder\vendor\git-for-windows\cmd\git.exe"
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/eb19b376317ed84c2d642b76fdb64954.png)

```shell
# 测试是否能正常执行git命令 git ---version
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0edca8b2203b34078b5fab124dedf246.png)

## git常用配置

参考: [https://segmentfault.com/a/1190000039320926](https://segmentfault.com/a/1190000039320926)

参考: [最全的Git常用命令速查-2021版](https://mp.weixin.qq.com/s/wGEPuXgHS013mAyjD-ityA)

`快速push`参考:  
[https://zhuanlan.zhihu.com/p/133871333](https://zhuanlan.zhihu.com/p/133871333)

[https://www.jianshu.com/p/d32d322766eb](https://www.jianshu.com/p/d32d322766eb)

配置文件在`~/.gitconfig`

```shell
# Git LFS 的过滤器配置 ## Git LFS (Git Large File Storage) 是Git中用于管理大型二进制文件的扩展 [filter "lfs"] # "clean" 过滤器命令，用于在提交文件之前对文件进行清理操作 ## %f 是一个占位符，表示被过滤的文件路径。 ## git-lfs clean 是Git LFS提供的清理命令，用于将文件添加到Git仓库之前，将大型文件替换为指向Git LFS(远程存储)的指针。 clean = git-lfs clean -- %f # "smudge" 过滤器命令，用于在检出文件时对文件进行还原操作 ## %f 是一个占位符，表示被过滤的文件路径。 ## git-lfs smudge 是Git LFS提供的还原命令，从Git仓库中检出文件时，将指向Git LFS(远程存储)的指针转换为实际的大型二进制文件 smudge = git-lfs smudge -- %f # "process" 过滤器命令，用于在文件读写过程中进行处理操作。 ## git-lfs filter-process 是Git LFS提供的处理命令，用于自动执行 "clean" 和 "smudge" 操作 ## 每当Git需要处理大型二进制文件时Git LFS就会运行下面的命令 process = git-lfs filter-process # 必须使用Git LFS来管理大型二进制文件 required = true [user] name = 自然自在 email = xxx@gmail.com # GitHub访问太慢,给它加个proxy加速一下 ## 单独配置github.com # [http "https://github.com"] # proxy = socks5h://127.0.0.1:51837 # 给所有http链接加代理 [http] proxy = socks5h://127.0.0.1:1080 # 给所有https链接加代理 [https] proxy = socks5h://127.0.0.1:51837 # 带认证的proxy格式 # https://qiaofei:qiaofei123@proxy.ibm.com:443 # 配置快速push [alias] fp = "!git add .;git commit -m 快速push;git push" [push] # 在Git2.0以后，push.default由 'matching'修改为 'simple' # simple 只推送当前分支 # matching 推送所有有对应的远程分支的本地分支 default = simple # 配置git上传文件大小 # ttps://blog.csdn.net/yilulvxing/article/details/87859483 [http] # 单位Bytes = 500M postbuffer=524288000 # 安全目录 [safe] directory = D:/code/qiaofei_notes # 给Git 输出添加颜色 [color] ui = true [core] # 压缩级别 -1 到9 ## -1是默认参数，9最慢 compression = 9
```

### git上传超过100MB文件

git上传大文件  
github仓库容量限制在`1G`，单个文件不能超过`100M`，有`50M`的文件，就会`警告`。  
参考：[https://blog.csdn.net/yilulvxing/article/details/87859483](https://blog.csdn.net/yilulvxing/article/details/87859483)  
上传项目到GitHub上，当某个文件大小`超过100M`时，就会上传失败，因为默认的限制了上传文件大小`不能超过100M`。如果需要上传超过100M的文件，就需要我们自己去修改配置。  
首先，打开终端，进入项目所在的文件夹；

```shell
# git全局配置上传缓冲区大小到500M git config --global http.postBuffer 524288000 # 针对当前仓库配置上传缓冲区大小到500M git config http.postBuffer 524288000
```

### 查看`git配置`

```shell
# 查看git配置 git config -l
```

可以看到配置项的最下面多出了一行我们刚刚配置的内容. (52428000 Bytes =500×1024×1024,即500M)。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e3c2ee97449f85fef50d49207064f817.png)

### socks5访问不了github

如果用socks5也访问不了 github ，可以在 `.gitconfig` 中把 `socks5://` 换成 `socks5h://` ，这样会使用`远端解析 DNS` 保证域名`不被污染`；也可以换用 http proxy.  
（其中 socks5h 表示远程解析 dns，如果直接写 socks5 是本地解析 dns ）

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/87c23d9d22b778c0b12ec84aa6477b11.png)

### clone的时候有时候会有很大的`.git`目录

只是为了`clone尽量小`的话，用`git clone --depth=1`只获取`最新的commit`即可

```shell
# 只获取最近一次的提交 git clone --depth=1 <远程仓库URL>
```

## Linux下为git配置token免密登录

参考: [https://beginor.github.io/2014/03/04/git-client-save-user-pass.html](https://beginor.github.io/2014/03/04/git-client-save-user-pass.html)

(`多平台通用`)在用户的`home`目录下创建一下`_netrc`文件或者`.netrc`文件:

- `Linux` or `macOS`下创建 `~/.netrc`;
- `Widnows`下`建议`创建 `~/_netrc`。

```shell
# 在用户的home目录下创建一下`.netrc`文件 touch ~/.netrc
```

`.netrc`文件内容如下：

```shell
# 配置github推送代码免密 machine github.com login not-used password {token} machine api.github.com login not-used password {token}
```

## git常用操作

在`git`中有`三`个`区域`：

- `工作区`–文件实际的位置
- `暂存区`–`将要提交`的文件列表
- `版本库`–存储项目的`历史记录`和`元数据`。
  - 版本库包括了`已经提交`的`文件快照`、指向每个快照的`指针`。
  - `每次提交`都会创建一个`新的版本`，并将其添加到版本库中。版本库中的`每个版本`都包含一个`指向其父版本的指针`，这样就可以`跟踪提交历史`。

在使用Git进行版本控制时，我们首先`对文件进行修改`，然后`将修改的文件添加到暂存区`，最后再`将暂存区中的文件提交到版本库`中。  
通过这种方式，我们可以很好地`控制代码的版本`和`变化过程`，同时也可以比较容易地`回滚到之前的某个版本`。

### 配置git用户信息

```shell
# 设置全局用户签名 ## git config --global user.name 用户名 git config --global user.name "Your Name" # 配置全局Email ## git config --global user.email 邮箱 git config --global user.email "you@example.com"
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a899d0bda6c6cdd907b04e5a706a5379.png)

```shell
# 查看该git用户信息 cat ~/.gitconfig
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7937f65847312eecff45d070a6a04d77.png)

### 删除git配置项

```shell
# 针对当前仓库配置上传缓冲区大小到500M git config http.postBuffer 524288000 # 删除core.hooksPath的当前配置项 git config --unset core.hooksPath # git全局配置上传缓冲区大小到500M git config --global http.postBuffer 524288000 # 删除core.hooksPath的全局配置项 git config --global --unset core.hooksPath # 查看该git用户信息 cat ~/.gitconfig
```

### 本地创建项目版本库

```shell
# 在本地创建项目 目录 mkdir -p git_projecat_dir_name # 进入本地项目 目录 cd git_projecat_dir_name # 将当前目录转换为Git版本库。 ## 初始化本地仓库 git init
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ed4c8b2875dc3ae40945bef421805af8.png)  
`git`代码`版本库`就是目录下的`.git`目录

```shell
# 查看.git目录详情 ls .git/
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9d26180f20b855363e6eb20612e4dc2e.png)

### 添加文件到暂存区

```shell
# 创建代码文件1 echo "test" > test.py # 将文件添加到暂存区，准备提交到仓库。 # git add <file> git add test.py # 查看当前工作区和暂存区的状态。 git status
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a7b213ab14c9b08bbcf44fc418499698.png)

### 撤销修改

[https://blog.csdn.net/kikajack/article/details/79846098](https://blog.csdn.net/kikajack/article/details/79846098)

撤销文件在工作区的修改–`未执行git add`。

```shell
# 撤销指定文件在工作区的修改 git checkout -- test.py
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/545039b73f97c71b91ccf685ed8a5c05.png)

撤销指定文件在暂存区的修改–`未执行git add`

```shell
# 将文件从暂存区中移除，但保留工作区的更改 git restore --staged <file> # 撤销指定文件在工作区的修改 git checkout -- 文件名
```

撤销之前的`所有git add` 操作，即在`暂存区`的`所有修改`。

```shell
# 撤销暂存区的所有修改 git restore
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5cd2b26b92665e0aab66321016db48bf.png)

### 提交代码更改到版本库

```shell
# 添加到暂存区并提交到版本库 ## -a add 添加到暂存区 git commit -a -m "<message>" # 查看当前工作区和暂存区的状态。 git status
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/035bef82999caf81109f63bc2b196328.png)

```shell
# 将暂存区的内容提交到版本库，并添加提交信息。 ## -m 提交的消息 git commit -m "<message>"
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7a74e336bf62baa293020ea8122a1f96.png)

```shell
# 查看当前分支的commit提交记录。 git log
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/80e4c065449d75e6eaba8fa7c567f761.png)

#### 回退撤销commit

```shell
# 把HEAD指针（即当前分支的指针）回退到前两个提交，但是保留工作区的更改。 # 软重置 git reset --soft HEAD~2 # 硬重置（Hard Reset）： # 彻底删除这两次提交，并且不保留这些更改 git reset --hard HEAD~2
```

### 分支管理

```shell
# 克隆远程仓库到本地。 git clone <repository-url> # 将指定分支合并到当前分支。 git merge <branch-name> # 将本地仓库的代码推送到远程仓库。 git push # 从远程仓库拉取最新的代码到本地仓库。 git pull ## 将远程仓库对应分支最新内容拉下来后与当前本地分支直接合并 git pull 远程库地址别名 远程分支名
```

#### 查看本地分支

```shell
# 查看本地分支 # 列出当前所有分支。 git branch # 打印结果 * main
```

#### 创建新的分支

```shell
# 创建一个新分支。 git branch <branch-name>
```

#### 切换到指定分支

```shell
# 切换到指定分支。 git checkout <branch-name>
```

#### 将指定分支合并到当前分支

```shell
# 将指定分支合并到当前分支。 git merge <branch-name>
```

### push代码

在提交之前执行 `git diff` 显示差异，以避免签入意外的代码。

```shell
# 将代码添加到暂存区 git add . # commit代码 git commit -m "本次提交备注" # 推送代码到远程仓库的master git push -u origin master # 完成后 # 推送至远程分支 ## git push origin 分支名 git push origin master ## 或 git push
```

### 撤销add和commit

参考: [Git—撤销add、commit、push操作](https://www.jianshu.com/p/308b4c71b3f5)

`git pull`时提示:  
`error: cannot pull with rebase: You have unstaged changes. error: please commit or stash them.`  
翻译: `错误：无法使用 rebase 拉取：您有未暂存的更改。 错误：请提交或隐藏它们。`

```shell
# 撤销commit和add操作，删除工作空间改动代码 ## ^表示父提交 ## HEAD^2 表示当前提交的第二个父提交 git reset --hard HEAD^
```

### git添加项目地址

[https://docs.github.com/cn/get-started/getting-started-with-git/managing-remote-repositories](https://docs.github.com/cn/get-started/getting-started-with-git/managing-remote-repositories)

```shell
# git添加项目地址 git remote add origin https://github.com/user/repo.git # 起别名 git remote add 别名 远程地址 # 查看项目远程仓库 git remote -v
```

### git修改项目地址

参考: [https://www.jianshu.com/p/ebc6b1a026c2](https://www.jianshu.com/p/ebc6b1a026c2)

```shell
# 进入项目目录 cd 项目路径 # 查看所有远程仓库 git remote # 查看当前所有远程地址别名 git remote -v # 查看指定远程仓库地址 git remote xxx # 修改项目地址 git remote set-url origin http://192.168.100.235:9797/john/git_test.git
```

### 查看分支提交历史

```shell
# 查看分支提交历史 git log # 查看本地库状态 git status # 查看历史版本 git reflog # 版本穿梭 git reset --hard 版本号
```

## 分支管理

参考： [https://backlog.com/git-tutorial/cn/stepup/stepup2\_3.html](https://backlog.com/git-tutorial/cn/stepup/stepup2_3.html)

### 如何在`fork`上创建基于`主repo`的`master`创建开发分支

```shell
# 创建一个名为“branch-name”的新分支，并将当前工作目录切换到该分支。 git checkout -b branch-name # 从“upstream”远程代码库中获取最新的代码，但并不将其合并到当前本地分支。 ## 它通常用于在本地创建一个与远程仓库同步的备份分支，以便轻松地比较和合并更改。 git fetch upstream # 将当前分支重置为与“upstream/master”分支相同的状态。 ## 这将会丢弃当前分支上所有未提交的更改，并将当前分支指向“upstream/master”分支所指向的提交。请注意，这是一种危险的操作，因为它将覆盖本地分支上的任何更改，应谨慎使用。 git reset --hard upstream/master # 将本地分支 branch-name 推送到远程仓库 origin，并创建一个名为 branch-name 的远程分支作为其跟踪分支，以便在以后的推送和拉取操作中使用。如果这个远程分支不存在，则会自动创建它。 ## 通过 --set-upstream 参数指定本地分支与远程分支之间的跟踪关系，使得在执行类似 git pull 和 git push 这样的命令时，Git 能够正确地识别要拉取或推送的分支。 ## 需要注意的是，在第一次 push 时使用该命令非常有用，但在之后的推送和拉取操作中，您可以简单地使用 git push 和 git pull 来更新远程分支。 git push --set-upstream origin branch-name
```

### 查看远程有哪些分支

```shell
# 查看分支 git branch -v # 查看当前分支 git branch # 查看所有分支 git branch -a # 以“main”分支为基础，将当前所在分支（即“branch-name”分支）的提交移动到“main”分支之后，并使它们成为“main”分支的直接子提交。 git rebase main
```

### 创建分支

```shell
# 创建 gh-pages 分支 # master 分支用作保存源码使用，而 gh-page 则是部署静态代码使用 # 提交后 Github 会默认 gh-pages 为静态网站分支，无须再开启，默认链接是 https://username.github.io/blog ## git branch 分支名 git branch gh-pages # 将本地分支 gh-pages 推送到远程仓库 origin 的同名分支，并通过 -u 参数设置该分支为跟踪分支。 git push -u origin gh-pages
```

### 合并分支

```shell
# 将指定分支合并到当前分支 git merge <branch-name>
```

### 切换分支

```shell
# 切换分支 git checkout 分支名 # 切换到master分支 git checkout master
```

### 新建本地分支和远程分支关联

```shell
# 切换到v22.05分支 git checkout -t remotes/origin/v22.05 # 切换回master分支 git checkout master
```

## 回滚代码

`回滚场景`：已 `commit`，但`还没push` 时  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d12471057484f353ca0737e42d90f43d.png)

```shell
# 回退到上个版本 git reset --hard HEAD ## ^ 符号通常用于访问某个提交的父提交 ## HEAD^2 表示当前提交的第二个父提交 git reset --hard HEAD^ # 回滚到指定的commit_id ## git reset --hard <要回滚到的 commit> git reset --hard commit_id
```

### 恢复修改

> 回滚场景：已 push 到远端时,此时不能用 `git reset`，需要用 `git revert`！

```shell
# 恢复到97ea0f9的修改 git revert -n 97ea0f9 # 默认拉取vim填写日志,保持默认日志即可 git revert --continue ## 或 git commit -m "恢复第三次修改" # 记得处理完推送到远端 git push # 推送本地分支上的内容到远程仓库 git push 别名 分支
```

### git移除已经add的文件

原文链接：[https://blog.csdn.net/Torey\_Li/article/details/87442355](https://blog.csdn.net/Torey_Li/article/details/87442355)  
如果git要`删除文件`，最好用 `git rm file_name`，而不应该直接在`工作区`直接 `rm file_name`。

#### git rm 命令

使用 git rm 命令即可，有两种选择,

```shell
# 不删除物理文件，仅将该文件从缓存中删除 git rm --cached “文件路径” # 将该文件从缓存中删除，还会将物理文件删除（不会回收到垃圾桶） git rm --f “文件路径”
```

#### 请问 git rm --cache 和 git reset HEAD 的区别到底在哪里呢？

如果要删除文件，最好用 `git rm file_name`，而不应该直接在工作区直接 `rm file_name`。  
如果一个文件已经add到暂存区，还没有 commit，此时如果不想要这个文件了；  
有两种方法：

1，用版本库内容清空暂存区，但要慎重使用

```shell
git reset HEAD
```

2，只把特定文件从暂存区删除，

```shell
git rm --cached xxx
```

## 删除分支

```shell
# 删除本地分支 git branch -d localBranchName # 删除远程分支 git push origin --delete remoteBranchName
```

## commit后修改代码

git 小技巧，一次 commit以后，突然发现还有点问题，又修改了几行代码，不想生成一个新的 commit 怎么办？  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/dcfa09c584999148794a994429428a99.png)

```shell
# 先修改代码 # 添加修改： git add . # 使用原来的 commit： git commit --amend --no-edit
```

## diff对比文件差异

```shell
# 比较两个文件并将差异输出到另一个文件 ## -w 参数忽略空格和制表符的差异。 ## -b 参数忽略空白行的差异。 ## -a 参数将所有文件视为文本文件进行比较。 ## -y 参数以并排的方式显示比较结果。 diff -wbay file_A fiale_B > file.diff
```

### comm只显示差别内容

```shell
# 表示file1与file2比较，显示只存在file1文件中的行 ## -23 只输出file1文件中独有的行 comm -23 <(sort file1.txt) <(sort file2.txt) # 将只存在file1文件中的行，添加到file2中 comm -23 <(sort file1.txt) <(sort file2.txt)| pv >> file2.txt
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/19e050fa98e5f4f00895dd22b66671e8.png)

## git技巧

简单省力的 workflow：

### 如果误操作 check-in 到了 master/main branch 怎么办？

直接 create-checkout branch，然后把 local master/main 删掉。  
免去了 local reset，也省得 local/remote out of sync

首先，创建并检出一个新的分支，这样你刚刚提交的更改就会在这个新的分支上：

```shell
git checkout -b new-branch
```

然后，你可以删除本地的 master 或 main 分支：

```shell
git branch -d master
```

或者

```shell
git branch -d main
```

这样做可以避免使用 git reset 命令并防止本地和远程的 master/main 分支不同步。  
记住，永远不要直接在 master/main 分支上进行开发，这是一个很好的实践，可以帮助你保持代码库的整洁和管理性。
