---
title: 'Linux commands'
description: 'meta description of the page'
article_id: 3
---

### 命令行快捷键

```
Ctrl+Alt+T 打开终端
一些常用的终端快捷键:
Ctrl+L 清空屏幕(功能相当于命令clear)
Ctrl+U 剪切文本直到行的起始(可以用于清空行)
Ctrl+K 剪切文本直到行的末尾
Ctrl+Y 粘贴最近剪切的文本
Ctrl+C 杀死当前进程(也可以用来清空当前行)
Ctrl+D 退出当前Shell(功能相当于命令exit) 或者 删除当前的字符
Ctrl+A 行首
Ctrl+E 行尾
Home/End 行首/行尾
Ctrl+F 向前移动一个字符
Ctrl+B 向后移动一个字符
Ctrl+P 或 Ctrl+N 上下历史记录
上下方向键 上下历史记录
Ctrl+Shift+C 复制
Ctrl+Shift+V 粘贴
还有Tab补全,按住Ctrl键进行块选择.
```

# 文件(夹)命令

## less

## more

## apt

-   列出所有可更新的软件清单命令：**sudo apt update**

-   升级软件包：**sudo apt upgrade**

    列出可更新的软件包及版本信息：**apt list --upgradeable**

    升级软件包，升级前先删除需要更新软件包：**sudo apt full-upgrade**

-   安装指定的软件命令：**sudo apt install &lt;package_name&gt;**

    列出可更新的软件包及版本信息：**apt list --upgradeable**

    升级软件包，升级前先删除需要更新软件包：**sudo apt full-upgrade**

-   安装指定的软件命令：**sudo apt install &lt;package_name&gt;**

-   安装多个软件包：**sudo apt install &lt;package_1&gt; &lt;package_2&gt; &lt;package_3&gt;**

-   更新指定的软件命令：**sudo apt update &lt;package_name&gt;**

-   显示软件包具体信息,例如：版本号，安装大小，依赖关系等等：**sudo apt show &lt;package_name&gt;**

-   删除软件包命令：**sudo apt remove &lt;package_name&gt;**

-   清理不再使用的依赖和库文件: **sudo apt autoremove**

-   移除软件包及配置文件: **sudo apt purge &lt;package_name&gt;**

-   查找软件包命令： **sudo apt search &lt;keyword&gt;**

-   列出所有已安装的包：**apt list --installed**

-   列出所有已安装的包的版本信息：**apt list --all-versions**

## ls

![image-20210615092348092](/images/image-20210615092348092.png)

## cd

![image-20210615092423448](/images/image-20210615092423448.png)

## pwd

![image-20210615092504594](/images/image-20210615092504594.png)

## mkdir

![image-20210615092538443](/images/image-20210615092538443.png)

## rmdir

![image-20210615093211765](/images/image-20210615093211765.png)

![image-20210615093230852](/images/image-20210615093230852.png)

## touch

![image-20210615093253170](/images/image-20210615093253170.png)

## stat

![image-20210615093312718](/images/image-20210615093312718.png)

## cat

![image-20210615093434292](/images/image-20210615093434292.png)

## head

![image-20210615093604230](/images/image-20210615093604230.png)

## tail

![image-20210615093617044](/images/image-20210615093617044.png)

## source

在当前 Shell 环境中从指定文件读取和执行命令。

概要

source filename \[arguments\]

主要用途

-   执行文件并从文件中加载变量及函数到执行环境

-   执行文件并从文件中加载变量及函数到执行环境

参数

filename：要执行的文件

arguments（可选）：传递给文件的参数

返回值

source 返回文件最后一个命令的返回值，如果文件不能读取则会失败

## ln

建立硬链接或软连接

-   -s 建立软链接,不加-s 选项,则建立硬链接文件
-   -f 强制,如果目标文件已经存在,则删除目标文件后再建立链接文件

