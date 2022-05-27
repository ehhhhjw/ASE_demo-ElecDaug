// 自行定义打包过程
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    outputDir: 'build',
    productionSourceMap: false,
    // css: {
    //     loaderOptions: {
    //       css: {},
    //       postcss: {
    //         plugins: [
    //           require('postcss-px2rem')({
    //             remUnit: 192
    //           })
    //         ]
    //       }
    //     }
    // }

    
    // 只能在开发环境使用，生产环境无法使用
    devServer: {
        proxy: {
            // 用‘/api’开头，代理所有请求到目标服务器
            '/api': {
                target: 'http://129.211.89.155:8050/', // 目标接口域名
                changeOrigin: true, // 是否启用跨域
                pathRewrite: { //
                    '^/api': ''
                    // '/proxy': ''
                }
            }
        }
      }


    // }
}