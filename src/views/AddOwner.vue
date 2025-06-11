<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {ElMessageBox} from "element-plus";

const router = useRouter()

// 楼号选项
const buildingOptions = ref([
  { value: '1', label: '1号楼' },
  { value: '2', label: '2号楼' },
  { value: '3', label: '3号楼' },
  { value: '4', label: '4号楼' },
  { value: '5', label: '5号楼' },
])

// 门牌号选项（根据楼号动态变化）
const doorOptions = computed(() => {
  if (!registerForm.value.buildingNumber) return []

  return [
    { value: '101', label: '101室' },
    { value: '102', label: '102室' },
    { value: '103', label: '103室' },
    { value: '201', label: '201室' },
    { value: '202', label: '202室' },
    { value: '203', label: '203室' },
    { value: '301', label: '301室' },
    { value: '302', label: '302室' },
    { value: '303', label: '303室' },
    { value: '401', label: '401室' },
    { value: '402', label: '402室' },
    { value: '403', label: '403室' },
    { value: '501', label: '501室' },
    { value: '502', label: '502室' },
    { value: '503', label: '503室' },

  ]
})

// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',          // 手机号（选填）
  email: '',          // 邮箱（选填）
  password: '',       // 密码
  confirmPassword: '', // 确认密码
  buildingNumber: '', // 楼号
  doorNumber: '',     // 门牌号
})

async function submitRegister() {
  // 验证两次密码是否一致
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  // 验证必填字段
  if (!registerForm.value.username || !registerForm.value.password) {
    alert('用户名和密码为必填项')
    return
  }
  if (!registerForm.value.buildingNumber || !registerForm.value.doorNumber) {
    alert('楼号和门牌号为必填项')
    return
  }

  try {
    // 准备提交数据，过滤空的可选字段
    const payload = {
      username: registerForm.value.username,
      password: registerForm.value.password,
      buildingNumber: registerForm.value.buildingNumber,
      doorNumber: registerForm.value.doorNumber,
      ...(registerForm.value.phone && { phone: registerForm.value.phone }),
      ...(registerForm.value.email && { email: registerForm.value.email })
    }

    // 🔥 使用 axios 直接发送 POST 请求到后端接口
    const response = await axios.post('http://localhost:8085/OwnerSign', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 判断响应是否成功
    if (response.data && response.data.success) {
      console.error('添加业主成功,id为', response.data?.userid)
      ElMessageBox.confirm(
          `添加业主成功, ID为: ${response.data?.userid}`,
          '操作成功',
          {
            confirmButtonText: '确认',
            showCancelButton: false, // 只显示确认按钮
            type: 'success'
          }
      )
      // 跳转到管理首页
      router.push('/propertyhomepage')
    } else {
      alert('添加失败: ' + (response.data.message || '未知错误'))
    }
  } catch (error) {
    console.error('注册失败:', error)
    let message = '添加失败，请稍后再试'
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    } else if (error.message) {
      message = error.message
    }
    alert(message)
  }
}
</script>

<template>
  <div class="register-container">
    <el-card>
      <el-form label-width="100px">
        <h2>添加业主</h2>

        <el-form-item label="用户名" required>
          <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              clearable
          />
        </el-form-item>

        <el-form-item label="楼号">
          <el-select
              v-model="registerForm.buildingNumber"
              placeholder="请选择楼号"
              clearable
          >
            <el-option
                v-for="item in buildingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="门牌号">
          <el-select
              v-model="registerForm.doorNumber"
              placeholder="请先选择楼号"
              :disabled="!registerForm.buildingNumber"
              clearable
          >
            <el-option
                v-for="item in doorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
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
              placeholder="请输入密码"
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