```bash
ln /root/cangls /tmp/      #如果没有写文件名,会和原名一致.建立硬链接
ln /root/cangls /tmp/ -s   #建立软链接
```

## rm

rm 是强大的删除命令

-   -f 强制删除
-   -i 交互删除
-   -r 递归删除,可以删除目录

## cp

cp 是用于复制的命令

-   -a 相当于-dpr 选项的合集
-   -d 如果源文件为软连接,则复制出的目标文件也为软连接
-   -i 询问,如果目标文件已经存在,则会询问是否覆盖
-   -p 复制后目标文件保留源文件属性(包括所有者,所属组,权限和时间)
-   -r 递归复制,用于复制目录

## mv

mv 是用来移动文件(剪切)或者改名的命令

-   -f 强制覆盖,若果目标文件已经存在,则不询问,直接强制覆盖
-   -i 交互移动,如果目标文件已经存在,则询问用户是否覆盖(默认选项)
-   -v 显示详细信息

## tee

从标准输入读取文件并重定向到标准输出和文件，可以是多个文件。

-   -a: 采用追加到文件而不是覆盖

```bash
cat hello.txt | tee 123.txt 123.txt # 将 hello.txt 的内容复制到 123.txt 并输出到标准输出
```

## wc

统计文件共有多少行, 多少单词, 多少字符

\-c, --bytes print the byte counts
\-m, --chars print the character counts
\-l, --lines print the newline counts
\--files0-from=F read input from the files specified by
NUL-terminated names in file F;
If F is - then read names from standard input
\-L, --max-line-length print the maximum display width
\-w, --words print the word counts

## 权限命令

## chmod

用来变更文件或目录的权限

```bash
语法: chmod [选项] 权限模式 文件名

-R: 递归设置权限,也就是给子目录的所有文件设定权限
-v: 输出操作信息

u: 文件所有者
g: 文件所属组
o: 其他用户
a: 所有用户
r: 读权限, 相当于 4
w: 写权限, 相当于 2
x: 执行权限, 相当于 1
+: 添加目标用户相应的权限
-: 删除目标用户相应的权限
=: 添加目标用户响应的权限, 删除未提到的权限
```

```bash
chmod u+r 123.txt   # 加上读权限为文件所有者
chmod 644 123.txt   # 改变文件的权限分别所 读写, 读, 读对应 所有者, 所属组, 其他人
```

## chown

用来变更文件或目录的拥有者或所属组

只有文件的所有者和 root 用户能使用此命令

```bash
语法: chown [选项]    所有者:所属组   文件或目录

-R: 递归设置权限
-v: 显示指令执行过程
```

```bash
chown user1:user1 123.txt  #将 123.txt 的所属组和所有者都改为 use1
chown user1 123.txt   # 将 123.txt 的所有者改为 user1
chown :user1 123.txt   # 将 123.txt 的所属组改为 user1
chown -R user1:user1 directory # 将 directory 及其子文件和目录的所有者和所属组都改为 user1
chmod [选项] 权限模式 文件名
```

\-R: 递归设置权限,也就是给子目录的所有文件设定权限

![image-20210918070832533](/images/image-20210918070832533.png)

```bash
chmod u+r [filename]
chmod 644 [filename]
```

## chgrp

修改文件和目录的所属组

```bash
语法: chgrp [选项] [组] [文件|目录]
-R: 递归式地改变指定目录及其下的所有子目录和文件的所属组
```

```bash
chgrp -R mengxin /usr/meng   # 递归改变 /usr/meng 及其子目录的所属组为 mengxin
```

## umask

查看系统的 umask 权限

新建文件最大权限是 666,减去 umask

新建目录最大权限是 777,减去 umask

# 帮助命令

## man

\-f: 查看命令拥有哪个级别的帮助

\-k: 查看和命令相关的所有帮助

## info

## help

只能显示 Shell 内置命令的帮助

## --help

输出简要版 man 命令的信息

