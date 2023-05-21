import {Filter, PluginOptions, TarballCallback} from './types';
import {generateTar} from './utils';

const FilepondTarball =
  (callback?: TarballCallback) =>
  ({addFilter}: PluginOptions): Filter => {
    addFilter('ADD_ITEMS', async (items) => {
      const generators = generateTar(items);
      const plainFiles = items.filter((item) => !item._relativePath);

      if (callback) {
        callback(generators);

        return plainFiles;
      }

      const tarFiles = await Promise.all(generators.map((generate) => generate()));

      return plainFiles.concat(tarFiles);
    });

    return {options: {}};
  };

export default FilepondTarball;
