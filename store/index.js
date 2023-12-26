import { createStore } from 'vuex'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// const store = createStore({
const store = new Vuex.Store({
  state: {
    count: 1,
    histroy: [],
    // 存储我的收藏
    favourite: []

  },
  getters: {

  },
  mutations: {
    SET_HISTROY: (state, histroy) => {
      state.histroy.unshift({ createTime: new Date(), histroy: histroy })
    },
    SET_FAVOURITE: (state, favourite) => {
      state.favourite.unshift(favourite)
    }
  },
  actions: {
    setHistroy({ commit }, histroy) {
      return new Promise(resolve => {
        commit('SET_HISTROY', histroy)
      })
    },
    setFavourite({ commit }, favourite) {
      return new Promise(resolve => {
        commit('SET_FAVOURITE', favourite)
      })
    }
  }
})

export default store;
