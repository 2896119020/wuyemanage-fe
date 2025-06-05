
import { createRouter, createWebHistory } from 'vue-router'
import LoginHome from '../views/LoginIndex.vue'

const routes=[
    {
        path:'/',
        name:'loginhome',
        component:LoginHome
    },
    {
        path:'/adminhomepage',
        name:'adminhomepage',
        component: () =>import('../views/AdminHomePage.vue')
    },
    {
    path:'/ownerhomepage',
        name:'ownerhomepage',
        component:() =>import('../views/OwnerHomePage.vue')
},{
        path:'/propertyhomepage',
        name:'propertyhomepage',
        component:() =>import('../views/PropertyHomePage.vue')
    },{
        path:'/addstaff',
        name:'addstaff',
        component:() =>import('../views/AddStaff.vue')
    },
    {
        path:'/addowner',
        name:'addowner',
        component:() =>import('../views/AddOwner.vue')
    }
]

const router =createRouter({
    history: createWebHistory(),
    routes
})
export default router