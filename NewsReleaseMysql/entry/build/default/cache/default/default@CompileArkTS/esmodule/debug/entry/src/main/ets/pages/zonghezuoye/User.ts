// 定义用户表结构
export class User {
    id: number = 0; // 自增主键
    username: string = '';
    password: string = '';
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
    toString(): string {
        return `User{id:${this.id}, username:"${this.username}", password:"${this.password}"}`;
    }
}
