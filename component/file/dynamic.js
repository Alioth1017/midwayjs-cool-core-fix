"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicFileServiceHandler = void 0;
const core_1 = require("@midwayjs/core");
const _1 = require(".");
const plugin_1 = require("../plugin");
const local_1 = require("./local");
async function dynamicFileServiceHandler(container) {
    // 获得插件操作实例
    const coolPlugin = await container.getAsync(plugin_1.CoolPlugin);
    // 找出替换的上传的文件的插件
    const plugin = await coolPlugin.plugins({ replaceProvider: _1.COOL_FILE_KEY, enable: 1, status: plugin_1.PLUGINSTATUS.USABLE });
    if (plugin) {
        try {
            const file = await container.getAsync(plugin.providerId);
            if (file) {
                return file;
            }
        }
        catch (error) { }
    }
    return await container.getAsync(local_1.LocalFileHandler);
}
exports.dynamicFileServiceHandler = dynamicFileServiceHandler;
core_1.providerWrapper([
    {
        id: 'file',
        provider: dynamicFileServiceHandler,
        scope: core_1.ScopeEnum.Request,
    }
]);
//# sourceMappingURL=dynamic.js.map