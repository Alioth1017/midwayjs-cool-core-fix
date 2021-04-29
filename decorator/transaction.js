"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolTransaction = void 0;
const typeorm_1 = require("typeorm");
const comm_1 = require("../exceptions/comm");
function CoolTransaction(option) {
    return (target, propertyKey, descriptor) => {
        let queryRunner;
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            let data;
            const connection = typeorm_1.getConnection((option === null || option === void 0 ? void 0 : option.connectionName) || 'default');
            queryRunner = queryRunner || connection.createQueryRunner();
            // 使用我们的新queryRunner建立真正的数据库连
            //await queryRunner.connect();
            if (option && option.isolation) {
                await queryRunner.startTransaction(option.isolation);
            }
            else {
                await queryRunner.startTransaction();
            }
            try {
                data = await method.apply(this, [...args, queryRunner]);
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw new comm_1.CoolCommException(error.message);
            }
            return data;
        };
        return descriptor;
    };
}
exports.CoolTransaction = CoolTransaction;
//# sourceMappingURL=transaction.js.map