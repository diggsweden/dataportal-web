import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack, { Configuration } from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import webpackMerge from 'webpack-merge';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import TerserJSPlugin from 'terser-webpack-plugin';

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const workingDir = path.join(__dirname, '../');
const numberOfThreads = require('os').cpus().length - 1;
const tsConfigPath = path.join(workingDir, 'tsconfig.json');

delete process.env.TS_NODE_PROJECT;

export interface ExtraOptions {
  babelTarget?: {
    browsers?: string[];
    node?: string;
  };
  babelPlugins?: string[];
  seed?: object;
}

const defaultOptions: ExtraOptions = {
  babelTarget: { browsers: ['>0.25%', 'ie 11', 'not op_mini all'] },
  babelPlugins: [],
  seed: {},
};

export const createWebpackConfig = (
  config: Configuration = {},
  extraOptions?: ExtraOptions
): Configuration => {
  const options = { ...defaultOptions, ...extraOptions };
  const parallelLoaders = isProd
    ? [        
        { loader: 'thread-loader', options: { workers: numberOfThreads } },
      ]
    : [];

  const emotionConfig = {
    autoLabel: true,
    sourceMap: !isProd,
  };

  const babelConfig = isProd
    ? {
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: options.babelTarget,
              modules: false,
              corejs: '2',
              useBuiltIns: 'entry',
              debug: false,
            },
          ],
        ],
        plugins: [
          ['emotion', emotionConfig],
          '@babel/plugin-syntax-object-rest-spread',
          '@babel/plugin-syntax-dynamic-import',
          ...options.babelPlugins,
        ],
      }
    : {
        babelrc: false,
        plugins: [
          'react-hot-loader/babel',
          ['emotion', emotionConfig],
          '@babel/plugin-syntax-object-rest-spread',
          '@babel/plugin-syntax-dynamic-import',
          ...options.babelPlugins,
        ],
      };

  const productionPlugins = isProd
    ? [                  
        new webpack.NoEmitOnErrorsPlugin(),        
        new webpack.optimize.OccurrenceOrderPlugin(false),
        new (webpack.optimize as any).SideEffectsFlagPlugin(),              
      ]
    : [];

  const defaultConfig = {
    context: workingDir,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    entry: {},
    mode: isProd ? 'none' : 'development',
    output: {
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      path: path.join(workingDir, 'dist/client/js/'),
      publicPath: isProd ? '/dist/client/js/' : '/',
    },
    module: {
      rules: [
        ...(isProd
          ? [
              {
                test: /\.jsx?$/,
                use: [                  
                  { loader: 'babel-loader', options: babelConfig },
                ],
              },
              {
                test: [/.css$|.scss$/],                    
                use: [
                  { 
                  loader: MiniCssExtractPlugin.loader,
                  options: {                      
                            hmr: true,
                          },
                  },"css-loader", "sass-loader" ] 
              },
            ]
          : [{
            test: [/.css$|.scss$/],                             
            use:["style-loader","css-loader","sass-loader"]
          }]),
        {
          test: /\.tsx?$/,
          use: [            
            { loader: 'babel-loader', options: babelConfig },
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
              },
            },
          ],
        },        
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
              context: 'src',
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],      
      alias: {
        react: path.resolve(path.join(workingDir, './node_modules/react')),
        'react-dom': path.resolve(
          path.join(workingDir, './node_modules/react-dom')
        ),
        emotion: path.resolve(path.join(workingDir, './node_modules/emotion')),
        '@emotion/core': path.resolve(path.join(workingDir, './node_modules/@emotion/core')),
        'react-emotion': path.resolve(
          path.join(workingDir, './node_modules/react-emotion')
        ),
        'emotion-theming': path.resolve(
          path.join(workingDir, './node_modules/emotion-theming')
        )     
      },
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsConfigPath,
          baseUrl: 'src',
        }),
      ],
    },
    plugins: [           
      new MiniCssExtractPlugin({        
        filename: isProd ? 'app.[contenthash].css' : 'app.css',
        chunkFilename: 'app'        
      }),
      new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
      new ManifestPlugin({ fileName: 'assets.json', seed: options.seed }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      ...productionPlugins,
    ],
    serve: {
      content: path.join(workingDir, 'public'),
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
    optimization: {      
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: isProd ? { chunks: 'all', name: 'vendor' } : {},
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // runtimeChunk: isProd ? 'single' : false,
      minimize: isProd,
      minimizer: [new TerserJSPlugin({}),new OptimizeCSSAssetsPlugin({})]
    },
    stats: {
      errors: true,
      errorDetails: true,
      assets: true,
      colors: true,
      chunks: false,
      chunkModules: false,
      entrypoints: false,
      modules: false,
      version: false,
      builtAt: false,
      warningsFilter: /^(?!CriticalDependenciesWarning$)/
    },
  };

  return webpackMerge.smart(defaultConfig, config);
};
