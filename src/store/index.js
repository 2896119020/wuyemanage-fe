import { createStore } from 'vuex'
import axios from 'axios'
import Property from "../entity/Property"
import Owner from "../entity/Owner"
import User from "../entity/User"

export default createStore({
  state: {
    user: null,
    token: '',
    loginError: null
  },

  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user || {},
    authToken: state => state.token,
    loginError: state => state.loginError
  },

  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_LOGIN_ERROR(state, payload) {
      state.loginError = payload
    },
    SET_TOKEN(state, payload) {
      state.token = payload
    }
  },

  // 确保这里是直接定义 actions 对象
  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:8085/login', {
          userID: credentials.username,
          password: credentials.password
        })
            .then(response => {
              const data = response.data
              let userDetails

              switch (data.role.toUpperCase()) {
                case 'PROPERTY':
                  userDetails = Property.fromJavaObject(data.userDetails)
                  break
                case 'OWNER':
                  userDetails = Owner.fromJavaObject(data.userDetails)
                  break
                case 'ADMIN':
                  userDetails = User.fromJavaString(data.userDetails)
                  break
                default:
                  console.warn(`未知角色类型: ${data.role}`)
              }

              commit('SET_USER', {
                ...data,
                userDetails
              })
              resolve(data)
            })
            .catch(error => {
              const errorMessage = error.response?.data?.message ||
                  error.message ||
                  '登录失败，请检查网络'
              commit('SET_LOGIN_ERROR', errorMessage)
              reject(error)
            })
      })
    },

    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', '')
      commit('SET_LOGIN_ERROR', null)
    }
  }
})