"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolValidateException = void 0;
const global_1 = require("../constants/global");
const base_1 = require("./base");
/**
 * 校验异常
 */
class CoolValidateException extends base_1.BaseException {
    constructor(message) {
        super('CoolValidateException', global_1.RESCODE.VALIDATEFAIL, message ? message : global_1.RESMESSAGE.VALIDATEFAIL);
    }
}
exports.CoolValidateException = CoolValidateException;
//# sourceMappingURL=validate.js.map