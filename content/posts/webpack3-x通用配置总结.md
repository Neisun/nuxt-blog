---
slug: 539
title: webpack3.x通用配置总结
date: 2018-01-21 10:41:10
tags:
    - webpack3.x
categories:
    - 技术随笔
    - 前端自动化工具
    - 自动化工具之Webpack
description: "总结 webpack 3.x 的通用配置。从入口、输出、loader 到 plugin，梳理构建配置的关键项，形成一套可复用的模板。"
image: /images/covers/084.jpg
---
# webpack3.x

新年伊始，webpack来到了3.10.0版本。这个非常流行也非常好用的自动化、模块化打包工具加入了一些新的元素。

说说自己。我是在用vue之后才开始真正意义上全面接触webpack的，第一次看配置文件，是头都大了，而且也不敢随意动配置文件，生怕随意动了文件，项目就起不来，也无法打包了。完完整整开发了几个项目之后，对webpack的配置文件不那么反感和头大了。虽然它的配置略显繁琐和晦涩（晦涩是因为文档不是很友好，据说webpack团队拿到融资了，希望以后他们能把文档维护做好），但是总体来看还是能明白的。

于是，为了深入了解webpack的配置文件，我自己搞了个配置文件，这里把它叫做通用配置文件好了。能帮助前端快速的开发和打包。

文章用来记录通用配置文件，基本注释都在配置文件中展示了。

项目目录截图

![](/hunaisong.github.io/img/mulu.png)

然后看配置文件

配置文件起初我只想用一个`webpack.config.js`就搞定配置，但我发现，开发环境和生产环境下，还是有不少差异，所以，就将文件配置一分为三。

## webpack.common.js

看名字就知道啦，这文件放dev和prod都能用的配置。

```js
// 这里是webpack的通用配置信息
const path = require('path');
const Webpack = require('webpack');
module.exports = {
    // 入口文件
    entry: {
        // 主要文件
        app: './app/index.js',
        // 第三方文件，比如jq或者lodash等，这样子配置会把文件打包成vendor.js
        // 但是打包的话，会比较大，这里先选择不打包，直接把第三方文件用插件copy到打包后的目录中
        // vendor:'./static/js/jquery/jquery.js'
    },
    output: {
        // 打包之后的出口文件
        path: path.resolve(__dirname, 'dist'),
        // 打包之后文件的名称，在prod中会额外进行配置，因为需要分出一个js文件夹
        filename: '[name].js'
    },
    resolve:{
            /*
            * An array of extensions that should be used to resolve modules
            * （引用时可以忽略后缀）
            * */
            extensions: ['*', '.js', '.css', '.scss', '.ejs', '.png', '.jpg'],
                /*
                * The directory (absolute path) that contains your modules
                * */
            modules: [
                path.resolve('./node_modules')
            ],
                /*
                * Replace modules with other modules or paths.
                * （别名，引用时直接可以通过别名引用）
                * */
            alias: {
                /*
                * js
                */
                jquery: path.resolve(__dirname, "static/js/jquery/jquery"),
                underscore: path.resolve(__dirname, "static/js/underscore/underscore.js"),


                /*
                * css
                */
                bootstrapcss: path.join(__dirname, "static/css/bootstrap/bootstrap-3.3.5.css"),
                indexcss: path.join(__dirname, "static/css/index.css"),
            }
    },
    module: {
        rules: [
            // js,babel解析
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/
            },
            // 图片
            {
                test:/\.(png|gif|jpe?g)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            // 转化成base64格式的限制 10000Bytes
                            limit:10000,
                            // 这样子定义打包之后可以直接生成文件夹static/img
                            name:path.posix.join('static','img/[name]-[hash].[ext]')
                        }
                    }
                ]
            },
            // 字体图标
            {
                test:/\.(eot|woff|woff2|ttf|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            // 限制在5000Bytes，与图片的限制一个道理，如果不加限制
                            // 如果不加限制，那么打包之后的app.js是非常巨大的
                            limit:5000,
                            // 打包之后生成fonts文件夹,static/fonts
                            // name:'fonts/[name]-[hash].[ext]'
                            name:path.posix.join('static','fonts/[name]-[hash].[ext]')
                        }
                    }
                ]
            },
            // 多媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                  limit: 10000,
                //   name: utils.assetsPath('media/[name].[hash:7].[ext]')
                    name:path.join('static','media/[name].[hash:7].[ext]')
                }
              },

        ]
    },
    // 在通用配置中不添加插件，插件都放在dev文件和prod文件中
    plugins: [
        // 自动生成html
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: path.resolve(__dirname, 'app/index.html'),
        //     inject: true
        // }),
        // 删除dist文件夹
        // new CleanWebpackPlugin('dist', {
        //     // 根目录
        //     root: __dirname,
        //     // 开启控制台输出
        //     verbose: true,
        //     // 是否测试删除，我们选false，让它真的删除
        //     dry: false
        // }),
        // 提取css文件
        // new ExtractTextPlugin('css/[name]-[hash].css'),
        // 公共文件比如jq
        // new Webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     // filename: "vendor.js"
        //     // (给 chunk 一个不同的名字)
          
        //     minChunks: Infinity,
        //     // 随着 entrie chunk 越来越多，
        //     // 这个配置保证没其它的模块会打包进 vendor chunk
        //   }),
        // 自动加载模块，而不必到处 import 或 require，比如jquery之类的
        // new Webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery",
        //     "_": "underscore"
        // }),
        /*
        * Using this config the vendor chunk should not be changing its hash unless you change its code or dependencies
        * （避免在文件不改变的情况下hash值不变化）
        * */
        // new Webpack.optimize.OccurrenceOrderPlugin(),
    ],
}
```
我为啥，把plugins中的注释保留了，一是不舍得。。。毕竟我查文档查插件的用法，好麻烦。而且写着写着，我发现这么整不合适。。。，这个配置中最好不放插件。

