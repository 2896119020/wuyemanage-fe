
import { createRouter, createWebHistory } from 'vue-router'
import LoginHome from '../views/LoginIndex.vue'

const routes=[
    {
        path:'/',
        name:'loginhome',
        component:LoginHome
    },
    {
        path:'/home',
        name:'home',
        component: () =>import('../views/HomePage.vue')
    }
]

const router =createRouter({
    history: createWebHistory(),
    routes
})
export default router