// eslint-disable-next-line import/no-extraneous-dependencies
import Tar from './tarts';
import {GeneratorCallback, Item, ItemType} from './types';

const directories = {};

export const getDirectoryGroups = (items: ItemType[]): Record<string, ItemType[]> => {
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

export const generateTar = (items: ItemType[]): GeneratorCallback[] => {
  getDirectoryGroups(items);

  return Object.keys(directories).map((name) => {
    const entries = [];

    directories[name].forEach((file) => {
      entries.push(
        new Promise((resolve) => {
          const reader = new FileReader();

          reader.addEventListener('load', (event) => {
            resolve({
              // Delete first character of string because it starts with '/'
              name: file._relativePath.slice(1),
              content: new Uint8Array(event.target.result as ArrayBuffer),
            });
          });
          reader.readAsArrayBuffer(file);
        })
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete directories[name];

    return async (): Promise<ItemType> => {
      const tar = Tar(await Promise.all(entries));
      const file = new Blob([tar], {type: 'application/x-tar'});

      return new Item([file], `${name}.tar`);
    };
  });
};
