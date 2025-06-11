<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="logo">管理系统</h1>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="username">当前用户: {{ userName }}</span>
          <i class="el-icon-user"></i>
        </div>
      </div>
    </header>

    <div class="admin-main">
      <!-- 侧边栏导航 -->
      <aside class="admin-sidebar">
        <el-menu
            :default-active="activeMenuItem"
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleMenuSelect"
        >
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>人员管理</span>
            </template>
            <el-menu-item index="1-1">物业人员管理</el-menu-item>
            <el-menu-item index="1-2">个人信息</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-office-building"></i>
              <span>物业管理</span>
            </template>
          </el-submenu>
        </el-menu>
      </aside>

      <!-- 主内容区域 -->
      <main class="admin-content">
        <div class="content-header">
          <h2>欢迎使用管理系统</h2>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="content-main">
          <!-- 快捷操作 -->
          <el-card class="box-card" v-if="activeMenuItem === '' || activeMenuItem === '1-1'">
            <template #header>
              <div class="clearfix">
                <span>快捷操作</span>
              </div>
            </template>
            <div class="quick-actions">
              <el-button type="primary" icon="el-icon-user" @click="addStaff">
                添加物业人员
              </el-button>
            </div>
          </el-card>

          <!-- 个人信息显示 -->
          <el-card class="box-card" v-if="activeMenuItem === '1-2'">
            <template #header>
              <div class="clearfix">
                <span>个人信息</span>
                <el-button type="primary" size="small" style="float: right;" @click="openEditDialog">修改个人信息</el-button>
              </div>
            </template>
            <el-descriptions title="账户信息" :column="1" border>
              <el-descriptions-item label="用户ID">{{ user.userID }}</el-descriptions-item>
              <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ user.email || "暂无" }}</el-descriptions-item>
              <el-descriptions-item label="角色">{{ user.role }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ user.phoneNumber || "暂无" }}</el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ user.createdAt ? new Date(user.createdAt).toLocaleString() : "暂无" }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </main>
    </div>

    <!-- ✅ 修改个人信息弹窗 -->
    <el-dialog
        title="修改个人信息"
        v-model="editDialogVisible"
        width="400px"
        @close="resetEditForm"
    >
      <el-form :model="editForm" ref="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
              type="password"
              v-model="editForm.password"
              autocomplete="new-password"
              placeholder="不修改请留空"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
              type="password"
              v-model="editForm.confirmPassword"
              autocomplete="new-password"
              placeholder="再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 页脚 -->
    <footer class="admin-footer">
      <div class="footer-content">
        <p>© 2025 管理系统 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import store from "../store";


export default {
  name: "AdminDashboard",
  data() {
    return {
      activeMenuItem: "",
      editDialogVisible: false,
      editForm: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phoneNumber: "",
      },
    };
  },
  computed: {
    user() {
      return store.state.user?.userDetails || {};
    },
    userName() {
      return this.user.username || "未登录用户";
    },
  },
  methods: {
    addStaff() {
      this.$router.push("/addstaff");
    },
    handleMenuSelect(index) {

      this.activeMenuItem = index;
      switch (index) {
        case '1-1':
          this.currentTitle = '无业人员管理';

          break;
        case '1-2':
          this.currentTitle = '个人信息';

          break;
        case '1-3':
          this.currentTitle = '报修';

          break;
        case '1-4':
          this.currentTitle = '更改个人信息';
          break;
        default:
          this.currentTitle = '欢迎使用管理系统';
      }
    },
    openEditDialog() {
      this.editForm.username = this.user.username || "";
      this.editForm.password = "";
      this.editForm.confirmPassword = "";
      this.editForm.email = this.user.email || "";
      this.editForm.phoneNumber = this.user.phoneNumber || "";
      this.editDialogVisible = true;
    },
    resetEditForm() {
      this.editForm.password = "";
      this.editForm.confirmPassword = "";
    },
    submitEditForm() {
      if (this.editForm.password !== this.editForm.confirmPassword) {
        this.$message.error("两次输入的密码不一致！");
        return;
      }

      const updatedData = {
        userID: this.user.userID,
        username: this.editForm.username,
        email: this.editForm.email,
        phone: this.editForm.phoneNumber, // ✅ 注意：字段名为 phone，不是 phoneNumber
      };

      if (this.editForm.password) {
        updatedData.password = this.editForm.password;
      }

      // 发送 POST 请求
      this.$axios.post("/api/UserUpdate", updatedData)
          .then(response => {
            if (response.data === true) {
              this.$message.success("个人信息修改成功，请重新登录！");
              this.editDialogVisible = false;
              this.$router.push("/")

              // 可选：更新 Vuex 中的用户信息
               this.$store.commit("updateUserDetails", updatedData);
            } else {
              this.$message.error("个人信息修改失败，请稍后再试！");
            }
          })
          .catch(error => {
            console.error("请求失败：", error);
            this.$message.error("请求出错！");
          });
    }

  },
};
</script>

<style scoped>
/* 基础布局样式 */
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}

/* 顶部导航栏样式 */
.admin-header {
  height: 60px;
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.logo {
  font-size: 20px;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-right: 10px;
}

/* 主体内容区域 */
.admin-main {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 110px); /* 减去header和footer高度 */
}

.admin-sidebar {
  width: 220px;
  background-color: #545c64;
  color: white;
}

.el-menu-vertical {
  border-right: none;
  height: 100%;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 内容区域样式 */
.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.box-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* 页脚样式 */
.admin-footer {
  height: 50px;
  background-color: #eef1f6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-main {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    height: auto;
  }

  .quick-actions {
    flex-direction: column;
  }
}
</style>
