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
exports.CoolPlugin = exports.PLUGINSTATUS = void 0;
const decorator_1 = require("@midwayjs/decorator");
const orm_1 = require("@midwayjs/orm");
const plugin_1 = require("../../entity/core/plugin");
const typeorm_1 = require("typeorm");
const decorator_2 = require("@midwayjs/decorator");
const conf_1 = require("../../entity/core/conf");
const func_loc_1 = require("func-loc");
const fs = require("fs");
const _ = require("lodash");
const validate_1 = require("../../exceptions/validate");
const os = require("os");
const node_1 = require("../cache/node");
const orm_2 = require("@midwayjs/orm");
/**
 * 插件状态
 */
var PLUGINSTATUS;
(function (PLUGINSTATUS) {
    // 未配置
    PLUGINSTATUS[PLUGINSTATUS["NOCONF"] = 0] = "NOCONF";
    // 可用
    PLUGINSTATUS[PLUGINSTATUS["USABLE"] = 1] = "USABLE";
    // 配置错误
    PLUGINSTATUS[PLUGINSTATUS["CONFERR"] = 2] = "CONFERR";
    // 未知错误
    PLUGINSTATUS[PLUGINSTATUS["UNKNOWNERR"] = 3] = "UNKNOWNERR";
})(PLUGINSTATUS = exports.PLUGINSTATUS || (exports.PLUGINSTATUS = {}));
/**
 * 插件管理
 */
