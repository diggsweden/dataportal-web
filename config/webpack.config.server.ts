import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from './createWebpackConfig';

const workingDir = path.join(__dirname, '../');

const config = createWebpackConfig(
  {
    entry: './server/',
    output: {
      libraryTarget: 'commonjs',
      path: path.join(workingDir, 'dist/server'),
      filename: 'server.js',
    },
    plugins: [      
      new webpack.DefinePlugin({
        'process.env.CLIENT': JSON.stringify(false),
      }),
      new webpack.ProvidePlugin({
        URL: ['url', 'URL'],
      }),
    ],
    optimization: {
      splitChunks: false,
      minimize: false,
    },
    performance: {
      hints: false,
    },
    target: 'node',
  },
  {
    babelTarget: {
      node: '8.9.4',
    },
  }
);

export default config;
