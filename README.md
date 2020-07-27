# (Work In Progress) Cydir

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



### 模糊匹配

### 路径结果的展示

root > dirname **path-name**

