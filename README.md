# Not a name

配置命令行指令`commandX` 以及 目标路径`/path/to/somewhere`

```bash
cpop config-path /path/to/somewhere
cpop config-command code
```

对其路径下文件进行模糊匹配

```bash
cpop proj
```

如果在配置的子路径下存在类似`projectA`名字的目录

等同于执行

```bash
code /path/to/somewhere/../projectA
```
