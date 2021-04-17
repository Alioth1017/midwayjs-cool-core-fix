import { Context } from "egg";
import { ICoolPlugin } from "../plugin";
export declare const COOL_FILE_KEY = "coolFile";
export interface ICoolFile extends ICoolPlugin {
    /**
     * 上传
     */
    upload(ctx: Context): Promise<any>;
    /**
     * 获得文件模式 如：本地上传local、 签名上传sign
     */
    getMode(): Mode;
    /**
     * 获得原始操作对象
     */
    getMetaFileObj(): any;
}
export declare enum MODETYPE {
    LOCAL = "local",
    CLOUD = "cloud",
    OTHER = "other"
}
/**
 * 上传模式
 */
export interface Mode {
    mode: MODETYPE;
    type: string;
}
