import JSZip from 'jszip';
import {Item, ItemType} from './types';

export const getDirectoryGroups = (items: ItemType[]): Record<string, ItemType[]> => {
  const directories = {};

  items
    .filter((item) => item._relativePath)
    .forEach((item) => {
      const [, group] = item._relativePath.split('/');

      if (!directories[group]) {
        directories[group] = [];
      }

      directories[group].push(item);
    });

  return directories;
};

export const generateZip = (items: ItemType[]): Promise<ItemType>[] => {
  const directories = getDirectoryGroups(items);

  return Object.keys(directories).map(async (name) => {
    const zip = new JSZip();

    directories[name].forEach((file) => {
      zip.file(file._relativePath, file);
    });

    delete directories[name];

    const file = await zip.generateAsync({type: 'blob'});

    return new Item([file], `${name}.zip`);
  });
};