## webpack.dev.js

```js
const path = require('path');
const Webpack = require('Webpack');
const Merge = require('Webpack-merge');
const CommonConfig = require('./Webpack.common');
const HtmlWebpackPlugin = require('html-Webpack-plugin');
const CopyWebpackPlugin = require('copy-Webpack-plugin');
module.exports = Merge(CommonConfig,{
    output:{
        publicPath:'/'
    },
    module: {
        rules:[
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    },{
                        loader:'less-loader'
                    },{
                        loader:'postcss-loader'
                    }
                ]
            },
        ]
    },
    devServer:{
        clientLogLevel: 'warning',
        // 根目录，因为用了copy-Webpack-plugin，不用这个配置
        contentBase:false,
        // contentBase:path.resolve(__dirname,'dist'),
        // 压缩
        compress:false,
        // ip
        host:'localhost',
        // 端口
        port:8080,
        // 是否开启热更新
        hot:true,
        // 文件变动打印消息到控制台
        inline:true,
        // 自动打开浏览器
        open:true,
        // 
        historyApiFallback:true,
        // 
        publicPath:'/',
        // 配置代理
        proxy:{},
    },
    plugins:[
        // 热模块替换，有了这个神器，我们可以不刷新就可以预览项目，非常重要，需要相应的在devServer中配置hot参数
        new Webpack.HotModuleReplacementPlugin(),
        // HMR shows correct file names in console on update.
        new Webpack.NamedModulesPlugin(), 
        new Webpack.NoEmitOnErrorsPlugin(),
        // html插件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname,'app/index.html'),
            inject: true
          }),
        // copy custom static assets，复制静态资源
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
        // 自动加载模块，而不必到处 import 或 require，比如jquery之类的
        new Webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "_": "underscore"
        }),
    ]
})
```

## webpack.prod.js

