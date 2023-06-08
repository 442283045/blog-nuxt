---
title: 'Service management'
description: 'Linux 服务管理笔记'
article_id: 1
article_cover: 'article-1.png'
---

### systemctl

```bash
systemctl enable httpd.service             # 使某服务启动自启动
systemctl disable httpd.service                 # 使某服务不自动启动
systemctl status httpd.service                 #（服务详细信息） 检查服务状态
systemctl is-active httpd.service             #（仅显示是否 Active)    检查服务状态
systemctl list-units --type=service          #显示所有已启动的服务
systemctl start httpd.service                 #启动服务
systemctl stop httpd.service                 #停止服务
systemctl restart httpd.service             #重启服务
systemctl reload httpd.service                 #重载服务
```

### ps

```
--sort
 指定排序的顺序，默认升序，例如 ps jax --sort uid,-pid,+pid。
-e，-A
 显示所有进程。
-p，--pid
 显示指定 pid 的进程。
-f
 详细显示。
--format，-o
 显示指定的列。
```

#### top

#### pidof

用于查看某个进程的 PID

#### kill

用于终止某个指定 PID 的服务进程

#### killall

killall 命令用于终止某个指定名称的服务所对应的全部进程，格式为：killall \[参数\] \[进程名称\]。

#### ifconfig

#### uname

uname 命令用于查看系统内核与系统版本等信息，格式为 uname \[-a\]。

#### uptime

平均负载值指的是系统在最近 1 分钟、5 分钟、15 分钟内的压力情况（下面加粗的信息部分）；负载值越低越好，尽量不要长期超过 1，在生产环境中不要超过 5。

#### free

用于显示当前系统中内存的使用量信息，格式为 free -h

#### sosreport

sosreport 命令用于收集系统配置及架构信息并输出诊断文档。

#### tr

时，就可以先使用 cat 命令读取待处理的文本，然后通过管道符（详见第 3 章）把这些文本内容传递给 tr 命令进行替换操作即可。

```bash
cat 123.txt | tr hello world # 把文件中的 hello 替换为world输出到标准输出中
```

#### wc

统计指定文本的行数、字数、字节数。

#### stat

#### cut

#### diff

#### dd

#### file

查看文件的格式

#### at
