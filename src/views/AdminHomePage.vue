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
            default-active="1"
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>人员管理</span>
            </template>
            <el-menu-item index="1-1">物业人员管理</el-menu-item>
            <el-menu-item index="1-2">更改个人信息</el-menu-item>
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
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>快捷操作</span>
              </div>
            </template>
            <div class="quick-actions">
              <el-button type="primary" icon="el-icon-user" @click="manageStaff">
                管理物业人员
              </el-button>
            </div>
          </el-card>
        </div>
      </main>
    </div>

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
  name: 'AdminDashboard',
  computed: {
    userName() {
      return store.state.user?.userDetails?.username || '未登录用户'
    }
  },
  methods: {
    manageStaff() {
      this.$router.push('/staff-management')
    }
  }
}
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