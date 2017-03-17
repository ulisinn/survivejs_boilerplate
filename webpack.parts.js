const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.devServer = function ({ host, port } = {}) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      stats: 'errors-only',
      host, // Defaults to `localhost`
      port, // Defaults to 8080
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};

exports.lintJavaScript = function ({ include, exclude, options }) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include,
          exclude,
          enforce: 'pre',
          
          loader: 'eslint-loader',
          options,
        },
      ],
    },
  };
};

exports.loadCSS = function ({ include, exclude } = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,
          
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  };
};

exports.extractCSS = function ({ include, exclude, use }) {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash:8].css',
  });
  
  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,
          
          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.autoprefix = function () {
  return {
    loader: 'postcss-loader',
    options: {
      plugins: () => ([
        require('autoprefixer'),
      ]),
    },
  };
};

exports.purifyCSS = function ({ paths }) {
  return {
    plugins: [
      new PurifyCSSPlugin({ paths }),
    ],
  };
};

exports.lintCSS = function ({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          enforce: 'pre',
          
          loader: 'postcss-loader',
          options: {
            plugins: () => ([
              require('stylelint')({
                // Ignore node_modules CSS
                ignoreFiles: 'node_modules/**/*.css',
              }),
            ]),
          },
        },
      ],
    },
  };
};

exports.loadImages = function ({ include, exclude, options } = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg)$/,
          include,
          exclude,
          
          use: {
            loader: 'url-loader',
            options,
          },
        },
      ],
    },
  };
};

exports.loadFonts = function ({ include, exclude, options } = {}) {
  return {
    module: {
      rules: [
        {
          // Capture eot, ttf, woff, and woff2
          test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          include,
          exclude,
          
          use: {
            // loader: 'file-loader',
            loader: 'url-loader?limit=20&name=assets/[name].[hash].[ext]',
            options,
          },
        },
      ],
    },
  };
};

exports.generateSourceMaps = function ({ type }) {
  return {
    devtool: type,
  };
};

exports.extractBundles = function (bundles) {
  return {
    plugins: bundles.map((bundle) => (
      new webpack.optimize.CommonsChunkPlugin(bundle)
    )),
  };
};

exports.loadJavaScript = function ({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include,
          exclude,
          
          loader: 'babel-loader',
          options: {
            // Enable caching for improved performance during
            // development.
            // It uses default OS directory by default. If you need
            // something more custom, pass a path to it.
            // I.e., { cacheDirectory: '<path>' }
            cacheDirectory: true,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};


exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path]),
    ],
  };
};

exports.attachRevision = function () {
  return {
    plugins: [
      new webpack.BannerPlugin({
        banner: new GitRevisionPlugin().version(),
      }),
    ],
  };
};

exports.minifyJavaScript = function () {
  return {
    plugins: [
      new BabiliPlugin(),
    ],
  };
};

exports.minifyCSS = function ({ options }) {
  return {
    plugins: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: options,
      }),
    ],
  };
};

exports.setFreeVariable = function (key, value) {
  const env = {};
  env[key] = JSON.stringify(value);
  
  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.page = function ({
                           path = '',
                           template = require.resolve(
                             'html-webpack-plugin/default_index.ejs'
                           ),
                           title,
                           entry,
                           chunks,
                         } = {}) {
  return {
    entry,
    plugins: [
      new HtmlWebpackPlugin({
        chunks,
        mobile: true,
        filename: `${path && path + '/'}index.html`,
        template,
        title,
      }),
    ],
  };
};
