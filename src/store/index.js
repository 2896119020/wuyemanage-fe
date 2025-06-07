import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
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
      if (payload) {
        localStorage.setItem('user', JSON.stringify(payload))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_LOGIN_ERROR(state, payload) {
      state.loginError = payload
    },
    SET_TOKEN(state, payload) {
      state.token = payload
      if (payload) {
        localStorage.setItem('token', payload)
      } else {
        localStorage.removeItem('token')
      }
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('http://localhost:8085/login', {
          userID: credentials.username,
          password: credentials.password
        })

        const data = response.data

        if (!data.success) {
          const errorMessage = data.message || '登录失败，请检查用户名和密码'
          commit('SET_LOGIN_ERROR', errorMessage)
          throw new Error(errorMessage)
        }

        // 保存token和用户信息
        commit('SET_TOKEN', data.token || '')

        // 处理不同角色的用户数据
        if (data.role === 'PROPERTY') {
          commit('SET_USER', {
            role: data.role,
            userDetails: data.userDetails
          })
        } else {
          commit('SET_USER', {
            role: data.role,
            userDetails: data.userDetails
          })
        }

        return data

      } catch (error) {
        commit('SET_LOGIN_ERROR', error.message)
        throw error
      }
    },

    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', '')
      commit('SET_LOGIN_ERROR', null)
    },

    // 新增：初始化时从本地存储恢复状态
    initialize({ commit }) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token) commit('SET_TOKEN', token)
      if (user) commit('SET_USER', JSON.parse(user))
    }
  }
})