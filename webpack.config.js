const path = require('path');
const BannerPlugin = require('webpack/lib/BannerPlugin')
const FriendlyErrorsWebpackPlugin=require('friendly-errors-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const TerserPlugin = require('terser-webpack-plugin')
const fs = require('fs')


// 通过npm run build:header编译出的路径
const header_path = 'dist/app_header.js'


module.exports = {
    mode: 'none',

    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: "awesome-typescript-loader",       //比ts-loader编译速度更快
            exclude: /header/
        }]
    },
    resolve: {
        extensions: [
            '.ts'
        ]
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new CheckerPlugin(),
        new TerserPlugin(),
        new BannerPlugin({
            banner: () => {
                if(!fs.existsSync(header_path)){
                    throw '文件' + header_path + '不存在，请先执行npm run build:header编译！'
                }
                return fs.readFileSync(header_path,'utf-8')
            },
            raw: true
        })
    ],
};
