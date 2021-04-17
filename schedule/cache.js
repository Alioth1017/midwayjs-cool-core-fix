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
exports.CacheClear = void 0;
const decorator_1 = require("@midwayjs/decorator");
/**
 * 定时清除已经过期的缓存
 */
let CacheClear = class CacheClear {
    async exec() {
        if (this.coolCache.getMode() == 'local') {
            const keys = await this.coolCache.keys();
            if (keys) {
                Object.keys(keys).forEach(key => {
                    this.coolCache.get(key);
                });
            }
        }
    }
};
__decorate([
    decorator_1.Inject('cache'),
    __metadata("design:type", Object)
], CacheClear.prototype, "coolCache", void 0);
CacheClear = __decorate([
    decorator_1.Provide(),
    decorator_1.Schedule({
        type: 'worker',
        cron: '0 0 0 * * *',
    })
], CacheClear);
exports.CacheClear = CacheClear;
//# sourceMappingURL=cache.js.map