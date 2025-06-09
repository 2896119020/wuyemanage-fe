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
            <el-menu-item index="1-1">公告查看</el-menu-item>
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
          <div v-show="activeMenu === 'home'">
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
          <div v-show="activeMenu === '1-1'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>公告查看</span>

                </div>
              </template>
              <el-table :data="noticeData" style="width: 100%" height="400">
                <el-table-column prop="title" label="标题" width="180"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="name" label="发布人"></el-table-column>
                <el-table-column prop="date" label="发布日期" width="180"></el-table-column>



              </el-table>
            </el-card>
          </div>

          <!-- 水电费管理内容 -->
          <div v-show="activeMenu === '1-2'">
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
          <div v-show="activeMenu === '1-3'">
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
import axios from "axios";

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeMenu: 'home',
      currentTitle: '欢迎使用管理系统',
      noticeData: [],
      addDialogVisible: false,
      addForm: {
        title: '',
        content: '',
        uploaderId:null

      },
      addRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    userName() {
      return store.state.user?.userDetails?.user?.username || '未登录用户';
    },
    userId() {
      return store.state.user?.userDetails?.propertyID;
    }
  },
  mounted() {
    this.fetchAnnouncements();
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // 在 created 或 mounted 中赋值
    this.addForm.uploaderId = this.userId;
  },
  methods: {
    addowner() {
      this.$router.push('/addowner');
    },
    handleMenuSelect(index) {
      this.activeMenu = index;
      switch(index) {
        case '1-1':
          this.currentTitle = '公告查看';
          this.fetchAnnouncements();
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
          });
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
    async fetchAnnouncements() {
      try {
        const response = await axios.post('/api/getAnnouncementList');
        this.noticeData = response.data.map(item => ({
          id: item.announcementId,
          title: item.title,
          content: item.content,
          name: item.uploaderName,
          date: new Date(item.uploadTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      } catch (error) {
        this.$message.error('公告获取失败，请稍后重试');
        console.error(error);
      }
    },
    addNotice() {
      this.addDialogVisible = true;
    },
    resetAddForm() {
      this.$refs.addForm.resetFields();
    },
    handleEdit(index, row) {
      this.$confirm(`确定要删除公告「${row.title}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await axios.post('/api/deleteAnnouncement', { id: row.id }, {
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.data === true) {
            this.$message.success('删除成功');
            this.fetchAnnouncements();
          } else {
            this.$message.error('删除失败，请稍后再试');
          }
        } catch (error) {
          this.$message.error('请求失败');
          console.error(error);
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
}
</script>

<style scoped>
/* 样式内容与你提供的完全一致 */
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
/* ...其余样式略 */

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
