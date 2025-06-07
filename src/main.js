import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router  from "../src/router";
import store from './store'
const app=createApp(App).use(store)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount("#app")
