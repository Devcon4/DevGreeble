const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function createConfig(options = {}) {
    return {
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules']
        },
        mode: 'development',
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js'
        },
        devServer: {
            historyApiFallback: true,
            port: 4200,
            stats: 'minimal',
            inline: false
        },
        entry: './demo/bootstrap.ts',
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    exclude: /\.\.\/node_modules/,
                    loader: 'awesome-typescript-loader'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './demo/index.html'
            })
        ]
    };
}

module.exports = createConfig();