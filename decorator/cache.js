"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const core_1 = require("@midwayjs/core");
const md5 = require("md5");
function Cache(ttl) {
    return (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const key = md5(JSON.stringify(args));
            const coolCache = await this[core_1.REQUEST_OBJ_CTX_KEY].app.getApplicationContext().getAsync('cool:cache');
            let data = await coolCache.get(key);
            if (data) {
                return JSON.parse(data);
            }
            else {
                data = await method.apply(this, [...args]);
                coolCache.set(key, JSON.stringify(data), ttl);
            }
            return data;
        };
        return descriptor;
    };
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map