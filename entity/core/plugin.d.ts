import { BaseEntity } from '../base';
/**
 * 插件
 */
export declare class CorePlugin extends BaseEntity {
    name: string;
    author: string;
    contact: string;
    description: string;
    version: string;
    enable: number;
    status: number;
    namespace: string;
    view: string;
    providerId: string;
    replaceProvider: string;
}
