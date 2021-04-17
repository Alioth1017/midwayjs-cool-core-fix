/**
 * 模块配置
 */
export interface ModuleConfig {
    name: string;
    description: string;
    middlewares: string[];
}
export interface CoolConfig {
    initDB: boolean;
    router: {
        prefix: string;
    };
    page: {
        size: number;
    };
    jwt: {
        secret: string;
        token: {
            expire: number;
            refreshExpire: number;
        };
    };
    sso: boolean;
    file: {
        domain: string;
    };
}
