# react-app-rewired

我们通常使用`create-creact-app`来快速创建项目。对于小型项目，我们不需要任何修改即可快速开发部署。但对于某些项目，不可避免的需要在webpack中，补充一些配置。

如果需要手动修改配置，有三种方案：

1. 运行`npm run eject`弹出配置，得到原始的webpack配置文件config。这个过程是不可逆的。如果有很多定制需求，不如自己搭建一个架子。
2. 改写script文件中的js。这个本文不进行介绍。
3. 使用第三方工具进行修改。`react-app-rewired`可以用来帮助重写react脚手架配置 。

使用`react-app-rewired`无需生成更多额外的文件，同时配置又趋于更简单可控。

### 下载安装

`react-app-rewired@2.x`版本需要搭配`customize-cra`使用。

```
yarn add customize-cra react-app-rewired --dev
```
在根目录下新建`config-overrides.js`文件，与`package.json`同级。

```
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config
}
```

> `customize-cra`利用`react-app-rewired`的`config-overrides.js`文件。通过在`override`中配置`customize-cra`中的函数，你可以很容易地修改底层配置对象（`webpack`，`webpack-dev-server`，`babel`等）。

修改`package.json`文件中的启动脚本

```
{
  // ...
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
  // ...
}
```

### 配置样例

对于`customize-cra`支持的函数，可参见[customize-cra函数文档](https://github.com/arackaf/customize-cra/blob/HEAD/api.md)

- 使用ES7的装饰器

```
/* config-overrides.js */
const {
  override,
  addDecoratorsLegacy
} = require('customize-cra')

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),
)
```

- 使用Less

安装less和less-loader
```
yarn add  less less-loader --dev
```
变更配置文件
```
const {
  override,
  // ...
  addLessLoader,
  // ...
} = require('customize-cra')

module.exports = override(
  // ...
  // less
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      // Optionally adjust URLs to be relative. When false, URLs are already relative to the entry less file.
      relativeUrls: false,
      modifyVars: { '@primary-color': '#A80000' },
      // cssModules: {
      //   // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      //   localIdentName: "[path][name]__[local]--[hash:base64:5]",
      // }
    } 
  })
  // ...
)
```
这里利用了less-loader的modifyVars来进行主题配置。当然这里的modifyVars的值也可以是一个theme文件。

- 添加别名

```
const {
  override,
  // ...
  addWebpackAlias
} = require('customize-cra')
const path = require('path')

module.exports = override(
  // ...
  // 路径别名
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  })
)
```

- 关闭sourcemap

```
const rewiredMap = () => config => {
    config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
    return config;
};

module.exports = override(
    // 关闭mapSource
    rewiredMap()
);
```


### 参考文档
1. [react-app-rewired使用](http://wmm66.com/index/article/detail/id/165.html)
2. [关于最新create-react-app使用react-app-rewired2.x添加webpack配置](https://www.cnblogs.com/zyl-Tara/p/10635033.html)
3. [react-app-rewired](https://www.npmjs.com/package/customize-cra#documentation)