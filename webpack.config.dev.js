const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'source-map', // Habilita los sourcemaps
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
        // assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'],
        alias:{
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { sourceMap: true },
                }
            },
            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource',
                generator:{
                    filename: 'assets/images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2)$/i, // Manejar archivos de fuentes
                type: 'asset/resource', // Reemplaza url-loader en Webpack 5
                generator: {
                    filename: 'assets/fonts/[name].[hash][ext]' // Incluye hash en el nombre del archivo
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"), //Aqui estan los archivos que vamos a mover (imagenes)
                    to: "assets/images" // Esto lo vamos a pasar a la carpeta dist
                }
            ]
        }),
        new Dotenv(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static', // Genera un archivo HTML estático para el análisis
            openAnalyzer: true, // Abre automáticamente el reporte en el navegador
        }),
    ],
    devServer: {
    static: {
        directory: path.join(__dirname, 'dist'), // Carpeta de los archivos estáticos
    },
    compress: true, // Habilita la compresión gzip
    historyApiFallback: true, // Soporte para SPAs
    port: 3006, // Puerto del servidor
    open: true, // Abre el navegador automáticamente al iniciar el servidor
}
}