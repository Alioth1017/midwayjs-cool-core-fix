import { Context } from "egg";
import { ICoolFile, Mode, MODETYPE } from ".";
import { CoolConfig } from "../../interface";
import { ILogger } from '@midwayjs/logger';
import { PLUGINSTATUS } from "../plugin";
export declare class LocalFileHandler implements ICoolFile {
    init(): Promise<PLUGINSTATUS>;
    checkStatus(): Promise<PLUGINSTATUS>;
    coolConfig: CoolConfig;
    coreLogger: ILogger;
    /**
     * 上传模式
     */
    getMode(): Mode;
    /**
     * 原始操作对象
     */
    getMetaFileObj(): {
        mode: MODETYPE;
        type: string;
    };
    /**
     * 上传文件
     * @param ctx
     */
    upload(ctx: Context): Promise<string>;
}
