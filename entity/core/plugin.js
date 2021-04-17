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
exports.CorePlugin = void 0;
const orm_1 = require("@midwayjs/orm");
const typeorm_1 = require("typeorm");
const base_1 = require("../base");
/**
 * 插件
 */
let CorePlugin = class CorePlugin extends base_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ comment: '名称' }),
    typeorm_1.Index({ unique: true }),
    __metadata("design:type", String)
], CorePlugin.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ comment: '作者' }),
    __metadata("design:type", String)
], CorePlugin.prototype, "author", void 0);
__decorate([
    typeorm_1.Column({ comment: '联系方式' }),
    __metadata("design:type", String)
], CorePlugin.prototype, "contact", void 0);
__decorate([
    typeorm_1.Column({ comment: '功能描述', type: 'text' }),
    __metadata("design:type", String)
], CorePlugin.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ comment: '版本号' }),
    __metadata("design:type", String)
], CorePlugin.prototype, "version", void 0);
__decorate([
    typeorm_1.Column({ comment: '是否启用 0：否 1：是', default: 1, type: 'tinyint' }),
    __metadata("design:type", Number)
], CorePlugin.prototype, "enable", void 0);
__decorate([
    typeorm_1.Column({ comment: '状态 0:缺少配置 1:可用 2: 配置错误 3:未知错误', default: 0, type: 'tinyint' }),
    __metadata("design:type", Number)
], CorePlugin.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ comment: '命名空间' }),
    __metadata("design:type", String)
], CorePlugin.prototype, "namespace", void 0);
__decorate([
    typeorm_1.Column({ comment: "页面信息", type: 'text', nullable: true }),
    __metadata("design:type", String)
], CorePlugin.prototype, "view", void 0);
__decorate([
    typeorm_1.Column({ comment: "实例ID", nullable: true }),
    __metadata("design:type", String)
], CorePlugin.prototype, "providerId", void 0);
__decorate([
    typeorm_1.Column({ comment: "替换的实例", nullable: true }),
    __metadata("design:type", String)
], CorePlugin.prototype, "replaceProvider", void 0);
CorePlugin = __decorate([
    orm_1.EntityModel('core_plugin')
], CorePlugin);
exports.CorePlugin = CorePlugin;
//# sourceMappingURL=plugin.js.map