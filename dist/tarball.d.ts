import { Filter, PluginOptions, TarballCallback } from './types';
declare const FilepondTarball: (callback?: TarballCallback) => ({ addFilter }: PluginOptions) => Filter;
export default FilepondTarball;