# 搜索命令

## which

which 也是搜索系统命令的命令,还可以找到命令别名

**which 命令** 用于查找并显示给定命令的绝对路径，环境变量 PATH 中保存了查找命令时需要遍历的目录。which 指令会在环境变量$PATH 设置的目录里查找符合条件的文件。也就是说，使用 which 命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

## whereis

搜索系统命令的命令,可以查找到帮助文档的位置

## locate

按照文件名搜索普通文件的命令

## find

find 搜索路径 \[选项\] 搜索内容

\-name 文件名

\-iname 不区分大小写的文件名

\-iname 不区分大小写的文件名

\-inum inode 节点

\-size \[+|-\] 大小,c 字节, k 是 KB(小写的 k), M 是 MB(大写) ,G 是 GB(大写)

\-atime \[+|-\] 访问时间

\-mtime \[+|-\] 数据修改时间

\-ctime \[+|-\] 状态修改时间

\-atime \[+|-\] 访问时间

\-mtime \[+|-\] 数据修改时间

\-ctime \[+|-\] 状态修改时间

![image-20210918074914061](/images/image-20210918074914061.png)

\-perm \[+|-\]

\-uid 用户 id

\-gid 用户组 id

\-user 用户名

\-uid 用户 id

\-gid 用户组 id

\-user 用户名

\-group 组名

\-nouser 没有所有者的文件

\-type d 目录

\-type d 目录

\-type f 普通文件

\-type l 软连接文件

逻辑运算符

\-a: and 逻辑与 -o: or 逻辑或 -not: not 逻辑非

\-exec: find 搜索路径 \[选项\] 搜索内容 --exec 命令 2 {} ;

\-ok: find 搜索路径 \[选项\] 搜索内容 --exec 命令 2 {} ;

结尾要有`\;`

区别是-ok 是询问模式

## grep

在文件中提取和匹配符合条件的字符串行

\-i: 忽略大小写

\-n: 输出行号

\-v: 反向查找

\-i: 忽略大小写

\-A: 输入上文的行数

\-B: 输出下文的行数

\-C: 输出查找的上文和下文的行数

\-P: 使用正则表达式

\-c: 只显示匹配到的行数

\-R: 搜索整个文件夹，跟随符号链接

\-r： 搜索整个文件夹，不跟随符号链接

\-h:

\-l:

\-h:

\-H

\--color==auto: 搜索出的关键字用颜色显示

## 管道符 |

管道符将命令 1 的正确输出作为命令 2 的操作对象

# 压缩和解压缩命令

## zip

zip \[选项\] 压缩包名 源文件或源目录

\-r: 压缩目录

## unzip

\-d: 指定解压缩位置

\-v: 查看压缩包中的文件

unzip \[选项\] 压缩包名

## gzip

gzip \[选项\] 源文件

\-c: 将压缩数据输出到标准输出中,可以用于保留源文件

\-d: 解压缩

\-r: 压缩目录,==把目录中的每一个文件都压缩成 gz 格式==

## bzip2

bzip2 \[选项\] 源文件

\-d: 解压缩

\-k: 压缩式保留原文加

\-v: 显示压缩的详细信息

## tar

\-A 或--catenate：新增文件到以存在的备份文件；

\-B：设置区块大小；

\-c 或--create：建立新的备份文件；

\-C &lt;目录&gt;：这个选项用在解压缩，若要在特定目录解压缩，可以使用这个选项。 -d：记录文件的差别；

\-x 或--extract 或--get：从备份文件中还原文件；

\-t 或--list：列出备份文件的内容；

\-z 或--gzip 或--ungzip：通过 gzip 指令处理备份文件；

\-Z 或--compress 或--uncompress：通过 compress 指令处理备份文件；

\-f&lt;备份文件&gt;或--file=&lt;备份文件&gt;：指定备份文件；

\-v 或--verbose：显示指令执行过程；

