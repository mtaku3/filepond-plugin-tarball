import Tar from 'tarts';
import {GeneratorCallback, Item, ItemType, OnUpdateCallback} from './types';

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
        new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: file._relativePath,
              content: event.target.result
            })
          };
          reader.readAsArrayBuffer(file)
        })
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete directories[name];

    return async (onUpdate?: OnUpdateCallback): Promise<ItemType> => {
      const tar = Tar(await Promise.all(entries));
      const file = new Blob([tar], {"type":"application/x-tar"});

      return new Item([file], `${name}.tar`);
    };
  });
};
