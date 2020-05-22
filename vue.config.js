const path = require('path')
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

function resolve (dir) {
    return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
    /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463pa
   */
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,

    // 打包app时放开该配置
    publicPath:'/',
    assetsDir:'',
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {

            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

            // 生产环境
            config.plugins.push(
              new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 2048,
                minRatio: 0.8,
                // 是否删除源文件，默认: false
                deleteOriginalAssets: true

              })

            )
        } else {
            // 开发环境
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@layout', resolve('src/layout'))

        // 配置 webpack 识别 markdown 为普通的文件
        config.module
            .rule('markdown')
            .test(/\.md$/)
            .use()
            .loader('file-loader')
            .end()
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */
                    'primary-color': '#1890FF',
                    'link-color': '#1890FF',
                    'border-radius-base': '4px'
                },
                javascriptEnabled: true
            }
        }
    },

    devServer: {
        port: 3000,
        proxy: {
            /* '/api': {
        target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro', //mock API接口系统
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/jeecg-boot': ''  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      }, */
            '/richeninfo-oa': {
                target: 'http://47.101.210.163:8080', // 请求本地 需要jeecg-boot后台项目
                ws: false,
                changeOrigin: true
            }
        }
    },

    lintOnSave: undefined
}
