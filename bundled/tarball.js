(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FilePondPluginTarball = factory());
})(this, (function () {
  const headers = {
    name: 100,
    mode: 8,
    uid: 8,
    gid: 8,
    size: 12,
    mtime: 12,
    chksum: 8,
    typeflag: 1,
    linkname: 100,
    magic: 5,
    version: 2,
    uname: 32,
    gname: 32,
    devmajor: 8,
    devminor: 8,
    prefix: 155,
    padding: 12
  };
  const offsets = {};
  Object.keys(headers).reduce((acc, k) => {
    offsets[k] = acc;
    return acc + headers[k];
  }, 0);
  const defaults = f => ({
    name: f.name,
    mode: '777',
    uid: 0,
    gid: 0,
    size: f.content.byteLength,
    mtime: Math.floor(Number(new Date()) / 1000),
    chksum: '        ',
    typeflag: '0',
    magic: 'ustar',
    version: '  ',
    uname: '',
    gname: ''
  });
  const nopad = ['name', 'linkname', 'magic', 'chksum', 'typeflag', 'version', 'uname', 'gname'],
    bsize = 512;
  function tarts(files) {
    let buffer = new Uint8Array(0);
    for (let f of files) {
      if (typeof f.content === 'string') f.content = stringToUint8(f.content);
      f = Object.assign(defaults(f), f);
      const b = new Uint8Array(Math.ceil((bsize + f.size) / bsize) * bsize);
      const checksum = Object.keys(headers).reduce((acc, k) => {
        if (!(k in f)) return acc;
        const value = stringToUint8(nopad.indexOf(k) > -1 ? f[k] : pad(f[k], headers[k] - 1));
        b.set(value, offsets[k]);
        return acc + value.reduce((a, b) => a + b, 0);
      }, 0);
      b.set(stringToUint8(pad(checksum, 7)), offsets.chksum);
      b.set(f.content, bsize);
      const sum = new Uint8Array(buffer.byteLength + b.byteLength);
      sum.set(buffer, 0);
      sum.set(b, buffer.byteLength);
      buffer = sum;
    }
    const sum = new Uint8Array(buffer.byteLength + bsize * 2);
    sum.set(buffer, 0);
    return sum;
  }
  function pad(s, n) {
    s = s.toString(8);
    return ('000000000000' + s).slice(s.length + 12 - n);
  }
  function stringToUint8(s) {
    const a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }

  class Item extends File {
    constructor(...args) {
      super(...args);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this._relativePath = void 0;
    }
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  const directories = {};
  const getDirectoryGroups = items => {
    items.filter(item => item._relativePath).forEach(item => {
      const [, group] = item._relativePath.split('/');
      if (!directories[group]) {
        directories[group] = [];
      }
      directories[group].push(item);
    });
    return directories;
  };
  const generateTar = items => {
    getDirectoryGroups(items);
    return Object.keys(directories).map(name => {
      const entries = [];
      directories[name].forEach(file => {
        entries.push(new Promise(resolve => {
          const reader = new FileReader();
          reader.addEventListener('load', event => {
            resolve({
              // Delete first character of string because it starts with '/'
              name: file._relativePath.slice(1),
              content: new Uint8Array(event.target.result)
            });
          });
          reader.readAsArrayBuffer(file);
        }));
      });
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete directories[name];
      return function () {
        try {
          return Promise.resolve(Promise.all(entries)).then(function (_Promise$all) {
            const tar = tarts(_Promise$all);
            const file = new Blob([tar], {
              type: 'application/x-tar'
            });
            return new Item([file], `${name}.tar`);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };
    });
  };

  const FilePondPluginTarball = callback => ({
    addFilter
  }) => {
    addFilter('ADD_ITEMS', function (items) {
      try {
        const generators = generateTar(items);
        const plainFiles = items.filter(item => !item._relativePath);
        if (callback) {
          callback(generators);
          return Promise.resolve(plainFiles);
        }
        return Promise.resolve(Promise.all(generators.map(generate => generate()))).then(function (tarFiles) {
          return plainFiles.concat(tarFiles);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return {
      options: {}
    };
  };

  return FilePondPluginTarball;

}));
