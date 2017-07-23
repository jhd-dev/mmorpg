'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
    {
        context: path.join(__dirname, 'src'),
        entry: './',
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/dist/',
            filename: 'main.js'
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: './' }
            ], { ignore: ['*.js']})
        ],
        devServer: {
            historyApiFallback: true,
            noInfo: true
        },
        performance: {
            hints: false
        }
    },
    {
        //context: path.join(__dirname, 'src'),
        entry: path.resolve(__dirname, './src') + '/app.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/dist/',
            filename: 'main.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        name: '[name].js'
                    }
                },
                {
                    test: /^((?!\.js).)*$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            noInfo: true
        },
        performance: {
            hints: false
        }
    }
];

if (process.env.NODE_ENV === 'production'){
    module.exports.forEach(function(config){
        config.devtool = '#source-map';
        config.plugins = (config.plugins || []).concat([
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]);
    });
}
