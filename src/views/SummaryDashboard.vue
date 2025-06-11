<template>
  <div class="p-4 mx-auto" style="max-height: 200px;">
    <div
        class="grid gap-3 justify-center"
        :class="{
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': true
      }"
    >
      <template v-for="(item, index) in cards" :key="index">
        <!-- 普通卡片 -->
        <el-card class="summary-card w-full" style="max-height: 180px;" shadow="hover">
          <template #header>
            <h3 class="card-header">{{ item.label }}</h3>
          </template>
          <div class="card-value">{{ item.value }}</div>
        </el-card>

        <!-- 楼栋业主数柱状图（插入在业主总数后） -->
        <template v-if="index === 0">
          <el-card class="summary-card w-full col-span-full" shadow="hover" style="padding: 24px;">
            <template #header>
              <h3 class="card-header">1-5号楼业主数</h3>
            </template>
            <v-chart :option="ownerPerBuildingOption" autoresize style="height: 320px;" />
          </el-card>
        </template>

        <!-- 室内报修数柱状图（插入在室外报修数后） -->
        <template v-if="index === 2">
          <el-card class="summary-card w-full col-span-full" shadow="hover" style="padding: 24px;">
            <template #header>
              <h3 class="card-header">各楼栋室内报修数</h3>
            </template>
            <v-chart :option="indoorRepairOption" autoresize style="height: 320px;" />
          </el-card>
        </template>

        <!-- 评分饼图（插入在已评价报修数后） -->
        <template v-if="index === 6">
          <el-card class="summary-card w-full col-span-full" shadow="hover" style="padding: 24px;">
            <template #header>
              <h3 class="card-header">报修评分分布</h3>
            </template>
            <v-chart :option="ratingPieOption" autoresize style="height: 320px;" />
          </el-card>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 引入 ECharts
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const summary = ref({
  totalOwners: 0,
  ownersPerBuilding: [],
  totalRepairs: 0,
  publicAreaRepairs: 0,
  indoorRepairsPerBuilding: [],
  processedRepairs: 0,
  averageProcessingHours: 0,
  ratedRepairs: 0,
  repairsByRating: [],
  totalWaterFee: 0,
  totalElectricityFee: 0,
  paymentRate: 0,
  averagePaymentDays: 0
})

const fetchSummary = async () => {
  try {
    const res = await axios.get('/api/getSummary') // 替换成实际 API
    summary.value = res.data
  } catch (err) {
    console.error('获取 summary 数据失败:', err)
  }
}

onMounted(fetchSummary)

const cards = computed(() => [
  { label: '业主总数', value: `${summary.value.totalOwners} 人` },
  { label: '报修总数', value: `${summary.value.totalRepairs} 项` },
  { label: '室外报修数', value: `${summary.value.publicAreaRepairs} 项` },
  { label: '已处理报修', value: `${summary.value.processedRepairs} 项` },
  { label: '平均处理时长', value: `${summary.value.averageProcessingHours.toFixed(1)} 小时` },
  { label: '已评价报修数', value: `${summary.value.ratedRepairs} 项` },
  { label: '总水费', value: `${summary.value.totalWaterFee.toFixed(2)} 元` },
  { label: '总电费', value: `${summary.value.totalElectricityFee.toFixed(2)} 元` },
  { label: '缴费率', value: `${summary.value.paymentRate.toFixed(2)} %` },
  { label: '平均缴费天数', value: `${summary.value.averagePaymentDays.toFixed(1)} 天` }
])

const ownerPerBuildingOption = computed(() => ({
  title: { text: '1-5号楼业主数' },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: summary.value.ownersPerBuilding.map((_, i) => `${i + 1}号楼`)
  },
  yAxis: { type: 'value' },
  series: [{
    name: '业主数',
    type: 'bar',
    data: summary.value.ownersPerBuilding,
    itemStyle: { color: '#67C23A' }
  }]
}))

const indoorRepairOption = computed(() => ({
  title: { text: '室内报修数（按楼）' },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: summary.value.indoorRepairsPerBuilding.map((_, i) => `${i + 1}号楼`)
  },
  yAxis: { type: 'value' },
  series: [{
    name: '报修数',
    type: 'bar',
    data: summary.value.indoorRepairsPerBuilding,
    itemStyle: { color: '#409EFF' }
  }]
}))

const ratingPieOption = computed(() => ({
  title: { text: '报修评分分布', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, left: 'center' },
  series: [
    {
      name: '评分',
      type: 'pie',
      radius: '50%',
      data: summary.value.repairsByRating.map((count, i) => ({
        value: count,
        name: `${i + 1}星`
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))
</script>

<style scoped>
.summary-card {
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
  user-select: none;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(64, 158, 255, 0.25);
}

.card-header {
  font-weight: 700;
  font-size: 1rem;
  color: #303133;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 500;
  color: #409EFF;
  margin-top: 12px;
}

/* 如果没用 Tailwind，则加上 */
.col-span-full {
  grid-column: 1 / -1;
}
</style>
