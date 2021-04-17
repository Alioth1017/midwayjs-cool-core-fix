import { RESCODE, RESMESSAGE } from '../constants/global';
/**
 * 控制器基类
 */
export declare abstract class BaseController {
    /**
     * 成功返回
     * @param data 返回数据
     */
    ok(data?: any): {
        code: RESCODE;
        message: RESMESSAGE;
    };
    /**
     * 失败返回
     * @param message
     */
    fail(message?: string, code?: RESCODE): {
        code: RESCODE;
        message: string;
    };
}