```js
// 生产环境下的配置
const Merge = require('Webpack-merge');
const ComnonConfig = require('./Webpack.common');
const Webpack = require('webpack');
const path = require('path');
// 复制静态资源
const CopyWebpackPlugin = require('copy-Webpack-plugin')
// 自动生成html插件
const HtmlWebpackPlugin = require('html-Webpack-plugin')
// 提取css插件
const ExtractTextPlugin = require('extract-text-Webpack-plugin')
// 压缩css插件
const OptimizeCSSPlugin = require('optimize-css-assets-Webpack-plugin')
// 压缩js插件
const UglifyJsPlugin = require('uglifyjs-Webpack-plugin')
// 清除文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = Merge(ComnonConfig,{
    output: {
        // 打包之后的输出路径
        path: path.resolve(__dirname,'dist'),
        // 把所有的文件都打包成static文件夹下的
        filename:path.posix.join('static','js/[name].[chunkhash].js'),
        // filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // chunkFilename
        chunkFilename:path.posix.join('static','js/[id].[chunkhash].js'),
        // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
        publicPath:'./'
      },
    module: {
        rules:[
            {
                test:/\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:'css-loader',
                        },
                        {
                            loader:'less-loader',
                        },
                        {
                            loader:'postcss-loader'
                        }
                    ],
                    publicPath: '../../'
                  })
                }
            ]
    },
    plugins:[
        // 压缩js文件
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false
              }
            },
            // 并行，提高构建速度
            parallel: true
          }),
        //  提取css文件
        new ExtractTextPlugin({
            filename:path.posix.join('static','css/[name].[contenthash].css'),
            // filename: utils.assetsPath('css/[name].[contenthash].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by Webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
            // increasing file size: https://github.com/vuejs-templates/Webpack/issues/1110
            allChunks: true,
        }),
        // 压缩css插件
        new OptimizeCSSPlugin({
              cssProcessorOptions:{
                  safe:true
              }
          }),
        // 自动生成html插件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname,'app/index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vendor modules does not change
        // 保持模块的id，当第三方模块没有变化
        new Webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting，作用域提升，属于优化插件，打包更快
        new Webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file
        // 把第三方的模块打包成一个vendor文件
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks (module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                    path.join(__dirname, 'node_modules')
                    ) === 0
                )
            }
        }),
        // extract Webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // This instance extracts shared chunks from code splitted chunks and bundles them
        // in a separate chunk, similar to the vendor chunk
        // see: https://Webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }),
        // 复制公共资源
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
        // 发布前清除dist文件夹
        new CleanWebpackPlugin('dist', {
            // 根目录
            root: __dirname,
            // 开启控制台输出
            verbose: true,
            // 是否测试删除，我们选false，让它真的删除
            dry: false
        }),
    ]
})
```
## package.json

```js
{
  "name": "demo04",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --progress --colors --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "^7.2.5",
    "babel-core": "^6.26.0",
    "babel-generator": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "clean-webpack-plugin": "^0.1.17",
    "copy-webpack-plugin": "^4.3.1",
    "css-loader": "^0.28.9",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^1.1.6",
    "html-webpack-plugin": "^2.30.1",
    "less": "^2.7.3",
    "less-loader": "^4.0.5",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "postcss-loader": "^2.0.10",
    "purify-css": "^1.2.5",
    "purifycss-webpack": "^0.7.0",
    "string": "^3.3.3",
    "style-loader": "^0.19.1",
    "uglifyjs-webpack-plugin": "^1.1.6",
    "url-loader": "^0.6.2",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.11.0",
    "webpack-merge": "^4.1.1"
  },
  "dependencies": {
    "string": "^3.3.3"
  }
}

```
## .babelrc 

```js
{
    "presets": [
        "env"
    ]
}
```

## postcss.config.js

```js
module.exports = {
    plugins:[
        require('autoprefixer')
    ]
}
```
所有的这些，就是webpack3.x的通用配置了。