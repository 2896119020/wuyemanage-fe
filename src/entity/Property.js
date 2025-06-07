import User from "./User.js"; // 或具体路径
// eslint-disable-next-line no-unused-vars
class Property {
    constructor(propertyID = 0, userID = "", user = new User()) {
        this.propertyID = propertyID;
        this.userID = userID;
        this.user = user instanceof User ? user : new User(user);
    }

    // 静态转换方法
    static fromJavaObject(javaProperty) {
        return new Property(
            javaProperty.propertyID,
            javaProperty.userID,
            User.fromJavaObject(javaProperty.user)
        );
    }

    // 转换为后端格式
    toRequestFormat() {
        return {
            propertyID: this.propertyID,
            userID: this.userID,
            user: this.user.toRequestFormat()
        };
    }
}