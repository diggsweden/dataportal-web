import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export interface Manifest {
  [originalFilename: string]: string;
}

export const getBundles = async (manifestPath: string): Promise<string[]> => {
  const manifest = await readFile(manifestPath, 'utf-8');

  const parsed = JSON.parse(manifest) as Manifest;

  return [parsed['vendor.js'], parsed['app.js'],parsed['vendor-legacy.js'], parsed['app-legacy.js']];
};

export const getStyleBundles = async (manifestPath: string): Promise<string[]> => {
  const manifest = await readFile(manifestPath, 'utf-8');

  const parsed = JSON.parse(manifest) as Manifest;

  return [parsed['app.css']];
};
