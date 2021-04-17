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
exports.CoreModule = void 0;
const orm_1 = require("@midwayjs/orm");
const typeorm_1 = require("typeorm");
const base_1 = require("../base");
/**
 * 核心模块 包括组件配置 核心配置等
 */
let CoreModule = class CoreModule extends base_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ comment: '模块名称' }),
    typeorm_1.Index({ unique: true }),
    __metadata("design:type", String)
], CoreModule.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ comment: '是否初始化数据库 0：否 1：是', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], CoreModule.prototype, "dbInit", void 0);
__decorate([
    typeorm_1.Column({ comment: '配置所有', type: 'text', nullable: true }),
    __metadata("design:type", String)
], CoreModule.prototype, "allConfig", void 0);
CoreModule = __decorate([
    orm_1.EntityModel('core_module')
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=module.js.map