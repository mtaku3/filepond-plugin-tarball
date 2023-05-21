import { GeneratorCallback, ItemType } from './types';
export declare const getDirectoryGroups: (items: ItemType[]) => Record<string, ItemType[]>;
export declare const generateTar: (items: ItemType[]) => GeneratorCallback[];
