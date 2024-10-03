const HtmlWebpackPlugin = require("html-webpack-plugin");
const { sources } = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000, // Host application port
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remoteApp1: "remoteApp1@http://localhost:3001/remoteEntry.js",
        // remoteApp2: "remoteApp2@http://localhost:3002/remoteEntry.js",
        // remoteApp3: "remoteApp3@http://localhost:3003/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, eager: true }, // Ensure React is shared as a singleton
        "react-dom": { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
