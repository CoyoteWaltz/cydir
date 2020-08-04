# (Work In Progress) Cydir

配置命令行指令`commandX` 以及 目标路径`/path/to/somewhere`

```bash
cyder config-path /path/to/somewhere
cyder config-command code
```

对其路径下文件进行模糊匹配

```bash
cyder proj
```

如果在配置的子路径下存在类似`projectA`名字的目录

等同于执行

```bash
code /path/to/somewhere/../projectA
```

目标/功能：不用再去到对应目录了 在任何地方 `cider <fuzzy_path>` 即可用编辑器打开项目

### 路径扫描 and 存储

每次匹配成功将 endpoint 加入 usualList 同时删除

### 模糊匹配

考虑加上 上级目录的情况:

- 匹配的字符串`../../match`会对前第二级的目录生效
- 直接先找出`../../`这样的前缀，之后直接`path.resolve`即可

### 路径结果的展示

root > dirname **path-name**

reset? 检查配置文件是否符合格式