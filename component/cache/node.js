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
var NodeCacheHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCacheHandler = void 0;
const FlatCache = require("flat-cache");
const moment = require("moment");
const decorator_1 = require("@midwayjs/decorator");
const os = require("os");
const path = require("path");
const fs = require("fs");
let NodeCacheHandler = NodeCacheHandler_1 = class NodeCacheHandler {
    init() {
        throw new Error('Method not implemented.');
    }
    checkStatus() {
        throw new Error('Method not implemented.');
    }
    load() {
        try {
            this.cache = FlatCache.load('.cache', os.tmpdir());
            this.cache.save();
        }
        catch (error) {
            const tempPath = path.join(this.app.getBaseDir(), '..', '/cool');
            if (!fs.existsSync(tempPath)) {
                fs.mkdirSync(tempPath);
            }
            this.cache = FlatCache.load('.cache', tempPath);
        }
    }
    /**
     * 缓存模式
     */
    getMode() {
        return 'local';
    }
    /**
     * 防止保存的时候出错
     * @param key
     */
    handlerKey(key) {
        return key = key['replaceAll'](':', '-');
    }
    // 单例
    static getInstance() {
        this.instance = this.instance || new NodeCacheHandler_1();
        return this.instance;
    }
    ;
    /**
     * 设置缓存
     * @param key 键
     * @param val 值
     * @param ttl 过期时间(单位：秒)
     */
    async set(key, val, ttl = 0) {
        key = this.handlerKey(key);
        this.cache.setKey(key, { data: val, expire: ttl == 0 ? 0 : moment().valueOf() + ttl * 1000 });
        this.cache.save(true);
    }
    /**
     * 获得缓存
     * @param key 键
     */
    async get(key) {
        key = this.handlerKey(key);
        const nowTime = moment().valueOf();
        const info = this.cache.getKey(key);
        if (!info) {
            return null;
        }
        if (info.expire != 0 && info.expire < nowTime) {
            this.del(key);
            return null;
        }
        return info.data;
    }
    /**
     * 删除键
     * @param key 键
     */
    async del(key) {
        key = this.handlerKey(key);
        this.cache.removeKey(key);
        this.cache.save(true);
    }
    /**
     * 获得所有的key
     * @param pattern redis模式下有效
     */
    keys(pattern) {
        return this.cache.all();
    }
    /**
     * 获得原始缓存对象
     */
    getMetaCache() {
        return this.cache;
    }
};
NodeCacheHandler.instance = null;
__decorate([
    decorator_1.App(),
    __metadata("design:type", Object)
], NodeCacheHandler.prototype, "app", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NodeCacheHandler.prototype, "load", null);
NodeCacheHandler = NodeCacheHandler_1 = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], NodeCacheHandler);
exports.NodeCacheHandler = NodeCacheHandler;
//# sourceMappingURL=node.js.map