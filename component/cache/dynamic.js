"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicCacheServiceHandler = void 0;
const core_1 = require("@midwayjs/core");
const _1 = require(".");
const plugin_1 = require("../plugin");
const node_1 = require("./node");
async function dynamicCacheServiceHandler(container) {
    // 获得插件操作实例
    const coolPlugin = await container.getAsync(plugin_1.CoolPlugin);
    // 找出替换的缓存的插件
    const plugin = await coolPlugin.plugins({ replaceProvider: _1.COOL_CACHE_KEY, enable: 1, status: plugin_1.PLUGINSTATUS.USABLE });
    if (plugin) {
        try {
            const cache = await container.getAsync(plugin.providerId);
            if (cache) {
                return cache;
            }
        }
        catch (error) { }
    }
    return await container.getAsync(node_1.NodeCacheHandler);
}
exports.dynamicCacheServiceHandler = dynamicCacheServiceHandler;
core_1.providerWrapper([
    {
        id: 'cache',
        provider: dynamicCacheServiceHandler,
        scope: core_1.ScopeEnum.Request,
    }
]);
//# sourceMappingURL=dynamic.js.map