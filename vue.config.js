module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: "src/preload.js",
      builderOptions: {
        appId: "com.example.app",
        productName: "三维全景", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2021", //版权信息
        directories: {
          output: "./dist", //输出文件路径
        },
        win: {
          //win相关配置
          icon: "./icon.ico", //图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: "nsis", //利用nsis制作安装程序
              arch: [
                "x64", //64位
                // "ia32", //32位
              ],
            },
          ],
        },
        files: ['**/*'],
        extraResources: {
          // 拷贝dll等静态文件到指定位置,否则打包之后回出现找不大dll的问题
          from: './config.json',
          to: '../'
        },
        asar: false,
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./icon.ico",
          uninstallerIcon: "./icon.ico",
          installerHeaderIcon: "./icon.ico",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "三维全景",
        },
        publish: [
          {
            provider: "generic",
            // url: "http://172.16.13.198",
            url: "http://reparo147.okaygis.com:18012/folder/",
          },
        ],
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            // 把px单位换算成rem单位
            rootValue: 37.5, //通常结合 lib-flexible 设置 rem 基准值,默认用37.5,不然容易出问题
            selectorBlackList: [".ignore"], //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换
            propList: ["*"],
          }),
        ],
      },
    },
  },
};
