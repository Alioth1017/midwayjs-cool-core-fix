"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const global_1 = require("../constants/global");
/**
 * 控制器基类
 */
let BaseController = class BaseController {
    /**
     * 成功返回
     * @param data 返回数据
     */
    ok(data) {
        const res = {
            code: global_1.RESCODE.SUCCESS,
            message: global_1.RESMESSAGE.SUCCESS,
        };
        if (data) {
            res['data'] = data;
        }
        return res;
    }
    /**
     * 失败返回
     * @param message
     */
    fail(message, code) {
        return {
            code: code ? code : global_1.RESCODE.COMMFAIL,
            message: message ? message : (code == global_1.RESCODE.VALIDATEFAIL ? global_1.RESMESSAGE.VALIDATEFAIL : global_1.RESMESSAGE.COMMFAIL)
        };
    }
};
BaseController = __decorate([
    decorator_1.Provide()
], BaseController);
exports.BaseController = BaseController;
//# sourceMappingURL=base.js.map