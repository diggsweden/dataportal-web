import webpack from 'webpack';
import { createWebpackConfig } from './createWebpackConfig';

export default createWebpackConfig({
  entry: { app: './src/index.tsx' },
  plugins: [    
    new webpack.DefinePlugin({
      'process.env.CLIENT': JSON.stringify(true),
    })
  ],
});
