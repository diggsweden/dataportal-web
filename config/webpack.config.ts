import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from './createWebpackConfig';

const seed = {};

const plugins = [  
  new webpack.DefinePlugin({
    'process.env.CLIENT': JSON.stringify(true),
  }),
];

export default [
  createWebpackConfig(
    {
      entry: {
        'app-legacy': ['url-polyfill', 'babel-polyfill', './src/index.tsx'],
      },
      output: {
        filename: '[name].js',
      },
      optimization: {
        splitChunks: { chunks: 'all', name: 'vendor-legacy' },
      },
      plugins: [...plugins],
    },
    { seed }
  ),  
  createWebpackConfig(
    {
      entry: ['./src/Components/Search/'],      
      plugins: [
        ...plugins,        
        new CopyWebpackPlugin([
          //REMOVED until MetaSolutions fixes the package, >4.7.5 & <4.7.14 does not work with IE 11
          //{ from: path.join(__dirname, '../node_modules/@entryscape/entrystore-js/dist/entrystore.js'), flatten: true },
          //{ from: path.join(__dirname, '../node_modules/@entryscape/rdfjson/dist/rdfjson.js'), flatten: true },          
          // { from: path.join(__dirname, '../public/entrystore.4.7.5.modified.js'), flatten: true },
          // { from: path.join(__dirname, '../public/rdfjson.4.7.5.modified.js'), flatten: true }        
        ]),
      ],          
    }
  ),
  createWebpackConfig(
    {
      entry: { app: './src/index.tsx' },
      plugins: [
        ...plugins,        
        new CopyWebpackPlugin([                    
          { from: path.join(__dirname, '../public/*.json'), flatten: true },
          { from: path.join(__dirname, '../public/*.png'), flatten: true },
          { from: path.join(__dirname, '../public/*.ico'), flatten: true },
          { from: path.join(__dirname, '../public/*.xml'), flatten: true },
          { from: path.join(__dirname, '../public/*.svg'), flatten: true },          
          { from: path.join(__dirname, '../public/fonts/'), flatten: false, to: path.join(__dirname, '../dist/client/fonts') },          
          { from: path.join(__dirname, '../public/font-awesome.min.css'), flatten: true },          
          { from: path.join(__dirname, '../assets/*.png'), flatten: false },
          { from: path.join(__dirname, '../assets/*.jpg'), flatten: false },
        ]),
      ],
    },
    {
      babelTarget: {
        browsers: [
          'chrome >= 61',
          'firefox >= 48',
          'safari >= 11',
          'edge >= 16',
          'ie >= 11',
        ],
      },
      seed,
    }
  ),
];
