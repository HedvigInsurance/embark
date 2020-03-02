const merge = require("webpack-merge");
const webpack = require("webpack");
const { resolve } = require("path");
const path = require("path");

const common = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    mainFields: ["browser", "main", "module"]
  },
  context: resolve(__dirname, "./src"),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader", "source-map-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        loaders: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]",
          "image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false"
        ]
      }
    ]
  },
  plugins: [],
  performance: {
    hints: false
  }
};

module.exports = merge(common, {
  mode: "development",
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./index.tsx"
  ],
  devServer: {
    hot: true,
    sockPort: 53678,
    port: 53678,
    contentBase: path.join(__dirname, "dist"),
    writeToDisk: true
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
