import { CommonSchedule } from '@midwayjs/decorator';
import { ICoolCache } from '../component/cache';
/**
 * 定时清除已经过期的缓存
 */
export declare class CacheClear implements CommonSchedule {
    coolCache: ICoolCache;
    exec(): Promise<void>;
}
