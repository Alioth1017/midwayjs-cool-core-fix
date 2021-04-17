import { CorePlugin } from "../../entity/core/plugin";
import { Repository } from 'typeorm';
import { ILogger } from '@midwayjs/logger';
import { IMidwayApplication } from "@midwayjs/core";
import { CoreConfig } from "../../entity/core/conf";
import { NodeCacheHandler } from "../cache/node";
import { CoolConfig } from "../..";
export interface ICoolPlugin {
    /**
     * 实例ID
     */
    init(): Promise<PLUGINSTATUS>;
    /**
     * 检查状态
     */
    checkStatus(): Promise<PLUGINSTATUS>;
}
/**
 * 插件状态
 */
export declare enum PLUGINSTATUS {
    NOCONF = 0,
    USABLE = 1,
    CONFERR = 2,
    UNKNOWNERR = 3
}
/**
 * 插件管理
 */
export declare class CoolPlugin {
    corePlugin: Repository<CorePlugin>;
    coreConfig: Repository<CoreConfig>;
    coreLogger: ILogger;
    app: IMidwayApplication;
    nodeCacheHandler: NodeCacheHandler;
    coolConfig: CoolConfig;
    /**
     * 安装插件
     * @param cls 插件类
     * @param callBack 安装回调
     * @param replaceProvider 替换的Provider
     */
    install(cls: any, callBack: any, replaceProvider?: string): Promise<void>;
    /**
     * 重新加载插件
     * @param 实例ID
     */
    reloadPlugin(providerId: string): Promise<void>;
    /**
     * 注册实例
     * @param providerId
     * @param obj
     */
    registerObject(providerId: string, obj: any): Promise<void>;
    /**
     * 插件列表
     */
    list(keyWord?: string): Promise<CorePlugin[]>;
    /**
     * 所有可用插件
     * @returns
     */
    plugins(find?: any): Promise<any>;
    /**
     * 清除插件缓存
     */
    clearPluginCache(): Promise<void>;
    /**
     * 配置
     * @param name
     * @param config
     */
    setConfig(name: string, config: any): Promise<void>;
    /**
     * 获得插件的所有配置
     * @param namespace
     */
    getConfig(namespace: string): Promise<any>;
    /**
     * 刷新插件 如果插件不存在就移除它
     */
    refresh(): Promise<CorePlugin[]>;
    /**
     * 是否启用插件 0：否 1：是
     * @param namespace
     * @param enable
     */
    enable(namespace: string, enable: number): Promise<void>;
    /**
     * 改变插件状态
     * @param name 插件名称
     * @param status 状态
     */
    changeStatus(name: string, status: PLUGINSTATUS): Promise<void>;
}
