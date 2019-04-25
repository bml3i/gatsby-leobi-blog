---
templateKey: blog-post
id: 20190425a
title: 使用Chrome和迅雷快速批量下载美剧
slug: /2019/04/25/chrome-xpath-get-urls/
date: 2019-04-25T03:48:03.125Z
description: 教你如何使用Chrome和迅雷快速批量下载美剧
tags:
  - tips
  - xpath
  - chrome
  - 迅雷
  - 权利的游戏
---

随着《权利的游戏》新一季的热播，作为资深"伪"美剧迷的我有点懵B，因为这部火遍大江南北的HBO大作我竟然没看过。好在我的迅雷会员还没过期，可以利用一下加个速。

[天天看美剧](http://www.msj1.com/)这个网站不错，资源很全，内容的显示也很有调理。

![tv-download-url](https://leo.bi/assets/20190425/tv-download-urls.jpg)

下面就简单了，把10集对应的资源链接一个一个复制到剪切板，然后打开迅雷新建下载，粘贴，搞定。

但......是不是还有更简单的方法呢？

当然有: 那就是利用chrome控制台 + JavaScript + xpath + 迅雷的批量下载功能

### 步骤一
用Chrome打开要下载的资源网页，打开Developer Tools的Console栏，输入以下命令，然后回车。此时，所有的下载链接已经被复制到粘贴板中。
```
var btstr="";$x("//*[@id='content']//table[@class='table'][1]/tbody/tr/td[1]//a[1]/@href").forEach(function(element){btstr=btstr+"\n"+element.value;});copy(btstr);
```

![xpath-chrome-console](https://leo.bi/assets/20190425/xpath-chrome-console.jpg)

### 步骤二
打开迅雷，新建任务，按下Ctrl+V搞定。或者在步骤一前打开迅雷，使其自动监听粘贴板动作。


### 小技巧
如果你想下载第二个表格里的资源怎么办？很简单，把[1]改成[2]即可。

1. 下载第一个表格里的资源: 
```
var btstr = "";

$x("//*[@id='content']//table[@class='table'][1]/tbody/tr/td[1]//a[1]/@href").forEach(function(element) {
  btstr = btstr + "\n" + element.value;
});

copy(btstr);
```

2. 下载第二个表格里的资源: 
```
var btstr = "";

$x("//*[@id='content']//table[@class='table'][2]/tbody/tr/td[1]//a[1]/@href").forEach(function(element) {
  btstr = btstr + "\n" + element.value;
});

copy(btstr);
```

![download-tips](https://leo.bi/assets/20190425/download-tips.jpg)

