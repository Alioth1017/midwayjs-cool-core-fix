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
exports.AutoConfiguration = void 0;
const decorator_1 = require("@midwayjs/decorator");
const decorator_2 = require("@midwayjs/decorator");
const path_1 = require("path");
const egg_1 = require("egg");
const orm = require("@midwayjs/orm");
const moment = require("moment");
const base_1 = require("./service/base");
const base_2 = require("./controller/base");
const bodyParser = require("koa-bodyparser");
const Joi = require("joi");
const validate_1 = require("./exceptions/validate");
const _ = require("lodash");
const fs = require("fs");
const local_1 = require("./component/file/local");
const orm_1 = require("@midwayjs/orm");
const conf_1 = require("./entity/core/conf");
const typeorm_1 = require("typeorm");
const Importer = require("mysql-import");
const node_1 = require("./component/cache/node");
const module_1 = require("./entity/core/module");
let AutoConfiguration = class AutoConfiguration {
    async onReady(container) {
        // 处理异常
        this.handlerEx();
        // 注入对象
        this.registerObject(container);
        // 处理常用函数
        this.handlerJsFunc();
        // 处理配置路由前缀
        this.handlerRouterPrefix();
        // 处理模型CRUD
        await this.handleCrud(container);
        // 初始化数据库
        // await this.initDataBase(container);
        this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core component ready \x1B[0m');
    }
    async onStop(container) {
    }
    // 处理配置路由前缀
    handlerRouterPrefix() {
        const routerPrefix = this.coolConfig.router.prefix;
        if (routerPrefix) {
            this.app.use(async (ctx, next) => {
                if (!ctx.path.startsWith(routerPrefix)) {
                    ctx.status = 404;
                    ctx.set('Content-Type', 'text/html; charset=utf-8');
                    ctx.body = `<h1>404 Not Found</h1>`;
                    return;
                }
                else {
                    ctx.path = ctx.path.replace(routerPrefix, '');
                }
                await next();
            });
        }
        this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core router prefix handler \x1B[0m');
    }
    // 初始化数据库
    async initDataBase(container, sqlPath, module) {
        //const sqlPath = `${container.baseDir}/resource/init.sql`;
        // 延迟2秒再导入数据库
        setTimeout(() => {
            if (fs.existsSync(sqlPath)) {
                const t = setInterval(() => {
                    this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core init ' + module + ' database... \x1B[0m');
                }, 1000);
                const importer = new Importer({
                    ...this.ormConfig,
                    user: this.ormConfig.username
                });
                importer.import(sqlPath).then(async () => {
                    clearInterval(t);
                    this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core init ' + module + ' database complete \x1B[0m');
                }).catch(err => {
                    clearTimeout(t);
                    this.coreLogger.error('\x1B[36m [cool:core] midwayjs cool core init ' + module + ' database err please manual import \x1B[0m');
                    this.coreLogger.error(err);
                });
            }
        }, 2000);
    }
    // 注入对象
    async registerObject(container) {
        // 注入缓存
        container.registerObject('core:cache:impl', await container.getAsync(node_1.NodeCacheHandler));
        // 注入文件上传
        container.registerObject('core:file:impl', await container.getAsync(local_1.LocalFileHandler));
        this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core cache register \x1B[0m');
    }
    // 处理异常
    handlerEx() {
        this.app.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                this.coreLogger.error(err);
                ctx.body = {
                    code: err.status,
                    message: err.message
                };
            }
        });
    }
    // 处理常用函数
    handlerJsFunc() {
        Date.prototype.toJSON = function () {
            return moment(this).format('YYYY-MM-DD HH:mm:ss');
        };
        // 新增String支持replaceAll方法
        String.prototype['replaceAll'] = function (s1, s2) {
            return this.replace(new RegExp(s1, 'gm'), s2);
        };
        this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core func handler \x1B[0m');
    }
    // 处理CRUD
    async handleCrud(container) {
        const cruds = decorator_1.listModule(decorator_1.CONTROLLER_KEY);
        for (const crud of cruds) {
            //const providerId = getProviderId(crud);
            const controllerOption = decorator_1.getClassMetadata(decorator_1.CONTROLLER_KEY, crud);
            // 获得到model
            let entityModel;
            const { entity } = (controllerOption === null || controllerOption === void 0 ? void 0 : controllerOption.curdOption) || {};
            if (entity) {
                let modelClass;
                if (entity.connectionName) {
                    modelClass = entity.entityKey;
                    entityModel = orm.useEntityModel(entity.entityKey, entity.connectionName);
                }
                else {
                    modelClass = entity;
                    entityModel = orm.useEntityModel(entity);
                }
                // 全局路由前缀
                const globalRouterPrefix = this.coolConfig.router.prefix;
                this.coreLogger.info(`\x1B[36m [cool:core] auto router prefix "${globalRouterPrefix ? globalRouterPrefix : ''}${controllerOption.prefix}"  \x1B[0m`);
                await this.CrudRouter(entityModel, controllerOption, modelClass, container);
            }
            // 模块
            if (controllerOption === null || controllerOption === void 0 ? void 0 : controllerOption.module) {
                const moduleEntity = new module_1.CoreModule();
                moduleEntity.name = controllerOption.module;
                const path = `${this.app.baseDir}/app/modules/${controllerOption.module}/config.${this.app.config.env == 'local' ? 'ts' : 'js'}`;
                if (fs.existsSync(path)) {
                    const moduleConfig = require(path).default(this.app);
                    moduleEntity.allConfig = JSON.stringify(moduleConfig);
                    if (!this.allConfig['module']) {
                        this.allConfig['module'] = {};
                    }
                    this.allConfig['module'][controllerOption.module] = moduleConfig;
                }
                if (!this.app['modules']) {
                    this.app['modules'] = [];
                }
                if (!this.app['modules'].includes(moduleEntity.name)) {
                    this.app['modules'].push(moduleEntity.name);
                    const check = await this.coreModule.findOne({ name: moduleEntity.name });
                    if (check) {
                        moduleEntity.id = check.id;
                    }
                    if (this.coolConfig.initDB) {
                        const sqlPath = `${this.app.baseDir}/app/modules/${controllerOption.module}/init.sql`;
                        if (fs.existsSync(sqlPath)) {
                            if ((check && check.dbInit == 0) || !check) {
                                await this.initDataBase(container, sqlPath, moduleEntity.name);
                            }
                            moduleEntity.dbInit = 1;
                        }
                    }
                    try {
                        await this.coreModule.save(moduleEntity);
                    }
                    catch (error) {
                    }
                }
            }
        }
        this.coreLogger.info('\x1B[36m [cool:core] midwayjs cool core crud handler \x1B[0m');
    }
    /**
     * CRUD 路由
     * @param entityModel
     * @param controllerOption
     * @param modelClass
     * @param container
     */
    async CrudRouter(entityModel, controllerOption, modelClass, container) {
        const { api, pageQueryOp, listQueryOp, insertParam, infoIgnoreProperty, service } = controllerOption.curdOption || {};
        // 路由中间件
        const middlewares = [];
        let middlewareConfigs = this.middlewareConfig || [];
        if (!_.isEmpty(controllerOption.routerOptions.middleware)) {
            middlewareConfigs = middlewareConfigs.concat(controllerOption.routerOptions.middleware);
        }
        // 模块路由中间件
        // if (controllerOption.module) {
        //     const path = `${this.app.baseDir}/app/modules/${controllerOption.module}/config.${this.app.config.env == 'local' ? 'ts' : 'js'}`;
        //     if (fs.existsSync(path)) {
        //         const moduleConfig: ModuleConfig = require(path).default(this.app);
        //         if (moduleConfig && moduleConfig.middlewares) {
        //             for (const item of moduleConfig.middlewares) {
        //                 if (!this.app['middlewaresArr']) {
        //                     this.app['middlewaresArr'] = [];
        //                 }
        //                 if (!this.app['middlewaresArr'].includes(item)) {
        //                     //this.app.use(await this.app['generateMiddleware'](item));
        //                     this.app['middlewaresArr'].push(item);
        //                     middlewareConfigs.push(item);
        //                 }
        //             }
        //         }
        //     } else {
        //         throw new CoolCoreException(`模块[${controllerOption.module}]，缺少配置文件config.ts`);
        //     }
        // }
        // 去重
        middlewareConfigs = _.uniq(middlewareConfigs);
        for (const item of middlewareConfigs) {
            middlewares.push(await this.app['generateMiddleware'](item));
        }
        // 全局路由前缀
        const globalRouterPrefix = this.coolConfig.router.prefix;
        // 遍历CRUD方法
        for (const url of api) {
            const method = url == 'info' ? 'get' : 'post';
            this.app.router[method](`${globalRouterPrefix ? globalRouterPrefix : ''}${controllerOption.prefix}/${url}`, bodyParser(), ...middlewares, async (ctx, next) => {
                let baseService = await ctx.requestContext.getAsync(base_1.BaseService);
                if (service) {
                    baseService = await ctx.requestContext.getAsync(service);
                }
                baseService.setModle(entityModel);
                baseService.setCtx(ctx);
                const requestParams = ctx.req.method === 'GET' ? ctx.request.queries : ctx.request.body;
                // 插入参数值
                if (insertParam) {
                    const insertParamData = await insertParam(ctx, this.app);
                    for (const key in insertParamData) {
                        requestParams[key] = insertParamData[key];
                    }
                }
                ctx.status = 200;
                try {
                    switch (url) {
                        case 'add':
                            // 校验参数
                            this.validateParams(modelClass, requestParams);
                            ctx.body = this.baseController.ok(await baseService.add(requestParams));
                            break;
                        case 'delete':
                            ctx.body = this.baseController.ok(await baseService.delete(requestParams.ids));
                            break;
                        case 'update':
                            // 校验参数
                            this.validateParams(modelClass, requestParams);
                            ctx.body = this.baseController.ok(await baseService.update(requestParams));
                            break;
                        case 'info':
                            ctx.body = this.baseController.ok(await baseService.info(requestParams.id, infoIgnoreProperty));
                            break;
                        case 'list':
                            ctx.body = this.baseController.ok(await baseService.list(requestParams, listQueryOp));
                            break;
                        case 'page':
                            ctx.body = this.baseController.ok(await baseService.page(requestParams, pageQueryOp));
                            break;
                        default:
                            ctx.body = this.baseController.ok();
                    }
                }
                catch (error) {
                    this.coreLogger.error(error);
                    ctx.body = this.baseController.fail(error.message, error.status);
                }
            });
            //this.coreLogger.info(`\x1B[36m [cool:core] crud router "${method} ${globalRouterPrefix ? globalRouterPrefix : ''}${controllerOption.prefix}/${url}"  \x1B[0m`)
        }
    }
    /**
     * 校验参数
     * @param modelClass 要校验的模型
     * @param params 要检验的参数
     */
    validateParams(modelClass, params) {
        // 获得校验规则
        const rules = decorator_1.getClassMetadata(decorator_1.RULES_KEY, modelClass);
        const schema = Joi.object(rules);
        const result = schema.validate(params);
        if (result.error) {
            throw new validate_1.CoolValidateException(result.error.message);
        }
    }
};
__decorate([
    decorator_2.Logger(),
    __metadata("design:type", Object)
], AutoConfiguration.prototype, "coreLogger", void 0);
__decorate([
    decorator_1.App(),
    __metadata("design:type", egg_1.Application)
], AutoConfiguration.prototype, "app", void 0);
__decorate([
    decorator_1.Config('cool'),
    __metadata("design:type", Object)
], AutoConfiguration.prototype, "coolConfig", void 0);
__decorate([
    decorator_1.Config(decorator_1.ALL),
    __metadata("design:type", Object)
], AutoConfiguration.prototype, "allConfig", void 0);
__decorate([
    decorator_1.Config('orm'),
    __metadata("design:type", Object)
], AutoConfiguration.prototype, "ormConfig", void 0);
__decorate([
    decorator_1.Config('middleware'),
    __metadata("design:type", Object)
], AutoConfiguration.prototype, "middlewareConfig", void 0);
__decorate([
    orm_1.InjectEntityModel(conf_1.CoreConfig),
    __metadata("design:type", typeorm_1.Repository)
], AutoConfiguration.prototype, "coreConfig", void 0);
__decorate([
    orm_1.InjectEntityModel(module_1.CoreModule),
    __metadata("design:type", typeorm_1.Repository)
], AutoConfiguration.prototype, "coreModule", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", base_2.BaseController)
], AutoConfiguration.prototype, "baseController", void 0);
AutoConfiguration = __decorate([
    decorator_1.Configuration({
        imports: [
            orm
        ],
        namespace: 'cool',
        importConfigs: [path_1.join(__dirname, 'config')]
    })
], AutoConfiguration);
exports.AutoConfiguration = AutoConfiguration;
//# sourceMappingURL=configuration.js.map