import { ICoolPlugin } from "../plugin";
export declare const COOL_CACHE_KEY = "coolCache";
export interface ICoolCache extends ICoolPlugin {
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
     * 获得缓存模式
     */
    getMode(): string;
    /**
     * 获得原始缓存对象
     */
    getMetaCache(): any;
}
