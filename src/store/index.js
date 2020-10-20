import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import {state,mutations,getters}from "./mutations"
import {actions}from "./actions"
import menu from "./moudels/menu"
import role from "./moudels/role"
import manage from "./moudels/manage"
import cate from "./moudels/cate"
import specs from "./moudels/specs"
import goods from "./moudels/goods"
import member from"./moudels/member"
import banner from "./moudels/banner"
import seckill from "./moudels/seckill"

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        menu,
        role,
        manage, 
        cate,
        specs,
        goods,
        member,
        banner,
        seckill
    }
})