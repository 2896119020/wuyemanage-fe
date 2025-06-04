@vue/cli-service
<script setup>
import {ref} from "vue";
import { useRouter } from 'vue-router'
import axios from 'axios';
import User from "../entity/User";  // 或具体路径
import Property from "../entity/Property";
import Owner from "../entity/Owner";
const islogin=ref(true)
const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})
const loginResponse = ref({
  success: false,
  message: '',
  role: null,
  userDetails: null
});
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
function change(){
  islogin.value=!islogin.value
}

async function gohome() {
  try {
    const response = await axios.post('http://localhost:8085/login', {
      userID: loginForm.value.username,
      password: loginForm.value.password
    });

    // 无论 success 是否为 true，都存储返回值
    loginResponse.value = response.data;
    alert("登录成功，返回值："+loginResponse.value.userDetails);

    if (loginResponse.value.success) {
      switch (loginResponse.value.role.toUpperCase()) {
        case 'PROPERTY':
          loginResponse.value.userDetails = Property.fromJavaObject(loginResponse.value.userDetails);
          break;
        case 'OWNER':
          loginResponse.value.userDetails = Owner.fromJavaObject(loginResponse.value.userDetails);
          break;
        case 'ADMIN':
          alert("登录成功，返回值："+loginResponse.value.role);
          loginResponse.value.userDetails = User.fromJavaString(loginResponse.value.userDetails);
          alert("登录成功，返回值：");
          break;
        default:
          console.warn(`未知角色类型: ${loginResponse.value.role}`);
      }

    }




    // 无论返回结果如何，都跳转到 /home
    router.push('/home');
  } catch (error) {
    console.error('请求失败:', error);
    // 即使请求失败，也跳转到 /home
    router.push('/home');
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
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" show-password />
        </el-form-item>
        <el-button type="primary" @click="gohome">登录</el-button>
        <p @click="change">没有账号？注册</p>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else label-width="80px">
        <h1>小区物业管理系统</h1>
        <h2>业主注册</h2>
        <el-form-item label="用户名">
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