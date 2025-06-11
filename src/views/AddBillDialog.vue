<template>
  <el-dialog title="添加水电费账单" v-model="dialogVisible" width="500px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="年份" prop="year">
        <el-input-number v-model="form.year" :min="2000" :max="2100" />
      </el-form-item>

      <el-form-item label="月份" prop="month">
        <el-select v-model="form.month" placeholder="选择月份">
          <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
        </el-select>
      </el-form-item>

      <el-form-item label="楼号" prop="building">
        <el-select v-model="form.building" placeholder="选择楼号">
          <el-option v-for="b in 5" :key="b" :label="`${b}号楼`" :value="b" />
        </el-select>
      </el-form-item>

      <el-form-item label="门牌号" prop="room">
        <el-select v-model="form.room" placeholder="选择门牌号">
          <el-option
              v-for="r in roomNumbers"
              :key="r"
              :label="r"
              :value="r"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="水费" prop="waterFee">
        <el-input-number v-model="form.waterFee" :min="0" :step="0.1" />
      </el-form-item>

      <el-form-item label="电费" prop="electricityFee">
        <el-input-number v-model="form.electricityFee" :min="0" :step="0.1" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
const submitting = ref(false)
const dialogVisible = ref(false)
import { ElMessage } from 'element-plus'
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const roomNumbers = [
  101, 102, 103, 104, 105,
  201, 202, 203, 204, 205,
  301, 302, 303, 304, 305,
  401, 402, 403, 404, 405,
  501, 502, 503
]

const form = ref({
  year: currentYear,
  month: currentMonth,
  building: null,
  room: null,
  waterFee: null,
  electricityFee: null
})

const rules = {
  year: [{ required: true, message: '请输入年份', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  building: [{ required: true, message: '请选择楼号', trigger: 'change' }],
  room: [{ required: true, message: '请选择门牌号', trigger: 'change' }],
  waterFee: [{ required: true, message: '请输入水费', trigger: 'blur' }],
  electricityFee: [{ required: true, message: '请输入电费', trigger: 'blur' }]
}

const formRef = ref()

const submitForm = async () => {
  try {
    submitting.value = true

    // 构造完全匹配后端的请求数据
    const requestData = {
      buildingNumber: form.value.building, // 注意字段名
      doorNumber: form.value.room,        // 前端room对应后端doorNumber
      yearMonth: `${form.value.year}-${String(form.value.month).padStart(2, '0')}`, // 格式化为"2025-06"
      waterFee: String(form.value.waterFee), // 转换为字符串让Spring自动转BigDecimal
      electricityFee: String(form.value.electricityFee)
    }

    const response = await axios.post('/api/addBillRequest', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data) {
      ElMessage.success('添加成功')
      dialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error(`提交失败: ${error.response?.data?.message || error.message}`)
    console.error('完整错误:', error.response)
  } finally {
    submitting.value = false
  }
}

// 打开对话框的函数可导出或在外部控制
function openDialog() {
  dialogVisible.value = true
}

defineExpose({ openDialog })

</script>
