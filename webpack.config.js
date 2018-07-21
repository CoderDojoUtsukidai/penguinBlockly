const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./src/main.js",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs'],
                },
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
            {
                test: /\.xml$/,
                loader: 'raw-loader',
            },
        ]
    },
    output: {
        path: __dirname + "/public",
        publicPath: __dirname + "/public",
        filename: "bundle.min.js"
    },
    mode: debug ? "development" : "production",
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};
