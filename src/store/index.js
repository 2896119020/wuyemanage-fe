import { createStore } from 'vuex'
import axios from 'axios'


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
              const data = response.data;
              alert(data.userDetails.username)
              // 如果登录失败
              if (!data.success) {
                const errorMessage = data.message || '登录失败，请检查用户名和密码';
                commit('SET_LOGIN_ERROR', errorMessage);
                return reject(new Error(errorMessage)); // 主动 reject
              }

              // 登录成功时处理数据
              const { role, userDetails } = data;
              commit('SET_USER', { role, userDetails });
              resolve(data);
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