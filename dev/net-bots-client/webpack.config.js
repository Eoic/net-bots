const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".html"],
    },

    output: {
        publicPath: "public",
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),
    },
    devServer: {
        publicPath: "/",
        contentBase: "./public",
    },
    devtool: "eval-source-map",
    target: "web",
};
