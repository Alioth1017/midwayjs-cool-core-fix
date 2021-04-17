"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileHandler = void 0;
const _1 = require(".");
const comm_1 = require("../../exceptions/comm");
const moment = require("moment");
const uuid_1 = require("uuid");
const path = require("path");
const fs = require("fs");
const decorator_1 = require("@midwayjs/decorator");
const _ = require("lodash");
const decorator_2 = require("@midwayjs/decorator");
let LocalFileHandler = class LocalFileHandler {
    init() {
        throw new Error("Method not implemented.");
    }
    checkStatus() {
        throw new Error("Method not implemented.");
    }
    /**
     * 上传模式
     */
    getMode() {
        return {
            mode: _1.MODETYPE.LOCAL,
            type: 'local'
        };
    }
    /**
     * 原始操作对象
     */
    getMetaFileObj() {
        return {
            mode: _1.MODETYPE.LOCAL,
            type: 'local'
        };
    }
    /**
     * 上传文件
     * @param ctx
     */
    async upload(ctx) {
        try {
            if (_.isEmpty(ctx.request.files)) {
                throw new comm_1.CoolCommException('上传文件为空');
            }
            const file = ctx.request.files[0];
            const extend = file.filename.split('.');
            const name = moment().format('YYYYMMDD') + '/' + uuid_1.v1() + '.' + extend[extend.length - 1];
            const target = path.join(ctx.app.baseDir, '..', `public/uploads/${name}`);
            const dirPath = path.join(ctx.app.baseDir, '..', `public/uploads/${moment().format('YYYYMMDD')}`);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            const data = fs.readFileSync(file.filepath);
            fs.writeFileSync(target, data);
            return this.coolConfig.file.domain + '/uploads/' + target.split('uploads')[1];
        }
        catch (err) {
            this.coreLogger.error(err);
            throw new comm_1.CoolCommException('上传失败');
        }
    }
};
__decorate([
    decorator_1.Config('cool'),
    __metadata("design:type", Object)
], LocalFileHandler.prototype, "coolConfig", void 0);
__decorate([
    decorator_2.Logger(),
    __metadata("design:type", Object)
], LocalFileHandler.prototype, "coreLogger", void 0);
LocalFileHandler = __decorate([
    decorator_1.Provide()
], LocalFileHandler);
exports.LocalFileHandler = LocalFileHandler;
//# sourceMappingURL=local.js.map