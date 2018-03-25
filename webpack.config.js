const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ButternutWebpackPlugin = require('webpack-butternut-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Jarvis = require('webpack-jarvis');
const createVariants = require('parallel-webpack').createVariants;

function capitalizeWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createConfig(options) {
  return {
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules']
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].' + options.target + '.js',
        library: 'devCanvas' + options.target === 'umd' ? '' : capitalizeWord(options.target),
        libraryTarget: options.target
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        stats: 'minimal',
        inline: true
    },
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader'
        }
      ]
    },
    optimization: {
      splitChunks: {
      },
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: true,
                mangle: true,
            }
        }),
      ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //   filename: 'index.html',
        //   template: './index.html'
        // }),
        // new CopyWebpackPlugin([
        //   {from: 'static'}
        // ]),
        // new ButternutWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        // new Jarvis({
        //   port: 1337 // optional: set a port
        // })
    ],
  };
}

module.exports = createVariants({
  target: ['umd']
}, createConfig);