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
            default-active="1-1"
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleMenuSelect">
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>人员管理</span>
            </template>
            <el-menu-item index="1-1">公告管理</el-menu-item>
            <el-menu-item index="1-2">水电费管理</el-menu-item>
            <el-menu-item index="1-3">报修处理</el-menu-item>
            <el-menu-item index="1-4">更改个人信息</el-menu-item>
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
          <h2>{{ currentTitle }}</h2>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="content-main">
          <!-- 首页内容 -->
          <div v-if="activeMenu === 'home'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>快捷操作</span>
                </div>
              </template>
              <div class="quick-actions">
                <el-button type="primary" icon="el-icon-user" @click="addowner">
                  添加住户
                </el-button>
              </div>
            </el-card>
          </div>

          <!-- 公告管理内容 -->
          <div v-if="activeMenu === '1-1'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>公告管理</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="addNotice">添加公告</el-button>
                </div>
              </template>
              <el-table :data="noticeData" style="width: 100%">
                <el-table-column prop="title" label="标题" width="180"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="date" label="发布日期" width="180"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>

          <!-- 水电费管理内容 -->
          <div v-if="activeMenu === '1-2'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>水电费管理</span>
                </div>
              </template>
              <div>水电费管理内容将在这里显示</div>
            </el-card>
          </div>

          <!-- 报修处理内容 -->
          <div v-if="activeMenu === '1-3'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>报修处理</span>
                </div>
              </template>
              <div>报修处理内容将在这里显示</div>
            </el-card>
          </div>
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
  data() {
    return {
      activeMenu: 'home', // 当前激活的菜单项
      currentTitle: '欢迎使用管理系统', // 当前标题
      noticeData: [
        {
          title: '停水通知',
          content: '明天上午9点至下午3点进行水管维修，届时将暂停供水',
          date: '2023-05-10'
        },
        {
          title: '物业费缴纳',
          content: '请各位业主于本月15日前缴纳第二季度物业费',
          date: '2023-05-05'
        }
      ]
    }
  },
  computed: {
    userName() {
      return store.state.user?.userDetails?.user?.username || '未登录用户'
    }
  },
  methods: {
    addowner() {
      this.$router.push('/addowner')
    },
    handleMenuSelect(index) {
      this.activeMenu = index;
      // 根据选择的菜单更新标题
      switch(index) {
        case '1-1':
          this.currentTitle = '公告管理';
          break;
        case '1-2':
          this.currentTitle = '水电费管理';
          break;
        case '1-3':
          this.currentTitle = '报修处理';
          break;
        case '1-4':
          this.currentTitle = '更改个人信息';
          break;
        default:
          this.currentTitle = '欢迎使用管理系统';
      }
    },
    addNotice() {
      // 添加公告的逻辑
      this.$message.success('添加公告功能待实现');
    },
    handleEdit(index, row) {
      // 编辑公告的逻辑
      this.$message.success(`正在编辑公告: ${row.title}`);
    }
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
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
  min-height: calc(100vh - 110px);
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

.admin-footer {
  height: 50px;
  background-color: #eef1f6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

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