const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// TYPESCRIPT

exports.lintTypeScript = ( { include, exclude, options } ) => ({
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include,
          exclude,
          enforce: 'pre',
          loader: 'tslint-loader',
          options,
        },
      ],
    },
  }
);

exports.loadTypeScript = ( { include, exclude } ) => ({
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)?$/,
          include,
          exclude,
          loader: 'awesome-typescript-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
    },
  }
);


exports.loadCssTypescript = ( { include, exclude } = {} ) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,
        use: ['style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
            },
          },
          'sass-loader'],
      },
    ],
  },
});

//typings-for-css-modules-loader

// DEV-SERVER
exports.devServer = ( { host, port } = {} ) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

// LINT JS
exports.lintJavaScript = ( { include, exclude, options } ) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',

        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
    ],
  },
});

// LOAD CSS - DEV

exports.loadFontAwesome = ( { include, exclude } = {} ) => ({
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

// EXTRACT CSS - PROD
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

// AUTO PREFIX
exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer'),
    ]),
  },
});

// PURIFY CSS
exports.purifyCSS = ( { paths } ) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

// LINT CSS
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
            require('stylelint')({
              ignoreFiles: 'node_modules/**/*.css',
            }),
          ]),
        },
      },
    ],
  },
});

// LOAD IMAGES
exports.loadImages = ( { include, exclude, options } = {} ) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
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

// LOAD FONTS
exports.loadFonts = ( { include, exclude, options } = {} ) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,

        use: {
          loader: 'url-loader?limit=20&name=assets/[name].[hash].[ext]',
          options,
        },
      },
    ],
  },
});

// LOAD JAVASCRIPT
exports.loadJavaScript = ( { include, exclude } ) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,

        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});

// SOURCEMAPS
exports.generateSourceMaps = ( { type } ) => ({
  devtool: type,
});

// EXTRACT BUNDLES
exports.extractBundles = ( bundles ) => ({
  plugins: bundles.map(( bundle ) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

// CLEAN
exports.clean = ( path ) => {
  plugins: [
    new CleanWebpackPlugin([path]),
  ];
};

// MINIFY JS
exports.minifyJavaScript = () => ({
  plugins: [
    new BabelMinifyWebpackPlugin(),
  ],
});

// MINIFY CSS
exports.minifyCSS = ( { options } ) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

// SET FREE VARIABLE
exports.setFreeVariable = ( key, value ) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

// PAGE

exports.page = function ( {
                            path = '',
                            template = require.resolve(
                              'html-webpack-plugin/default_index.ejs',
                            ),
                            title,
                            entry,
                            chunks,
                            externals = [],
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
        externals: externals,
      }),
    ],
  };
};