\-r：添加文件到已经压缩的文件；

\-u：添加改变了和现有的文件到已经存在的压缩文件；

\-j：支持 bzip2 解压文件；

\-v：显示操作过程；

\-l：文件系统边界设置；

\-k：保留原有文件不覆盖；

\-m：保留文件不被覆盖；

\-w：确认压缩文件的正确性；

\-p 或--same-permissions：用原来的文件权限还原文件；

\-P 或--absolute-names：文件名使用绝对名称，不移除文件名称前的“/”号；

\-N &lt;日期格式&gt; 或 --newer=&lt;日期时间&gt;：只将较指定日期更新的文件保存到备份文件里；

\--exclude=&lt;范本样式&gt;：排除符合范本样式的文件。

参数

文件或目录：指定要打包的文件或目录列表。

实例

**将文件全部打包成 tar 包**：

tar -cvf log.tar log2012.log

仅打包，不压缩！ tar -zcvf log.tar.gz log2012.log 打包后，以 gzip 压缩 tar -jcvf log.tar.bz2 log2012.log 打包后，以 bzip2 压缩

在选项`f`之后的文件档名是自己取的，我们习惯上都用 .tar 来作为辨识。 如果加`z`选项，则以.tar.gz 或.tgz 来代表 gzip 压缩过的 tar 包；如果加`j`选项，则以.tar.bz2 来作为 tar 包名。

**查阅上述 tar 包内有哪些文件**：

```
tar -ztvf log.tar.gz
```

由于我们使用 gzip 压缩的 log.tar.gz，所以要查阅 log.tar.gz 包内的文件时，就得要加上`z`这个选项了。

**将 tar 包解压缩**：

```
tar -zxvf /opt/soft/test/log.tar.gz
```

在预设的情况下，我们可以将压缩档在任何地方解开的

**只将 tar 内的部分文件解压出来**：

```
tar -zxvf /opt/soft/test/log30.tar.gz log2013.log
```

我可以透过`tar -ztvf`来查阅 tar 包内的文件名称，如果单只要一个文件，就可以透过这个方式来解压部分文件！

**文件备份下来，并且保存其权限**：

```
tar -zcvpf log31.tar.gz log2014.log log2015.log log2016.log
```

这个`-p`的属性是很重要的，尤其是当您要保留原本文件的属性时。

**在文件夹当中，比某个日期新的文件才备份**：

```
tar -N "2012/11/13" -zcvf log17.tar.gz test
```

**备份文件夹内容是排除部分文件：**

```
tar --exclude scf/service -zcvf scf.tar.gz scf/*
```

**其实最简单的使用 tar 就只要记忆底下的方式即可：**

压　缩：tar -jcv -f filename.tar.bz2 要被压缩的文件或目录名称

查　询：tar -jtv -f filename.tar.bz2

解压缩：tar -jxv -f filename.tar.bz2 -C 欲解压缩的目录

# 下载命令

## wget

**wget 命令** 用来从指定的 URL 下载文件。wget 非常稳定，它在带宽很窄的情况下和不稳定网络中有很强的适应性，如果是由于网络的原因下载失败，wget 会不断的尝试，直到整个文件下载完毕。如果是服务器打断下载过程，它会再次联到服务器上从停止的地方继续下载。这对从那些限定了链接时间的服务器上下载大文件非常有用。

```bash
wget [参数] [URL地址]
```

| 参数 | 作用                                 |
| ---- | ------------------------------------ |
| -b   | 后台下载模式                         |
| -P   | 下载到指定目录                       |
| -t   | 最大尝试次数                         |
| -c   | 断点续传                             |
| -p   | 下载页面内所有资源，包括图片、视频等 |
| -r   | 递归下载                             |

## curl

\-x
\--proxy
使用代理访问

```bash
curl -x socks5://james:cats@myproxy.com:8080 https://www.example.com
```

