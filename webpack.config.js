const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
      ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'public')
    },
    devServer:{
        static:{
            directory: path.resolve(__dirname, 'public')
        },
        compress: true,
        port: 9000,
        hot: true
    }
  }