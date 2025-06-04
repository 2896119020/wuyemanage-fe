// eslint-disable-next-line no-unused-vars
export default class User {
    constructor(userID = "", username = "", hashPassword = "", email = "", role = "", phoneNumber = "", createdAt = new Date()) {
        this.userID = userID;
        this.username = username;
        this.hashPassword = hashPassword;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
    }

    static fromJavaString(javaString) {
        // 1. 格式验证
        if (!javaString.startsWith("User{") || !javaString.endsWith("}")) {
            throw new Error("Invalid Java toString format");
        }

        // 2. 提取键值对字符串
        const content = javaString.slice(5, -1);
        const keyValuePairs = content.split(', ');

        // 3. 构建键值对象
        const obj = {};
        for (const pair of keyValuePairs) {
            const [key, value] = pair.split('=');

            // 4. 特殊处理 createdAt 和字符串引号
            if (key === 'createdAt') {
                // 日期类型直接解析
                obj[key] = new Date(value);
            } else {
                // 移除字符串值的单引号（兼容 null 值）
                obj[key] = value.startsWith("'") && value.endsWith("'")
                    ? value.slice(1, -1)
                    : value === 'null' ? null : value;
            }
        }

        // 5. 构造 User 实例
        return new User(
            obj.userID || "",
            obj.username || "",
            obj.hashPassword || "",
            obj.email || "",
            obj.role || "",
            obj.phoneNumber || "",
            obj.createdAt || new Date()
        );
    }
    // 静态方法用于从Java对象转换
    static fromJavaObject(javaUser) {
        // 1. 验证必要属性是否存在
        if (!javaUser.userID || !javaUser.email) {
            throw new Error("Invalid Java Object: Missing required fields");
        }

        // 2. 显式处理日期类型（避免序列化格式差异）
        const createdAt = javaUser.createdAt
            ? new Date(javaUser.createdAt)
            : new Date();

        return new User(
            javaUser.userID,
            javaUser.username,
            javaUser.hashPassword,
            javaUser.email,
            javaUser.role,
            javaUser.phoneNumber,
            createdAt
        );
    }

    // 转换为后端需要的格式
    toRequestFormat() {
        return {
            userID: this.userID,
            username: this.username,
            hashPassword: this.hashPassword,
            email: this.email,
            role: this.role,
            phoneNumber: this.phoneNumber,
            createdAt: this.createdAt.toISOString()
        };
    }
}