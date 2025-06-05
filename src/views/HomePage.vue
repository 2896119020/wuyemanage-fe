<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="logo">管理系统</h1>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="username">当前用户: {{user.userDetails.username}}</span>
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
            <el-menu-item index="1-1">物业人员</el-menu-item>
            <el-menu-item index="1-2">业主管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-office-building"></i>
              <span>物业管理</span>
            </template>
            <el-menu-item index="2-1">楼栋管理</el-menu-item>
            <el-menu-item index="2-2">房屋管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span>工单管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </el-menu-item>
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
              <el-button type="primary" icon="el-icon-user" @click="manageStaff">管理物业人员</el-button>
              <el-button type="success" icon="el-icon-office-building">楼栋管理</el-button>
              <el-button type="warning" icon="el-icon-document">工单管理</el-button>
            </div>
          </el-card>

          <el-card class="box-card" style="margin-top: 20px;">
            <template #header>
              <div class="clearfix">
                <span>系统概览</span>
              </div>
            </template>
            <div class="stats-container">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-title">物业人员</div>
                    <div class="stat-value">25</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-title">楼栋数量</div>
                    <div class="stat-value">8</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-title">待处理工单</div>
                    <div class="stat-value">12</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-title">系统消息</div>
                    <div class="stat-value">3</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </main>
    </div>

    <!-- 页脚 -->
    <footer class="admin-footer">
      <div class="footer-content">
        <p>© 2023 管理系统 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: 'AdminDashboard',
  computed: {
    store() {
      return store
    }
  },
  data() {
    return {
      user: store.state.user
    };
  },
  methods: {
    manageStaff() {
      // 管理物业人员的逻辑
      console.log('管理物业人员');
    }
  }
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}

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

.admin-main {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 220px;
  background-color: #545c64;
}

.el-menu-vertical {
  border-right: none;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 10px 0;
}

.box-card {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.admin-footer {
  height: 50px;
  background-color: #eef1f6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}
</style>