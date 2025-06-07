<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import axios from "axios";
import {ElLoading, ElMessage,ElMessageBox} from 'element-plus'


const router = useRouter()

const registerForm = ref({
  username: '',
  phone: '',          // 手机号（选填）
  email: '',          // 邮箱（选填）
  password: '',       // 密码
  confirmPassword: '' // 确认密码
})

async function submitRegister() {
  // 验证两次密码是否一致
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  // 验证必填字段
  if (!registerForm.value.username || !registerForm.value.password) {
    ElMessage.error('用户名和密码为必填项')
    return
  }

  // 密码长度验证
  if (registerForm.value.password.length < 6) {
    ElMessage.error('密码长度不能少于6位')
    return
  }

  try {
    // 准备请求数据
    const requestData = {
      username: registerForm.value.username,
      password: registerForm.value.password,
      phone: registerForm.value.phone || null, // 选填字段设为null
      email: registerForm.value.email || null   // 选填字段设为null
    }

    // 显示加载状态
    const loading = ElLoading.service({
      lock: true,
      text: '提交中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 发送POST请求
    const response = await axios.post('http://localhost:8085/PropertySign', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 关闭加载状态
    loading.close()

    // 处理响应
    if (response.data && response.data.success) {
      // 显示成功消息
      console.log('添加物业人员成功,id为', response.data?.userid)

      // 创建确认弹窗
      ElMessageBox.confirm(
          `添加物业人员成功, ID为: ${response.data?.userid}`,
          '操作成功',
          {
            confirmButtonText: '确认',
            showCancelButton: false, // 只显示确认按钮
            type: 'success'
          }
      ).then(() => {
        // 用户点击确认后执行
        // 重置表单
        registerForm.value = {
          username: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
        // 跳转到管理首页
        router.push('/AdminHomepage')
      }).catch(() => {
        // 用户关闭弹窗不做任何操作
      })
    }
  } catch (error) {
    console.error('添加失败:', error)

    // 根据错误类型显示不同提示
    let errorMessage = '添加失败'
    if (error.response) {
      // 服务器返回的错误
      errorMessage = error.response.data?.message ||
          `服务器错误: ${error.response.status}`
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络错误，请检查连接'
    } else {
      // 其他错误
      errorMessage = error.message
    }

    ElMessage.error(errorMessage)
  }
}
</script>

<template>
  <!-- 模板部分保持不变 -->
  <div class="register-container">
    <el-card>
      <el-form label-width="100px">
        <h2>添加物业人员</h2>

        <el-form-item label="用户名" required>
          <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              clearable
          />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input
              v-model="registerForm.phone"
              placeholder="选填"
              clearable
          />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input
              v-model="registerForm.email"
              placeholder="选填"
              clearable
          />
        </el-form-item>

        <el-form-item label="密码" required>
          <el-input
              type="password"
              v-model="registerForm.password"
              show-password
              placeholder="请输入密码(至少6位)"
          />
        </el-form-item>

        <el-form-item label="确认密码" required>
          <el-input
              type="password"
              v-model="registerForm.confirmPassword"
              show-password
              placeholder="请再次输入密码"
          />
        </el-form-item>

        <el-button
            type="primary"
            @click="submitRegister"
            style="width: 100%"
        >
          立即注册
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.register-container {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

h2 {
  margin-bottom: 30px;
  color: #333;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>