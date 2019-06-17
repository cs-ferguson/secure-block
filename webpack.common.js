const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractEditorSCSS = new ExtractTextPlugin({
  filename: './block.editor.build.css'
});
var extractBlockSCSS = new ExtractTextPlugin({
  filename: './block.style.build.css'
});
var plugins = [ extractEditorSCSS, extractBlockSCSS ];
var scssConfig = {
  use: [
    {
      loader: 'css-loader'
    },
    {
      loader: 'sass-loader',
      options: {
        outputStyle: 'compressed'
      }
    }
  ]
};

module.exports = {
	context: __dirname,
	entry: './src/block.js',
	output: {
		path: __dirname + '/dist/',
		filename: 'block.build.js',
	},
	devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /editor\.scss$/,
        exclude: /node_modules/,
        use: extractEditorSCSS.extract(scssConfig)
      },
      {
        test: /style\.scss$/,
        exclude: /node_modules/,
        use: extractBlockSCSS.extract(scssConfig)
      }
    ]
  }
};
