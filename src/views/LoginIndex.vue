@vue/cli-service
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const islogin = ref(true)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function change() {
  islogin.value = !islogin.value
}

async function handleLogin() {
  try {
    await store.dispatch('login', loginForm.value)
    // 登录成功后根据角色跳转不同页面
    const role = store.state.user?.role?.toUpperCase()
    if (role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else if (role === 'PROPERTY') {
      router.push('/property')
    } else {
      router.push('/home')
    }
  } catch (error) {
    // 错误信息已经在store中，可以通过store.state.loginError获取
    alert('登录失败: ' + (store.state.loginError || '未知错误'))
  }
}
</script>

<template>

  <div class="login-container">

    <el-card>
      <!-- 登录表单 -->
      <el-form v-if="islogin" label-width="80px">
        <h1>小区物业管理系统</h1>
        <h2>登录</h2>
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" show-password />
        </el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <p @click="change">没有账号？注册</p>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else label-width="80px">
        <h1>小区物业管理系统</h1>
        <h2>业主注册</h2>
        <el-form-item label="账号">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="楼栋号">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="单元号">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="registerForm.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="registerForm.confirmPassword" show-password />
        </el-form-item>
        <el-button type="primary" @click="submitRegister">注册</el-button>
        <p @click="change">已有账号？登录</p>
      </el-form>
      </el-card>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.login-container {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}
</style>