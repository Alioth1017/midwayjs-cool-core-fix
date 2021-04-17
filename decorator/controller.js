"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const func_loc_1 = require("func-loc");
// COOL的装饰器
function CoolController(curdOption, routerOptions = { middleware: [], sensitive: true }) {
    return (target) => {
        // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
        decorator_1.saveModule(decorator_1.CONTROLLER_KEY, target);
        let prefix;
        if (typeof curdOption === 'string') {
            prefix = curdOption;
        }
        else {
            prefix = (curdOption === null || curdOption === void 0 ? void 0 : curdOption.prefix) || '';
        }
        // 如果不存在路由前缀，那么自动根据当前文件夹路径
        func_loc_1.locate(target).then(res => {
            const pathSps = res.path.split('.');
            const paths = pathSps[pathSps.length - 2].split('/');
            const pathArr = [];
            let module = null;
            for (const path of paths.reverse()) {
                if (path != 'controller' && !module) {
                    pathArr.push(path);
                }
                if (path == 'controller' && !paths.includes('modules')) {
                    break;
                }
                if (path == 'controller' && paths.includes('modules')) {
                    module = 'ready';
                }
                if (module && path != 'controller') {
                    module = `${path}`;
                    break;
                }
            }
            if (module) {
                pathArr.reverse();
                pathArr.splice(1, 0, module);
            }
            if (!prefix) {
                prefix = `/${pathArr.join('/')}`;
            }
            saveMetadata(prefix, routerOptions, target, curdOption, module);
        });
    };
}
exports.CoolController = CoolController;
// 保存一些元数据信息，任意你希望存的东西
function saveMetadata(prefix, routerOptions, target, curdOption, module) {
    decorator_1.saveClassMetadata(decorator_1.CONTROLLER_KEY, {
        prefix,
        routerOptions,
        curdOption,
        module
    }, target);
    decorator_1.Scope(decorator_1.ScopeEnum.Request)(target);
}
//# sourceMappingURL=controller.js.map