let CoolPlugin = class CoolPlugin {
    /**
     * 安装插件
     * @param cls 插件类
     * @param callBack 安装回调
     * @param replaceProvider 替换的Provider
     */
    async install(cls, callBack, replaceProvider) {
        try {
            const providerId = decorator_1.getProviderId(cls);
            func_loc_1.locate(callBack).then(async (res) => {
                let pkPath = res.path.replace('configuration.js', 'package.json');
                let viewPath = res.path.replace('configuration.js', 'view.json');
                if (os.type() == 'Windows_NT') {
                    pkPath = pkPath.substr(1);
                    viewPath = viewPath.substr(1);
                }
                const config = JSON.parse(fs.readFileSync(pkPath, 'utf8'));
                if (!_.startsWith(config.name, 'midwayjs-cool-')) {
                    throw new validate_1.CoolValidateException('插件命名不规范，请检查package.json中的name值');
                }
                config.namespace = config.name.split('-')[2];
                config.name = config.pluginName;
                if (fs.existsSync(viewPath)) {
                    config.view = fs.readFileSync(viewPath, 'utf8');
                }
                config.providerId = providerId;
                config.replaceProvider = replaceProvider;
                const check = await this.corePlugin.findOne({ name: config.name });
                if (check) {
                    config.enable = check.enable;
                    config.id = check.id;
                }
                await this.corePlugin.save(config);
                // 获得插件实例
                const plugin = await this.app.getApplicationContext().getAsync(cls);
                // 插件启用才会继续注册
                if (config.enable) {
                    const status = await plugin.checkStatus();
                    if (status == PLUGINSTATUS.USABLE) {
                        await this.registerObject(providerId, plugin);
                    }
                    await callBack(status);
                    await this.changeStatus(config.name, status);
                }
                await this.clearPluginCache();
            });
        }
        catch (err) {
            this.coreLogger.error(err);
        }
    }
    /**
     * 重新加载插件
     * @param 实例ID
     */
    async reloadPlugin(providerId) {
        const instance = await this.app.getApplicationContext().getAsync(providerId);
        const status = await instance.init();
        //this.app.getApplicationContext().registry.registerObject(providerId, instance);
        await this.corePlugin.update({ providerId }, { status });
    }
    /**
     * 注册实例
     * @param providerId
     * @param obj
     */
    async registerObject(providerId, obj) {
        this.app.getApplicationContext().registerObject(providerId, obj);
    }
    /**
     * 插件列表
     */
    async list(keyWord) {
        let plugins = await this.refresh();
        plugins = keyWord ? _.filter(plugins, function (e) { return e.name.includes(keyWord); }) : plugins;
        return plugins;
    }
    /**
     * 所有可用插件
     * @returns
     */
    async plugins(find) {
        let plugins;
        const data = await this.nodeCacheHandler.get('core:plugin:cache');
        if (data) {
            plugins = JSON.parse(data);
            return find ? _.find(plugins, find) : plugins;
        }
        plugins = await this.refresh();
        this.nodeCacheHandler.set('core:plugin:cache', JSON.stringify(plugins));
        return find ? _.find(plugins, find) : plugins;
    }
    /**
     * 清除插件缓存
     */
    async clearPluginCache() {
        await this.nodeCacheHandler.del('core:plugin:cache');
    }
    /**
     * 配置
     * @param name
     * @param config
     */
    async setConfig(name, config) {
        for (const key in config) {
            const check = await this.coreConfig.createQueryBuilder()
                .where('cKey like :cKey', { cKey: `${name}.${key}` }).getOne();
            if (check) {
                check.cValue = config[key];
                await this.coreConfig.update(check.id, check);
            }
            else {
                await this.coreConfig.insert({
                    cKey: `${name}.${key}`,
                    cValue: config[key]
                });
            }
        }
        const plugin = await this.corePlugin.findOne({ namespace: name });
        await this.reloadPlugin(plugin.providerId);
        await this.clearPluginCache();
    }
    /**
     * 获得插件的所有配置
     * @param namespace
     */
    async getConfig(namespace) {
        if (this.coolConfig[namespace]) {
            return this.coolConfig[namespace];
        }
        const check = await orm_2.useEntityModel(plugin_1.CorePlugin).findOne({ namespace, enable: 1 });
        if (check) {
            const config = {};
            const configs = await orm_2.useEntityModel(conf_1.CoreConfig).createQueryBuilder()
                .where('cKey like :cKey', { cKey: `${namespace}.%` }).getMany();
            for (const item of configs) {
                config[item.cKey.replace(`${namespace}.`, '')] = item.cValue;
            }
            return config;
        }
        return null;
    }
    /**
     * 刷新插件 如果插件不存在就移除它
     */
    async refresh() {
        // 获得所有插件
        const plugins = await orm_2.useEntityModel(plugin_1.CorePlugin).find();
        for (const item of plugins) {
            try {
                await this.app.getApplicationContext().getAsync(item.providerId);
            }
            catch (error) {
                await orm_2.useEntityModel(plugin_1.CorePlugin).delete(item.id);
                _.remove(plugins, function (e) {
                    return e.id = item.id;
                });
            }
        }
        return plugins;
    }
    /**
     * 是否启用插件 0：否 1：是
     * @param namespace
     * @param enable
     */
    async enable(namespace, enable) {
        await orm_2.useEntityModel(plugin_1.CorePlugin).update({ namespace }, { enable });
        await this.clearPluginCache();
    }
    /**
     * 改变插件状态
     * @param name 插件名称
     * @param status 状态
     */
    async changeStatus(name, status) {
        await orm_2.useEntityModel(plugin_1.CorePlugin).update({ name }, { status });
    }
};
__decorate([
    orm_1.InjectEntityModel(plugin_1.CorePlugin),
    __metadata("design:type", typeorm_1.Repository)
], CoolPlugin.prototype, "corePlugin", void 0);
__decorate([
    orm_1.InjectEntityModel(conf_1.CoreConfig),
    __metadata("design:type", typeorm_1.Repository)
], CoolPlugin.prototype, "coreConfig", void 0);
__decorate([
    decorator_2.Logger(),
    __metadata("design:type", Object)
], CoolPlugin.prototype, "coreLogger", void 0);
__decorate([
    decorator_1.App(),
    __metadata("design:type", Object)
], CoolPlugin.prototype, "app", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", node_1.NodeCacheHandler)
], CoolPlugin.prototype, "nodeCacheHandler", void 0);
__decorate([
    decorator_1.Config('cool'),
    __metadata("design:type", Object)
], CoolPlugin.prototype, "coolConfig", void 0);
CoolPlugin = __decorate([
    decorator_1.Provide()
], CoolPlugin);
exports.CoolPlugin = CoolPlugin;
//# sourceMappingURL=index.js.map