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
exports.BaseService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const typeorm_1 = require("typeorm");
const _ = require("lodash");
const validate_1 = require("../exceptions/validate");
const global_1 = require("../constants/global");
const egg_1 = require("egg");
/**
 * 服务基类
 */
let BaseService = class BaseService {
    // 设置模型
    setModle(entity) {
        this.entity = entity;
    }
    // 设置请求上下文
    setCtx(ctx) {
        this.ctx = ctx;
    }
    // 设置应用对象
    setApp(app) {
        this.app = app;
    }
    // 初始化
    init() {
        this.sqlParams = [];
    }
    /**
     * 获得单个ID
     * @param id ID
     * @param infoIgnoreProperty 忽略返回属性
     */
    async info(id, infoIgnoreProperty) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        if (!id) {
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOID);
        }
        const info = await this.entity.findOne({ id });
        if (info && infoIgnoreProperty) {
            for (const property of infoIgnoreProperty) {
                delete info[property];
            }
        }
        return info;
    }
    /**
     * 执行SQL并获得分页数据
     * @param sql 执行的sql语句
     * @param query 分页查询条件
     * @param autoSort 是否自动排序
     * @param connectionName 连接名称
     */
    async sqlRenderPage(sql, query, autoSort = false, connectionName) {
        const { size = this.conf.size, page = 1, order = 'createTime', sort = 'desc', isExport = false, maxExportLimit } = query;
        if (order && sort && !autoSort) {
            if (!await this.paramSafetyCheck(order + sort)) {
                throw new validate_1.CoolValidateException('非法传参~');
            }
            sql += ` ORDER BY ${order} ${sort}`;
        }
        if (isExport && maxExportLimit > 0) {
            this.sqlParams.push(parseInt(maxExportLimit));
            sql += ' LIMIT ? ';
        }
        if (!isExport) {
            this.sqlParams.push((page - 1) * size);
            this.sqlParams.push(parseInt(size));
            sql += ' LIMIT ?,? ';
        }
        let params = [];
        params = params.concat(this.sqlParams);
        const result = await this.nativeQuery(sql, params, connectionName);
        const countResult = await this.nativeQuery(this.getCountSql(sql), params, connectionName);
        return {
            list: result,
            pagination: {
                page: parseInt(page),
                size: parseInt(size),
                total: parseInt(countResult[0] ? countResult[0].count : 0),
            },
        };
    }
    /**
     * 设置sql
     * @param condition 条件是否成立
     * @param sql sql语句
     * @param params 参数
     */
    setSql(condition, sql, params) {
        let rSql = false;
        if (condition || (condition === 0 && condition !== '')) {
            rSql = true;
            this.sqlParams = this.sqlParams.concat(params);
        }
        return rSql ? sql : '';
    }
    /**
     * 获得查询个数的SQL
     * @param sql
     */
    getCountSql(sql) {
        sql = sql.replace('LIMIT', 'limit');
        return `select count(*) as count from (${sql.split('limit')[0]}) a`;
    }
    /**
    * 参数安全性检查
    * @param params
    */
    async paramSafetyCheck(params) {
        const lp = params.toLowerCase();
        return !(lp.indexOf('update ') > -1 || lp.indexOf('select ') > -1 || lp.indexOf('delete ') > -1 || lp.indexOf('insert ') > -1);
    }
    /**
    * 原生查询
    * @param sql
    * @param params
    * @param connectionName
    */
    async nativeQuery(sql, params, connectionName) {
        if (_.isEmpty(params)) {
            params = this.sqlParams;
        }
        let newParams = [];
        newParams = newParams.concat(params);
        this.sqlParams = [];
        return await this.getOrmManager(connectionName).query(sql, newParams || []);
    }
    /**
     * 获得ORM管理
     *  @param connectionName 连接名称
     */
    getOrmManager(connectionName) {
        return typeorm_1.getManager(connectionName);
    }
    /**
     * 非分页查询
     * @param query 查询条件
     * @param option 查询配置
     */
    async list(query, option) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        const sql = await this.getOptionFind(query, option);
        return this.nativeQuery(sql, []);
    }
    /**
     * 删除
     * @param ids 删除的ID集合 如：[1,2,3] 或者 1,2,3
     */
    async delete(ids) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        if (ids instanceof Array) {
            await this.entity.delete(ids);
        }
        else {
            await this.entity.delete(ids.split(','));
        }
        await this.modifyAfter(ids);
    }
    /**
     * 新增|修改
     * @param param 数据
     */
    async addOrUpdate(param) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        await this.entity.save(param);
    }
    /**
     * 新增
     * @param param 数据
     */
    async add(param) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        await this.addOrUpdate(param);
        await this.modifyAfter(param);
        return {
            id: param.id
        };
    }
    /**
     * 修改
     * @param param 数据
     */
    async update(param) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        if (!param.id)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOID);
        await this.addOrUpdate(param);
        await this.modifyAfter(param);
    }
    /**
     * 新增|修改|删除 之后的操作
     * @param data 对应数据
     */
    async modifyAfter(data) {
    }
    /**
     * 分页查询
     * @param query 查询条件
     * @param option 查询配置
     */
    async page(query, option) {
        if (!this.entity)
            throw new validate_1.CoolValidateException(global_1.ERRINFO.NOENTITY);
        const sql = await this.getOptionFind(query, option);
        return this.sqlRenderPage(sql, query, true);
    }
    /**
     * query
     * @param data
     * @param query
     */
    renderPage(data, query) {
        const { size = this.conf.size, page = 1 } = query;
        return {
            list: data[0],
            pagination: {
                page: parseInt(page),
                size: parseInt(size),
                total: data[1],
            },
        };
    }
    /**
     * 构建查询配置
     * @param query 前端查询
     * @param option
     */
    async getOptionFind(query, option) {
        let { order = 'createTime', sort = 'desc', keyWord = '' } = query;
        let sqlArr = ['SELECT'];
        let selects = ['a.*'];
        let find = this.entity.createQueryBuilder('a');
        if (option) {
            // 判断是否有关联查询，有的话取个别名
            if (!_.isEmpty(option.leftJoin)) {
                for (const item of option.leftJoin) {
                    selects.push(`${item.alias}.*`);
                    find.leftJoin(item.entity, item.alias, item.condition);
                }
            }
            // 默认条件
            if (option.where) {
                const wheres = await option.where(this.ctx, this.app);
                if (!_.isEmpty(wheres)) {
                    for (const item of wheres) {
                        if (item.length == 2 || (item.length == 3 && (item[2] || (item[2] === 0 && item[2] != '')))) {
                            for (const key in item[1]) {
                                this.sqlParams.push(item[1][key]);
                            }
                            find.andWhere(item[0], item[1]);
                        }
                    }
                }
            }
            // 附加排序
            if (!_.isEmpty(option.addOrderBy)) {
                for (const key in option.addOrderBy) {
                    find.addOrderBy(key, option.addOrderBy[key].toUpperCase());
                }
            }
            // 关键字模糊搜索
            if (keyWord) {
                keyWord = `%${keyWord}%`;
                find.andWhere(new typeorm_1.Brackets(qb => {
                    const keyWordLikeFields = option.keyWordLikeFields;
                    for (let i = 0; i < option.keyWordLikeFields.length; i++) {
                        qb.orWhere(`${keyWordLikeFields[i]} like :keyWord`, {
                            keyWord
                        });
                        this.sqlParams.push(keyWord);
                    }
                }));
            }
            // 筛选字段
            if (!_.isEmpty(option.select)) {
                sqlArr.push(option.select.join(','));
                find.select(option.select);
            }
            else {
                sqlArr.push(selects.join(','));
            }
            // 字段全匹配
            if (!_.isEmpty(option.fieldEq)) {
                for (const key of option.fieldEq) {
                    const c = {};
                    // 单表字段无别名的情况下操作
                    if (typeof key === 'string') {
                        if (query[key] || query[key] == 0) {
                            c[key] = query[key];
                            const eq = query[key] instanceof Array ? 'in' : '=';
                            if (eq === 'in') {
                                find.andWhere(`${key} ${eq} (:${key})`, c);
                            }
                            else {
                                find.andWhere(`${key} ${eq} :${key}`, c);
                            }
                            this.sqlParams.push(query[key]);
                        }
                    }
                    else {
                        if (query[key.column] || query[key.column] == 0) {
                            c[key.column] = query[key.column];
                            const eq = query[key.column] instanceof Array ? 'in' : '=';
                            if (eq === 'in') {
                                find.andWhere(`${key.column} ${eq} (:${key.column})`, c);
                            }
                            else {
                                find.andWhere(`${key.column} ${eq} :${key.column}`, c);
                            }
                            this.sqlParams.push(query[key.column]);
                        }
                    }
                }
            }
        }
        else {
            sqlArr.push(selects.join(','));
        }
        // 接口请求的排序
        if (sort && order) {
            const sorts = sort.toUpperCase().split(',');
            const orders = order.split(',');
            if (sorts.length != orders.length) {
                throw new validate_1.CoolValidateException(global_1.ERRINFO.SORTFIELD);
            }
            sorts.forEach((_,i)=>find.addOrderBy(orders[i], sorts[i]))
        }
        const sqls = find.getSql().split('FROM');
        sqlArr.push('FROM');
        sqlArr.push(sqls[1]);
        return sqlArr.join(' ');
    }
};
__decorate([
    decorator_1.Config('cool.page'),
    __metadata("design:type", Object)
], BaseService.prototype, "conf", void 0);
__decorate([
    decorator_1.App(),
    __metadata("design:type", egg_1.Application)
], BaseService.prototype, "app", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], BaseService.prototype, "ctx", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseService.prototype, "init", null);
BaseService = __decorate([
    decorator_1.Provide()
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=base.js.map