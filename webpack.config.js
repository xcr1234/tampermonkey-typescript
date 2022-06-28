const path = require('path');
const BannerPlugin = require('webpack/lib/BannerPlugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const {CheckerPlugin} = require('awesome-typescript-loader')
const TerserPlugin = require('terser-webpack-plugin')
const fs = require('fs')
const argv = require('yargs').argv;
const sync = require('./sync')

// 通过npm run build:header编译出的路径
const header_path = 'dist/app_header.js'

let output = {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
}


module.exports = async () => {

    if (!fs.existsSync(header_path)) {
        throw '文件' + header_path + '不存在，请先执行npm run build:header编译！'
    }
    const header = fs.readFileSync(header_path, 'utf-8')


    if (argv.sync === 'yes') {
        //WebDav同步模式，更改输出目标
        output = await sync(header)
    }

    return {
        mode: 'none',

        entry: './src/index.ts',
        output: output,
        devServer: {
            // 以dist为基础启动一个服务器，服务器运行在4200端口上，每次启动时自动打开浏览器
            contentBase: 'dist',
            port: 4200
        },
        module: {
            rules: [{
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    'awesome-typescript-loader'
                ],
                exclude: /header/
            }]
        },
        resolve: {
            extensions: [
                '.ts', '.js'
            ]
        },
        plugins: [
            new FriendlyErrorsWebpackPlugin(),
            new CheckerPlugin(),
            new TerserPlugin(),
            new BannerPlugin({
                banner: header,
                raw: true
            })
        ],
    };
}
