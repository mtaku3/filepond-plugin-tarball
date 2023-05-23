import Tar from './tarts';

const directories = {};

export const getDirectoryGroups = (items) => {
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

const getFilenameWithoutExtension = name => name.substring(0, name.lastIndexOf('.')) || name;

export const generateTar = (items, splitInDirectoryGroups, archivePlainFiles) => {
  if (splitInDirectoryGroups) {
    getDirectoryGroups(items);

    if (archivePlainFiles) {
      const plainFiles = items.filter((item) => !item._relativePath);
      if (0 < plainFiles.length) {
        const first = plainFiles[0];
        const fileNameWithoutExtension = getFilenameWithoutExtension(first.name);
        directories[fileNameWithoutExtension] = plainFiles;
      }
    }
  } else {
    const notPlainFiles = items.filter((item) => item._relativePath);
    const plainFiles = items.filter((item) => !item._relativePath);
  
    if (0 < notPlainFiles.length) {
      const first = notPlainFiles[0];
      const [, rootDirectoryName] = first._relativePath.split('/');
      directories[rootDirectoryName] = items;
    } else {
      const first = plainFiles[0];
      const fileNameWithoutExtension = getFilenameWithoutExtension(first.name);
      directories[fileNameWithoutExtension] = items;
    }
  }

  return Object.keys(directories).map((name) => {
    const entries = [];

    directories[name].forEach((file) => {
      entries.push(
        new Promise((resolve) => {
          const reader = new FileReader();

          reader.addEventListener('load', (event) => {
            resolve({
              // Delete first character of string because it starts with '/'
              name: file._relativePath ? file._relativePath.slice(1) : file.name,
              content: new Uint8Array(event.target.result),
            });
          });
          reader.readAsArrayBuffer(file);
        })
      );
    });

    delete directories[name];

    return async () => {
      const tar = Tar(await Promise.all(entries));
      const file = new Blob([tar], {type: 'application/x-tar'});

      return new File([file], `${name}.tar`);
    };
  });
};
