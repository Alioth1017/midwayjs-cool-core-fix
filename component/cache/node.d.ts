import * as FlatCache from 'flat-cache';
import { ICoolCache } from './index';
import { IMidwayApplication } from '@midwayjs/core';
import { PLUGINSTATUS } from '../plugin';
export declare class NodeCacheHandler implements ICoolCache {
    init(): Promise<PLUGINSTATUS>;
    checkStatus(): Promise<PLUGINSTATUS>;
    cache: FlatCache;
    app: IMidwayApplication;
    load(): void;
    /**
     * 缓存模式
     */
    getMode(): string;
    /**
     * 防止保存的时候出错
     * @param key
     */
    private handlerKey;
    private static instance;
    static getInstance(): NodeCacheHandler;
    /**
     * 设置缓存
     * @param key 键
     * @param val 值
     * @param ttl 过期时间(单位：秒)
     */
    set(key: string, val: any, ttl?: number): Promise<void>;
    /**
     * 获得缓存
     * @param key 键
     */
    get(key: string): Promise<any>;
    /**
     * 删除键
     * @param key 键
     */
    del(key: string): Promise<void>;
    /**
     * 获得所有的key
     * @param pattern redis模式下有效
     */
    keys(pattern?: string): Promise<any>;
    /**
     * 获得原始缓存对象
     */
    getMetaCache(): any;
}
