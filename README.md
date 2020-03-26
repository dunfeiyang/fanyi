# 翻译小工具

- 使用了百度翻译 api，需要新建一个 private.ts 文件，将 appid 和 secret 导出

```
npm i

ts-node-dev src/cli.ts banana
```

#### 可以更改 .zshrc 文件将命令改为本地命令

```
vi ~/.zshrc

//新增一行
alias fy="ts-node-dev ~/fanyi/src/cli.ts"

//就可以执行
fy banana
```
