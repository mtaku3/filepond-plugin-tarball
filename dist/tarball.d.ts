import { Filter, PluginOptions, TarballCallback } from './types';
declare const FilePondPluginTarball: (callback?: TarballCallback) => ({ addFilter }: PluginOptions) => Filter;
export default FilePondPluginTarball;
