const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const BabelWebpackPlugin = require('babel-minify-webpack-plugin');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

exports.devServer = ( { host, port } = {} ) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.lintJavaScript = ( { include, exclude, options } ) => ({
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
});

exports.loadCSS = ( { include, exclude } = {}, useModules = false ) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,
        use: ['style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: useModules,
            },
          },
          'sass-loader'],
      },
    ],
  },
});
// LOAD CSS - DEV

exports.loadNodeModuleCSS = ( { include, exclude } = {} ) => ({
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
});

exports.extractCSS = ( { include, exclude, use } ) => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
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

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
    ]),
  },
});

exports.purifyCSS = ( { paths } ) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

exports.lintCSS = ( { include, exclude } ) => ({
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
            require('stylelint')(),
          ]),
        },
      },
    ],
  },
});

exports.loadImages = ( { include, exclude, options } = {} ) => ({
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
});

exports.loadFonts = ( { include, exclude, options } = {} ) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});

exports.loadJavaScript = ( { include, exclude } ) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
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
});

exports.generateSourceMaps = ( { type } ) => ({
  devtool: type,
});

exports.extractBundles = ( bundles ) => ({
  plugins: bundles.map(( bundle ) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.clean = ( path ) => ({
  plugins: [
    new CleanWebpackPlugin([path]),
  ],
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.minifyJavaScript = () => ({
  plugins: [
    new BabelWebpackPlugin(),
  ],
});

exports.minifyCSS = ( { options } ) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.setFreeVariable = ( key, value ) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.page = function ( {
                            path = '',
                            template = require.resolve(
                              'html-webpack-plugin/default_index.ejs',
                            ),
                            title,
                            entry,
                            chunks,
                          } = {} ) {
  return {
    entry,
    plugins: [
      new HtmlWebpackPlugin({
        chunks,
        mobile: true,
        googleAnalytics: {
          trackingId: 'UA-4026428-1',
          pageViewOnLoad: true,
        },
        filename: `${path && path + '/'}index.html`,
        template,
        title,
      }),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'TweenMax',
            entry: 'https://s0.2mdn.net/ads/studio/cached_libs/tweenmax_1.20.0_d360d9a082ccc13b1a1a9b153f86b378_min.js',
            global: 'TweenMax',
          },
          {
            module: 'Ease',
            entry: 'https://s0.2mdn.net/ads/studio/cached_libs/easepack_1.20.0_f9d13d59407792e37168747225359927_min.js',
            global: 'Ease',
          },
          {
            module: 'TimelineLite',
            entry: 'https://s0.2mdn.net/ads/studio/cached_libs/timelinelite_1.20.0_69767b5d8acb5acac5f8545f23c35618_min.js',
            global: 'TimelineLite',
          },
          {
            module: 'tachyons',
            entry: 'https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.9.0/tachyons.min.css',
            global: 'tachyons',
          },
          {
            module: 'font-awesome',
            entry: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
            global: 'font-awesome',
          },
        ],
      }),
    ],
  };
};

