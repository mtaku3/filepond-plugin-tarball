import FilepondTarball from '../src/tarball';
import {Item, ItemType} from '../src/types';
import {generateTar} from '../src/utils';

const getItems = (count = 1, path = null): ItemType[] => {
  const keys = new Array(count).map((v, i) => i);
  return [...keys].map((value, index) => {
    const item = new Item([`${index}`], `${index}.jpg`, {type: 'text/plain'});
    if (path) {
      item._relativePath = `/${path}/${item.name}`;
    }

    return item;
  });
};

describe('Plugin', () => {
  test('should replace folders with tar', async () => {
    const filters = [];
    const addFilter = (key, callback) => {
      filters.push(callback);
    };

    const options = FilepondTarball()({addFilter});
    // Execute
    const files = await filters[0]([
      ...getItems(2),
      ...getItems(30, 'pictures/event'),
      ...getItems(60, 'documents'),
      ...getItems(),
    ]);

    expect(options).toStrictEqual({options: {}});
    expect(files).toHaveLength(5);
  });

  test('should allow filtering archived files', async () => {
    const filters = [];
    const addFilter = (key, callback) => {
      filters.push(callback);
    };
    const pictures = getItems(30, 'pictures/event');
    const documents = getItems(60, 'documents');

    generateTar([...pictures, ...documents]);
    const callback = jest.fn();

    const options = FilepondTarball(callback)({addFilter});
    // Execute
    const files = await filters[0]([...getItems(2), ...pictures, ...documents, ...getItems()]);

    expect(options).toStrictEqual({options: {}});
    expect(files).toHaveLength(3);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
