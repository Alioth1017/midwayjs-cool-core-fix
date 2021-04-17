import { Application, Context } from 'egg';
/**
 * 服务基类
 */
export declare abstract class BaseService {
    private conf;
    protected entity: any;
    protected sqlParams: any;
    setModle(entity: any): void;
    setCtx(ctx: Context): void;
    app: Application;
    setApp(app: Application): void;
    ctx: Context;
    init(): void;
    /**
     * 获得单个ID
     * @param id ID
     * @param infoIgnoreProperty 忽略返回属性
     */
    info(id: any, infoIgnoreProperty?: string[]): Promise<any>;
    /**
     * 执行SQL并获得分页数据
     * @param sql 执行的sql语句
     * @param query 分页查询条件
     * @param autoSort 是否自动排序
     * @param connectionName 连接名称
     */
    sqlRenderPage(sql: any, query: any, autoSort?: boolean, connectionName?: any): Promise<{
        list: any;
        pagination: {
            page: number;
            size: number;
            total: number;
        };
    }>;
    /**
     * 设置sql
     * @param condition 条件是否成立
     * @param sql sql语句
     * @param params 参数
     */
    setSql(condition: any, sql: any, params: any): any;
    /**
     * 获得查询个数的SQL
     * @param sql
     */
    getCountSql(sql: any): string;
    /**
    * 参数安全性检查
    * @param params
    */
    paramSafetyCheck(params: any): Promise<boolean>;
    /**
    * 原生查询
    * @param sql
    * @param params
    * @param connectionName
    */
    nativeQuery(sql: any, params?: any, connectionName?: any): Promise<any>;
    /**
     * 获得ORM管理
     *  @param connectionName 连接名称
     */
    getOrmManager(connectionName?: any): import("typeorm").EntityManager;
    /**
     * 非分页查询
     * @param query 查询条件
     * @param option 查询配置
     */
    list(query: any, option: any): Promise<any>;
    /**
     * 删除
     * @param ids 删除的ID集合 如：[1,2,3] 或者 1,2,3
     */
    delete(ids: number[] | string): Promise<void>;
    /**
     * 新增|修改
     * @param param 数据
     */
    addOrUpdate(param: any): Promise<void>;
    /**
     * 新增
     * @param param 数据
     */
    add(param: any): Promise<Object>;
    /**
     * 修改
     * @param param 数据
     */
    update(param: any): Promise<void>;
    /**
     * 新增|修改|删除 之后的操作
     * @param data 对应数据
     */
    modifyAfter(data: any): Promise<void>;
    /**
     * 分页查询
     * @param query 查询条件
     * @param option 查询配置
     */
    page(query: any, option: any): Promise<{
        list: any;
        pagination: {
            page: number;
            size: number;
            total: number;
        };
    }>;
    /**
     * query
     * @param data
     * @param query
     */
    renderPage(data: any, query: any): {
        list: any;
        pagination: {
            page: number;
            size: number;
            total: any;
        };
    };
    /**
     * 构建查询配置
     * @param query 前端查询
     * @param option
     */
    private getOptionFind;
}