\-X
\--request
使用指定的 HTTP 方法发送请求

```bash
curl -X POST https://www.example.com
```

\-O
\--remote-name
下载文件，使用原名作为文件名

```bash
curl -O https://example.com/filename
```

\-o
\--output
下载文件并命名

```bash
curl -o example.html https://www.example.com
```

\-I
\--head
向服务器发送 HEAD 请求，然后服务器返回的 HTTP 标头打印出来。

```bash
curl -I https://www.example.com
```

\-i
打印出服务器回应的 HTTP 标头。

\-H
\--header
添加一个请求头

```bash
curl -H 'Accept-Language: en-US' -H 'Secret-Message: xyzzy' https://google.com
```

\-G
\--get
将 `-d, --data, --data-binary or --data-urlencode` 指定的数据使用 ？ 分隔添加到 url 后面，并发送 get 请求。

\-A
\--user-agent
设置用户字符串

```bash
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://google.com
```

\-b
\--cookie
向服务器发送指定的 cookie

```bash
curl -b 'foo1=bar;foo2=bar2' https://google.com
```

\-c
\--cookie-jar
将服务器返回的 cookie 写入文件

```bash
curl -c cookies.txt https://www.google.com
```

\-d
\--data`-d`参数用于发送 POST 请求的数据体。

```bash
$ curl -d'login=emma＆password=123'-X POST https://google.com/login
# 或者
$ curl -d 'login=emma' -d 'password=123' -X POST  https://google.com/login
```

使用`-d`参数以后，HTTP 请求会自动加上标头`Content-Type : application/x-www-form-urlencoded`。并且会自动将请求转为 POST 方法，因此可以省略`-X POST`。

`-d`参数可以读取本地文本文件的数据，向服务器发送。

```bash
curl -d '@data.txt' https://google.com/login
```

上面命令读取`data.txt`文件的内容，作为数据体向服务器发送。

\--data-urlencode

`--data-urlencode`参数等同于`-d`，发送 POST 请求的数据体，区别在于会自动将发送的数据进行 URL 编码。

```bash
curl --data-urlencode 'comment=hello world' https://google.com/login
```

上面代码中，发送的数据`hello world`之间有一个空格，需要进行 URL 编码。

## echo

使用`-e`选项时，若字符串中出现以下字符，则特别加以处理，而不会将它当成一般文字输出：

-   `\a` 发出警告声；
-   `\b` 删除前一个字符；
-   `\c` 不产生进一步输出 (\\c 后面的字符不会输出)；
-   `\f` 换行但光标仍旧停留在原来的位置；
-   `\n` 换行且光标移至行首；
-   `\r` 光标移至行首，但不换行；
-   `\t` 插入 tab；
-   `\v` 与\\f 相同；
-   `\\` 插入\\字符；
-   `\nnn` 插入 `nnn`（八进制）所代表的 ASCII 字符；

# 关机和重启命令

## sync

数据同步

## shutdown

```bash
shutdown [选项] 时间 [警告信息]
选项:

    -c: 取消已经执行的shutdown命令
    -h: 关机
    -r: 重启
 -c: 取消已经执行的shutdown命令
 -h: 关机
 -r: 重启
```

## reboot

重启系统

## halt 和 poweroff 命令

这两个都是关机命令,直接执行即可,这两个命令不会完整关闭和保存的系统的服务,不建议使用

## init

可以用于关机和重启

# 常用网络命令

## ifconfig

## ping

# 系统痕迹命令

## w

显示正在登陆的用户信息的命令,

## who

查看正在登陆的用户,但是显示的内容更加简单

## last

last 命令是查看系统所有登陆过的用户信息的,包括正在登陆的用户和之前登陆的用户

## lastlog

查看系统中所有用户最后一次登陆时间的命令

## lastb

查看错误登陆信息的

## History

```bash
history # 查看历史命令
history -w #
```

## 磁盘管理命令

## du

## tree
