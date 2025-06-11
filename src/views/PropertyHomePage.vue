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
            default-active="1-0"
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
            <el-menu-item index="1-0">首页</el-menu-item>
            <el-menu-item index="1-1">公告管理</el-menu-item>
            <el-menu-item index="1-2">数据汇总</el-menu-item>
            <el-menu-item index="1-3">报修处理</el-menu-item>
            <el-menu-item index="1-4">个人信息</el-menu-item>
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
                <el-button type="primary" icon="el-icon-user" @click="handleAddBill">
                  添加水电费账单
                </el-button>
                <AddBillDialog ref="addBillRef" />
              </div>
            </el-card>
          </div>




          <el-dialog title="报修详情" v-model="repairDetailDialogVisible" width="50%">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="描述">{{ repairDetail.description }}</el-descriptions-item>
              <el-descriptions-item label="地点类型">{{ repairDetail.locationType }}</el-descriptions-item>
              <el-descriptions-item label="具体位置">{{ repairDetail.specificLocation }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ repairDetail.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <div v-if="repairDetail.status === '待处理'">
                  <el-tag type="warning">待处理</el-tag>
                  <el-button
                      type="primary"
                      size="small"
                      @click="handleRepair"
                      style="margin-left: 10px;"
                  >
                    点击处理完成
                  </el-button>
                </div>
                <div v-else-if="repairDetail.status === '已处理'">
                  <el-tag type="success">已处理</el-tag>
                </div>
                <div v-else-if="repairDetail.status === '已评价'">
                  <el-tag type="info">已评价</el-tag>
                </div>
                <div v-else>
                  <el-tag>{{ repairDetail.status }}</el-tag>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="评价">


                {{repairDetail.rating !== null ? repairDetail.rating + '⭐':'暂无评价'}}

              </el-descriptions-item>
              <el-descriptions-item label="处理人ID">{{ repairDetail.handlerId ?? '暂无' }}</el-descriptions-item>
              <el-descriptions-item label="图片">
                <img v-if="repairDetail.imageUrl" :src="repairDetail.imageUrl" alt="报修图片" style="max-width: 100%;" />
                <span v-else>无图片</span>
              </el-descriptions-item>
            </el-descriptions>

            <template #footer>
              <el-button @click="repairDetailDialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>

          <!-- 数据汇总内容 -->
          <div v-show="activeMenu === '1-2'">
            <SummaryDashboard />
          </div>

          <!-- 公告管理内容 -->
          <div v-show="activeMenu === '1-1'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>公告管理</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="addNotice">添加公告</el-button>
                </div>
              </template>
              <el-table :data="noticeData" style="width: 100%" height="400">
                <el-table-column prop="title" label="标题(点击查看详细)" width="180">
                  <template #default="scope">
                    <el-link type="primary" @click="showDetail(scope.row.content)">
                      {{ scope.row.title }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="name" label="发布人"></el-table-column>
                <el-table-column prop="date" label="发布日期" width="180"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>

          <!-- 水电费管理内容 -->
          <el-dialog title="详细内容" v-model="detailDialogVisible" width="30%">
            <span>{{ detailContent }}</span>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
            </template>
          </el-dialog>

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

          <!-- 报修处理内容 -->

          <div v-show="activeMenu === '1-4'">
            <el-card class="box-card">
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
          <div v-show="activeMenu === '1-3'">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>报修处理</span>

                </div>
              </template>
              <el-table :data="repairData" style="width: 100%" height="400">
                <el-table-column prop="description" label="描述（点击查看详细）">
                  <template #default="scope">
                    <el-link type="primary" @click="fetchRepairDetail(scope.row.id)">
                      {{ scope.row.description }}
                    </el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="status" label="处理状态">
                  <template #default="scope">
                    <el-tag
                        :type="scope.row.status === 'PENDING' ? 'warning' :
             scope.row.status === 'PROCESSED' ? 'success' : 'info'"
                    >
                      {{ mapStatus(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="evaluation" label="评价"></el-table-column>
                <el-table-column prop="time" label="时间" width="180"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </main>
    </div>

    <!-- 添加公告对话框 -->
    <el-dialog title="添加公告" v-model="addDialogVisible" width="500px" @close="resetAddForm">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addForm.content" :rows="4"></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm">确定</el-button>
        </span>
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
import { ref } from 'vue'
import axios from "axios";
import AddBillDialog from './AddBillDialog.vue'
import SummaryDashboard from './SummaryDashboard.vue'

export default {
  components: {
    AddBillDialog,
    SummaryDashboard
  },
  setup() {
    const addBillRef = ref(null)

    const handleAddBill = () => {
      if (addBillRef.value) {
        addBillRef.value.openDialog()
      }
    }

    return {
      addBillRef,
      handleAddBill
    }
  },
  name: 'AdminDashboard',
  data() {
    return {
      activeMenu: 'home',
      currentTitle: '首页',
      repairDetailDialogVisible: false,
      noticeData: [],
      editDialogVisible: false,
      editForm: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phoneNumber: "",
      },
      repairDetail: {
        description: '',
        locationType: '',
        specificLocation: '',
        createdAt: '',
        status: '',
        rating: null,
        handlerId: null,
        imageUrl: ''
      },
      addDialogVisible: false,
      detailDialogVisible: false,
      detailContent: '',
      repairData: [],
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
    },
    user() {
      return store.state.user?.userDetails?.user || {};
    },
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
    },
    openEditDialog() {
      this.editForm.username = this.user.username || "";
      this.editForm.password = "";
      this.editForm.confirmPassword = "";
      this.editForm.email = this.user.email || "";
      this.editForm.phoneNumber = this.user.phoneNumber || "";
      this.editDialogVisible = true;
    },
    startRating() {
      this.isRating = true;
      this.ratingValue = 0;
    },
    async handleRepair() {
      try {
        // 调用后端接口处理报修
        const response = await axios.post('/api/handRepair', {
          id: this.repairDetail.id,
          handlerId:this.userId
        });

        if (response.data) {
          this.$message.success('处理成功');
          // 更新状态为"已处理"
          this.repairDetail.status = '已处理';

          // 更新列表中的状态
          const index = this.repairData.findIndex(item => item.id === this.repairDetail.id);
          if (index !== -1) {
            this.repairData[index].status = 'PROCESSED'; // 根据实际后端返回的值调整
          }
        } else {
          this.$message.error('处理失败');
        }
      } catch (error) {
        this.$message.error('处理请求失败');
        console.error(error);
      }
    },
    async submitAddForm() {
      this.addDialogVisible = true;
      this.addForm.uploaderId = this.userId;
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          try {
            const res = await axios.post('/api/createAnnouncement', this.addForm, {
              headers: { 'Content-Type': 'application/json' }
            });
            if (res.data === true) {
              this.$message.success('公告添加成功');
              this.addDialogVisible = false;
              this.fetchAnnouncements();
              this.resetAddForm();
            } else {
              this.$message.error('公告添加失败');
            }
          } catch (error) {
            this.$message.error('请求出错');
            console.error(error);
          }
        } else {
          this.$message.warning('请填写完整信息');
        }
      });
    },
    async submitRating() {
      if (this.ratingValue === 0) {
        this.$message.warning('请选择评分');
        return;
      }

      try {
        const response = await axios.post('/api/rateRepair', {
          id: this.repairDetail.id,  // 对应后端的id字段
          rating: this.ratingValue   // 对应后端的rating字段
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data) {
          this.$message.success('评分成功');
          this.repairDetail.rating = this.ratingValue;
          this.repairDetail.status = '已评价';
          this.isRating = false;

          // 更新列表中的状态
          const index = this.repairData.findIndex(item => item.id === this.repairDetail.id);
          if (index !== -1) {
            this.repairData[index].status = 'rated';
            this.repairData[index].evaluation = `已评分(${this.ratingValue}星)`;
          }
        } else {
          this.$message.error('评分失败');
        }
      } catch (error) {
        this.$message.error('评分请求失败');
        console.error(error);
      }
    },
    mapStatus(status) {
      switch (status) {
        case 'pending': return '待处理';
        case 'processed': return '已处理';
        case 'rated': return '已评价';
        case 'PROCESSED': return '已处理';
        default: return status;
      }
    },

    async fetchRepairDetail(id) {
      try {
        const response = await axios.post('/api/findRepairById', id, {
          headers: { 'Content-Type': 'application/json' }
        });

        const data = response.data;

        let imageUrl = '';
        if (data.image) {
          const byteCharacters = atob(data.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          imageUrl = URL.createObjectURL(blob);
        }

        this.repairDetail = {
          id: data.id,  // 确保这里获取了正确的id
          description: data.description,
          locationType: data.locationType === 'INDOOR' ? '室内' : '公共区域',
          specificLocation: data.specificLocation,
          createdAt: this.formatTime(data.createdAt),
          status: this.mapStatus(data.status),
          rating: data.rating,
          handlerId: data.handlerId,
          imageUrl
        };

        this.isRating = false;
        this.ratingValue = 0;
        this.repairDetailDialogVisible = true;
      } catch (error) {
        this.$message.error('获取报修详情失败');
        console.error(error);
      }
    }


    ,

    handleMenuSelect(index) {
      this.activeMenu = index;
      switch (index) {
        case '1-1':
          this.currentTitle = '公告查看';
          this.fetchAnnouncements();
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
          });
          break;
        case '1-0':
          this.activeMenu = 'home';
          this.currentTitle = '首页';

          break;
        case '1-3':
          this.currentTitle = '报修处理';
          this.fetchRepairs();
          break;
        case '1-2':
          this.currentTitle = '数据汇总';

          break;
        case '1-4':
          this.currentTitle = '个人信息';
          break;
        default:
          this.currentTitle = '首页';
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
    async fetchRepairs() {
      try {
        const userId = this.userId;
        if (!userId) {
          this.$message.error("用户ID未找到");
          return;
        }

        const response = await axios.post('/api/findRepairListByCreatorId', userId, {
          headers: { 'Content-Type': 'application/json' }
        });

        this.repairData = response.data.map(item => ({
          id: item.id,
          description: item.description,
          status: item.status,
          evaluation: item.rating !== null ? item.rating + '⭐' : '暂无评价',
          time: this.formatTime(item.createdAt)
        }));

        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      } catch (error) {
        this.$message.error('报修信息获取失败，请稍后重试');
        console.error(error);
      }
    }
    ,
    showDetail(content) {
      this.detailContent = content;
      this.detailDialogVisible = true;
    },
    formatTime(rawTime) {
      if (!rawTime) return '无时间';
      // 将 "yyyy-MM-dd HH:mm:ss" -> "yyyy-MM-ddTHH:mm:ss"（使其能被 Date 正确识别）
      const parsedTime = rawTime.replace(' ', 'T');
      const date = new Date(parsedTime);
      if (isNaN(date.getTime())) return '无效时间';
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    addNotice() {
      this.addDialogVisible = true;
    },
    resetAddForm() {
      this.$refs.addForm.resetFields();
    },
    resetForm() {
      this.$refs.repairForm.resetFields();
      this.imageFileList = [];
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
    },
    handleImageChange(file, fileList) {
      this.imageFileList = fileList.slice(-1); // 只保留一张
    },
    handleImageRemove(file, fileList) {
      this.imageFileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url;
      this.imagePreviewVisible = true;
    },
    submitRepair() {
      this.$refs.repairForm.validate(async valid => {
        if (!valid) return;

        const formData = new FormData();
        formData.append('description', this.addForm.description);
        formData.append('locationType', this.addForm.locationType);
        formData.append('specificLocation', this.addForm.specificLocation);
        const userId = store.state.user?.userDetails?.ownerID;
        if (!userId) {
          this.$message.error("未获取到用户ID，无法提交");
          return;
        }
        formData.append('creatorId', userId);

        if (this.imageFileList.length > 0) {
          formData.append('image', this.imageFileList[0].raw);
        }
        console.log('提交的维修请求数据:', this.addForm);
        console.log('提交的维修请求数据:', userId);

        try {
          this.submitting = true;
          await this.$axios.post('/api/createRepair', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.$message.success('报修提交成功');
          this.addDialogVisible = false;
          // 重置表单及图片等
        } catch (error) {
          console.error(error);
          this.$message.error('提交失败，请填写完整信息');
        } finally {
          this.submitting = false;
        }
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
