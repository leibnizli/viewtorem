viewtorem
=========

替换css属性值中的px

### 安装

~~npm install -g viewtorem~~

### 初始化

    viewtorem init

初始化后会在当前目录生成一个名为`viewtorem.json`的配置文件，如下：

```javascript
{
    //待处理文件值可以是数组或字符串
    //例如：“./style”，当前目录下style文件夹下所有css文件(会自动排除包含‘-rem.css’这些已经转换过的样式表)
    "files": ["./css/style.css"],
    //默认根目录字体大小(px)
    "root_value": 20,
    //保留小数位
    "unit_precision": 5,
    //需要换算的属性
    //"font", "font-size", "line-height", "letter-spacing"
    "prop_white_list": ["width", "height", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left"],
    //布尔值，是否替换掉属性值
    //默认会追加
    "replace": false,
    //布尔值，是否替换media screen中的属性值
    //例如“@media screen and (max-width:240px)”
    "media_query": false
}
```

### 执行

    viewtorem build
