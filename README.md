# 文件上传（upload-tool）

|事件名|功能|参数|
|---|---|---|
|`connect`|连接服务器|无|
|`put`|调用单文件上传接口触发|`options`:用户配置，`file`: 上传文件路径|
|`upload`|单个文件、目录上传成功触发|`options`:用户配置,`files`: 上传文件列表, `filePath`:成功上传的文件、目录本地路径|
|`mkdir`|调用创建文件夹目录接口触发|`options`:用户配置，`dir`: 上传文件夹路径|
|`delete`|调用删除文件触发|`options`:用户配置，`file`:删除文件路径|
|`listy`|调用文件查询接口触发|`file`:查询文件路径|
## Dev

```bash
# clone code
git clone https://github.com/jiulingSir/upload-tool

cd upload-tool

# install dependencies
npm/cnpm

# start dev mode
npm/cnpm cmd
```

## Test

```bash
npm test
```

## 单测覆盖率

![cover](./coverage/lcov-report/cover.jpg)
