# (Work In Progress) Cydir

Command on Your Directory

A Node.js based command line tool for executing the command to a directory.

## ⚙️安装

Node.js version 8 and above:

`npm install -g cydir`

## 🕹使用

### 配置

#### 命令

需要 Cydir 执行的命令

```bash
cydir config-command your-command
```

#### 根目录

相对的一个根目录，目标文件夹深度在 3 最佳，Cydir 会在此根目录下进行扫描。

```bash
cydir config-root-path /path/to/somewhere
```

### 执行指令

告诉 Cydir 指令需要执行的目标对象（文件路径名）

```bash
cydir a-fuzzy-path-name
```

**支持模糊匹配（默认开启）**

多个选项让匹配更快！（见下）

### Tips

- 路径或指令中含有空格必须要用`""`来包裹哦
- 稍微记一下文件夹的名称哦



## 🧩Commands

**config-command**



**config-root-path**



**reset-config**







## 🎯Options

`-e,--exact`









## 📘Help







## 🔬Why

每次`cd`到对应的文件夹再用`code`打开项目的操作太繁琐了！为了能快速打开项目，同时也能支持模糊匹配（引入了 Fuse.js），所以开始了 Cydir 的开发。

实际上 Cydir 可以配置任何指令（注意空格），指令 + 目录的其他功能等待大家一起来发掘！













配置命令行指令`commandX` 以及 目标路径`/path/to/somewhere`

```bash
cydir config-path /path/to/somewhere
cydir config-command code
```

对其路径下文件进行模糊匹配

```bash
cydir proj
```

如果在配置的子路径下存在类似`projectA`名字的目录

等同于执行

```bash
code /path/to/somewhere/.../projectA
```

目标/功能：不用再去到对应目录了 在任何地方 `cydir <fuzzy_path>` 即可用编辑器打开项目

### 路径扫描 and 存储

每次匹配成功将 endpoint 加入 usualList 同时删除

### 模糊匹配

考虑加上 上级目录的情况:

- 匹配的字符串`../../match`会对前第二级的目录生效
- 直接先找出`../../`这样的前缀，之后直接`path.resolve`即可

### 路径结果的展示

root > dirname **path-name**

reset? 检查配置文件是否符合格式

### TODO

考虑加个 -p, --parent 指明父路径

指令改为表驱动吧

*缺陷:* prefixes 在 traceProbe 中更新不会去除原来的 prefix，保存之前加一步整理 prefixes 和 ep ep 的 prefixId 都要改

### 测试进度

2020-08-14: check0, check1,check3
