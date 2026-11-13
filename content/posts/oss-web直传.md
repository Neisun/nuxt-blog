---
slug: 537
title: oss-web直传
date: 2017-12-20 17:20:23
tags:
    - javascript
categories:
    - 技术随笔
    - JavaScript技巧与常见问题
description: "讲解阿里云 OSS 的 Web 直传实现。介绍客户端直接上传文件到 OSS 的流程、签名机制与常见配置，减轻服务器压力。"
image: /images/covers/082.jpg
---
## oss直传

这是与服务端进行配合的一种web直传方式。

我们可以读一下阿里云的文档，[文档](https://help.aliyun.com/document_detail/31927.html?spm=5176.doc32184.6.632.EIt9AU);

这里，我们不管服务端，我们只关注前端，怎么实现web直传。确切的说，是*服务端签名直传并设置上传回调*。

大体上，分两步

1. 我们需要先获取服务端的返回给我们的签名，等于是一种权限。
1. 然后，实现上传。

获取签名，发送一个ajax请求，根据返回的参数，就能获得。但是，之后，我使用jQuery带的ajax请求，将资源上传时候，总是提示405与403。然后，根据文档给出的demo，我使用`plupload`这个上传插件进行上传。解决了这个问题。

把代码直接展示出来，做个记录。以防后续有需要。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>OSS上传</title>
</head>

<body>
    <div id="container">
        <button type="button" id="select">选择</button>
        <button type="button" id="upload">上传</button>
    </div>
    <script src="../js/lib/plupload.full.min.js"></script>
    <script>
        var data = {
            name: '',
            key: '',
            policy: '',
            OSSAccessKeyId: '',
            success_action_status: '',
            callback: '',
            signature: '',
            host: '',
        };
        // 发送请求，返回response
        function send_request() {
            var xmlhttp = null;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            if (xmlhttp != null) {
                // 一定要同步请求
                serverUrl = 'http://47.104.71.88:8889/oss/policy?dir=test1/'
                xmlhttp.open("GET", serverUrl, false);
                xmlhttp.send(null);
                return xmlhttp.responseText
            } else {
                alert("Your browser does not support XMLHTTP.");
            }
        };

        function get_signature() {
            var sign = JSON.parse(send_request()).data;
            // data.name = filename;
            data.key = sign.dir;
            data.policy = sign.policy;
            data.OSSAccessKeyId = sign.accessid;
            data.success_action_status = 200;
            data.callback = sign.callback;
            data.signature = sign.signature;
            data.host = sign.host;
        }

        function set_upload_param(up, filename, ret) {
            if (ret == false) {
                get_signature();
            }
            if (filename == "") {
                console.log('没有文件')
            } else {
                console.log('有文件')
                data.name = filename;
                data.key = data.key + filename;
            }
            up.setOption({
                'url': data.host,
                'multipart_params': data
            });
            up.start();
        }
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'select',
            container: document.getElementById('container'),
            url: 'http://bater.oss-cn-beijing.aliyuncs.com',
            init: {
                PostInit: function(up) {
                    console.log(up);
                    document.getElementById('upload').onclick = function() {
                        set_upload_param(up, "", false)
                    }
                },

                FilesAdded: function(up, files) {
                    console.log(2)
                    console.log(files);
                },

                BeforeUpload: function(up, file) {
                    console.log(3);
                    console.log(file);
                    set_upload_param(up, file.name, true);
                },

                UploadProgress: function(up, file) {
                    console.log(4)
                },

                FileUploaded: function(up, file, info) {
                    console.log(5);
                    console.log(data)
                },

                Error: function(up, err) {
                    console.log(6)
                }
            }
        })
        uploader.init();
    </script>
</body>

</html>
```
一般使用方法，就是这样了。但是需要我们熟悉和了解这个插件。

[plupload文档](http://www.phpin.net/tools/plupload/)
