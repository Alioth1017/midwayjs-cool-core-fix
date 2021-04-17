"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolCoreException = void 0;
const global_1 = require("../constants/global");
const base_1 = require("./base");
/**
 * 核心异常
 */
class CoolCoreException extends base_1.BaseException {
    constructor(message) {
        super('CoolCoreException', global_1.RESCODE.COREFAIL, message ? message : global_1.RESMESSAGE.COREFAIL);
    }
}
exports.CoolCoreException = CoolCoreException;
//# sourceMappingURL=core.js.map