import { MiddlewareParamArray } from '@midwayjs/decorator';
declare type ApiTypes = 'add' | 'delete' | 'update' | 'page' | 'info' | 'list';
export interface CurdOption {
    prefix?: string;
    api: ApiTypes[];
    pageQueryOp?: QueryOp;
    listQueryOp?: QueryOp;
    insertParam?: Function;
    infoIgnoreProperty?: string[];
    entity: {
        entityKey?: any;
        connectionName?: string;
    } | any;
    service?: any;
}
export interface LeftJoinOp {
    entity: any;
    alias: string;
    condition: string;
}
export interface FieldEq {
    column: string;
    requestParam: string;
}
export interface QueryOp {
    keyWordLikeFields?: string[];
    where?: Function;
    select?: string[];
    fieldEq?: string[] | FieldEq[];
    addOrderBy?: {};
    leftJoin?: LeftJoinOp[];
}
export interface ControllerOption {
    curdOption?: CurdOption | string;
    routerOptions?: {
        sensitive?: boolean;
        middleware?: MiddlewareParamArray;
        alias?: string[];
        description?: string;
        tagName?: string;
    };
}
export declare function CoolController(curdOption?: CurdOption | string, routerOptions?: {
    sensitive?: boolean;
    middleware?: string[];
    description?: string;
    tagName?: string;
}): ClassDecorator;
export {};
