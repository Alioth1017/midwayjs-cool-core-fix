declare type IsolationLevel = "READ UNCOMMITTED" | "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE";
export interface TransactionOptions {
    connectionName?: string;
    isolation?: IsolationLevel;
}
export declare function CoolTransaction(option?: TransactionOptions): MethodDecorator;
export {};
