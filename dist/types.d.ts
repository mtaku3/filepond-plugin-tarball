interface TargetFilter {
    ADD_ITEMS: string;
}
export type FilterKey = keyof TargetFilter;
export interface ItemType extends File {
    _relativePath?: string;
}
type FilterCallback = (items: ItemType[]) => Promise<ItemType[]>;
type AddFilterCallback = (key: FilterKey, callback: FilterCallback) => void;
export interface PluginOptions {
    addFilter: AddFilterCallback;
}
export interface Filter {
    options: unknown;
}
export interface Metadata {
    percent: number;
    currentFile: string;
}
export type OnUpdateCallback = (metadata: Metadata) => void;
export type GeneratorCallback = (onUpdate?: OnUpdateCallback) => Promise<ItemType>;
export type TarballCallback = (generators: GeneratorCallback[]) => unknown;
export declare class Item extends File implements ItemType {
    _relativePath?: string;
}
export {};
