# Cydir

Command on Your Directory

A Node.js based command line tool for executing the command to a directory.

## ⚙️Install

[Node.js](https://nodejs.org/en/download/) version 8 and above:

命令行：`npm install -g cydir`

安装成功后输入：`cydir`

查看帮助信息

## Example

以前你可能需要`cd`到目录下，用`code`指令去打开项目

```bash
cd /xxx/xxx/xxx
code project1

cd ../../yyy/yyy
code project2
```

现在仅需**一次配置，随处使用**

```bash
# 配置指令 code
cydir set-command code
# 配置一个能覆盖所有项目的根目录
cydir set-root-path /xxx/my-projects
```

在任意位置使用`cydir`

```bash
cydir project2
cydir roject1
```

## 🕹Usage

### 配置

#### 命令

告诉 Cydir 需要执行的命令（可以多次替换）

```bash
cydir set-command your-command
```

#### 根目录

告诉 Cydir 一个相对的根目录（**绝对路径**），推荐目标文件夹深度在 3，Cydir 会在此根目录下进行扫描。（可以多次替换）

```bash
cydir set-root-path /path/to/somewhere
```

### 执行指令

告诉 Cydir 指令需要执行的目标对象（文件路径名）**支持模糊匹配（默认开启）**

```bash
cydir a-fuzzy-path-name
# 执行成功！🎉
```

多个选项让匹配更快更精确！（见下）

### Tips

- 路径或指令中含有空格必须要用`""`来包裹
- 需要稍微记忆一下文件夹的名称

## 🧩Commands

**set-command**

配置指令，确保在你的`PATH`环境变量中

```bash
cydir set-command <command>
```

**set-root-path**

配置根目录，必须是绝对路径

```bash
cydir set-root-path "/path/to/some where"
```

**reset-config**

清空所有配置信息

```bash
cydir reset-config
```

## 📘Help & Options

```bash
Usage: index [options] [command] [path...]

Options:
  -V, --version                 output the version number
  -s, --skip-confirm            Skip confirm before exec command
  -e, --exact                   Exact match
  -c, --case-sensitive          Match with case sensitive
  -h, --help                    display help for command

Commands:
  set-command <command>         Set the command to execute on your directories
  set-root-path <root-path>     Set a relative root path of your directories
  reset-config                  Reset all config
```

精确匹配：`-e, --exact`

大小写敏感：`-c, --case-sensitive`

跳过执行前的确认：`-s, --skip-confirm`

## 🔬Why

每次`cd`到对应的文件夹再用`code`打开项目的操作太繁琐了！为了能快速打开项目，同时也能支持模糊匹配（引入了 Fuse.js），并且受到[`autojump`](https://github.com/wting/autojump)便捷操作的启发，所以开始了 Cydir 的开发。

实际上 Cydir 可以配置任何指令（注意空格），指令 + 目录的其他功能等待大家一起来发掘！

## Features

快速定位（并不每次扫描所有文件夹）

支持模糊匹配（感谢 [Fuse.js](https://github.com/krisk/fuse)）

命令行交互和漂亮的提示（感谢 [Command.js](https://github.com/tj/commander.js)、[chalk](https://github.com/chalk/chalk)）

windows 平台兼容（感谢 [cross-spawn](https://github.com/moxystudio/node-cross-spawn)）

## TODO

- 加入`-p,--parent <parent>`选项，提供指定父路径
- 支持连续路径匹配，e.g.`cydir xxx/parent/child`
- 优化存储和搜索
