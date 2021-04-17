"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolCommException = void 0;
const global_1 = require("../constants/global");
const base_1 = require("./base");
/**
 * 通用异常
 */
class CoolCommException extends base_1.BaseException {
    constructor(message) {
        super('CoolCommException', global_1.RESCODE.COMMFAIL, message ? message : global_1.RESMESSAGE.COMMFAIL);
    }
}
exports.CoolCommException = CoolCommException;
//# sourceMappingURL=comm.js.map