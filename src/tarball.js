import {generateTar} from './utils';

const FilePondPluginTarball =
  (archiveMultipleDirectoriesIntoOne = false, archivePlainFiles = false, callback) =>
  ({ addFilter }) => {
    addFilter('ADD_ITEMS', async (items) => {
      const generators = generateTar(items, !archiveMultipleDirectoriesIntoOne, archivePlainFiles);

      let plainFiles = [];
      if (!archivePlainFiles) {
        plainFiles = items.filter((item) => !item._relativePath);
      }

      if (callback) {
        callback(generators);

        return plainFiles;
      }

      const tarFiles = await Promise.all(generators.map((generate) => generate()));

      return plainFiles.concat(tarFiles);
    });

    return {
      options: {
      },
    };
  };

export default FilePondPluginTarball;
