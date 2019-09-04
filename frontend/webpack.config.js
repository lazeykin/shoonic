const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        main: path.resolve(__dirname, 'src/main.ts'),
        sellerComponent: path.resolve(__dirname, 'src/app/dashboard/seller/seller.component.ts'),
        buyerComponent: path.resolve(__dirname, 'src/app/dashboard/buyer/buyer.component.ts'),
        messenger: path.resolve(__dirname, 'src/app/dashboard/messenger/messenger.component.ts'),
        webShop: path.resolve(__dirname, 'src/app/dashboard/web-shop/web-shop.component.ts'),
        sellerProductAdd: path.resolve(__dirname, 'src/app/dashboard/seller/sellerProductAdd.component.ts'),
        sellerEditProduct: path.resolve(__dirname, 'src/app/dashboard/seller/sellerEdit.component.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'dist/browser'),
        filename: '[name].[contenthash:8].js',
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.html',
            filename: './index.html'
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    }
};
