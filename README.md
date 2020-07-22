# (Work In Progress) Not a name

配置命令行指令`commandX` 以及 目标路径`/path/to/somewhere`

```bash
cpop config-path /path/to/somewhere
cpop config-command code
```

对其路径下文件进行模糊匹配

```bash
cider proj
```

如果在配置的子路径下存在类似`projectA`名字的目录

等同于执行

```bash
code /path/to/somewhere/../projectA
```

目标/功能：不用再去到对应目录了 在任何地方 `cider <fuzzy_path>` 即可用编辑器打开项目

### 路径扫描 and 存储

通常项目目录都是会放在同一层级的子目录下吧

如何判断该目录是个项目目录呢
  先验知识：每次配置 root 已经深入文件夹遍历的时候
    父层级有很多个子目录 并且比较纯洁 没有太多的独立文件 -> purity
    该目录下有多个文件 or 目录中的子目录下多个文件 探索个几层看看 -> 
    层级越浅越好
  后验知识：
    用户每次输入的模糊路径进行匹配 让每次匹配到的路径增加权重 在一定条件下增加 Fuse 产生的 score 在一定阈值之上
    经过的路径也可以考虑一下 向上更新父节点

可以维护一个常用 list

定期遍历文件去更新

问题：新增/修改文件夹了怎么办 
  定期更新目录？异步去做这个事情
  强制更新目录？搜索的时候 同步去做 没匹配到的时候 大概率是新增了文件夹 从最晚更新/最频繁经过的文件夹入手

结果集根据权重排序 可以 -p 给出完整路径提示 用户继续输入 回车就继续执行 其他比如q 或者 esc？ 就终止 此时对应减少权重

或者就每次都给出完整提示 给用户自由配置这个提示也 ok

初次扫描 3 层，匹配时:

如果无 usualList => 

1. serialize 所有节点进行匹配 => 

匹配成功 => fire 并 append 到 usualList

匹配失败 => 

路径不存在 => 

2. traceParent 先对 parent 做 probe 1 再对其余兄弟做 probe 1 如果兄弟路径不存在就不做 => 如traceParent 的路径不存在 => 要记录没有遍历的层号 最后一个不存在的 parent: nextProbe

=> probe 1 逐层匹配 => 再无走 2 => 直到回到 rootPath => 开始从 nextProbe 往下 => 到最深

2. 最后一层的节点 probe 1 => 每个节点 probe 的时候进行匹配 => 直到

如果有 usualList => 匹配 usualList => 匹配失败 => 走 1


从 usualList 中提取出父节点

每次匹配成功后更新父节点

2. 


### 模糊匹配



