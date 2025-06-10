// ✅ 开发模式下屏蔽 ResizeObserver 报错（放最顶部）
if (process.env.NODE_ENV === 'development') {
    const observerErr = /ResizeObserver loop limit exceeded/;
    const originalError = console.error;
    console.error = function (message, ...args) {
        if (observerErr.test(message)) return;
        originalError.call(console, message, ...args);
    };
}

// 🚀 正常引入项目核心依赖
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '../src/router'
import store from './store'
import axios from 'axios';

// ⚙️ 创建并挂载 Vue 应用
const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
