<template>
  <el-container class="index">
    <el-aside class="left" width="200px">
      <!-- 左侧导航 -->
      <!-- 1.background-color 背景颜色 
          2.router 开启路由模式,index 是你想要跳转的路径
          3.unique-opened 保持只有一个子菜单展开
      -->

      <el-menu
        class="el-menu-vertical-demo"
        background-color="#20222a"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <el-menu-item index="/">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>系统设置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/menu">菜单管理</el-menu-item>
            <el-menu-item index="/role">角色管理</el-menu-item>
            <el-menu-item index="/manage">管理员管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>商城管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/cate">商品分类</el-menu-item>
            <el-menu-item index="/specs">商品规格</el-menu-item>
            <el-menu-item index="/goods">商品管理</el-menu-item>
            <el-menu-item index="/member">会员管理</el-menu-item>
            <el-menu-item index="/banner">轮播图管理</el-menu-item>
            <el-menu-item index="/seckill">秒杀活动</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">Header</el-header>
      <el-main class="main">
        <!-- 面包屑 -->
        <el-breadcrumb v-if="$route.name" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 二级路由出口 -->
        <router-view class="con"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    ...mapActions({
      changeUserInfoAction:"changeUserInfoAction"
    }),
    logOut(){
      this.changeUserInfoAction({});
      this.$router.push("/login")
    }
  },
  mounted() {},
};
</script>
<style scoped>
.index {
  height: 100vh;
}
.left {
  background: #20222a;
}
.header {
  background: #b3c0d1;
}
.con {
  padding-top: 20px;
}
.header-con{
  float: right;
}
.header-con h3{
  float: left;
  line-height: 60px;
  font-weight: 400;
}
.header-con .el-button{
  float: left;
  margin-top: 10px;
}
</style>