import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import { Application } from 'egg';
import { BaseController } from './controller/base';
import { CoolConfig } from './interface';
import { CoreConfig } from './entity/core/conf';
import { Repository } from 'typeorm';
import { CoreModule } from './entity/core/module';
export declare class AutoConfiguration implements ILifeCycle {
    coreLogger: ILogger;
    app: Application;
    coolConfig: CoolConfig;
    allConfig: any;
    ormConfig: any;
    middlewareConfig: any;
    coreConfig: Repository<CoreConfig>;
    coreModule: Repository<CoreModule>;
    baseController: BaseController;
    onReady(container?: IMidwayContainer): Promise<void>;
    onStop?(container?: IMidwayContainer): Promise<void>;
    handlerRouterPrefix(): void;
    initDataBase(container: IMidwayContainer, sqlPath: string, module: string): Promise<void>;
    registerObject(container?: IMidwayContainer): Promise<void>;
    handlerEx(): void;
    handlerJsFunc(): void;
    handleCrud(container: IMidwayContainer): Promise<void>;
    /**
     * CRUD 路由
     * @param entityModel
     * @param controllerOption
     * @param modelClass
     * @param container
     */
    CrudRouter(entityModel: any, controllerOption: any, modelClass: any, container: IMidwayContainer): Promise<void>;
    /**
     * 校验参数
     * @param modelClass 要校验的模型
     * @param params 要检验的参数
     */
    validateParams(modelClass: any, params: any): void;
}
