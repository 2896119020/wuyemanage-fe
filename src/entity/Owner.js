import User from "./User.js";  // 或具体路径
// eslint-disable-next-line no-unused-vars
class Owner {
    constructor(ownerID = 0, userID = "", buildingNumber = 0, doorNumber = 0, user = new User()) {
        this.ownerID = ownerID;
        this.userID = userID;
        this.buildingNumber = buildingNumber;
        this.doorNumber = doorNumber;
        this.user = user instanceof User ? user : new User(user);
    }

    // 静态转换方法
    static fromJavaObject(javaOwner) {
        return new Owner(
            javaOwner.ownerID,
            javaOwner.userID,
            javaOwner.buildingNumber,
            javaOwner.doorNumber,
            User.fromJavaObject(javaOwner.user)
        );
    }

    // 转换为后端格式
    toRequestFormat() {
        return {
            ownerID: this.ownerID,
            userID: this.userID,
            buildingNumber: this.buildingNumber,
            doorNumber: this.doorNumber,
            user: this.user.toRequestFormat()
        };
    }
}