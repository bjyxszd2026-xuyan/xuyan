<template>
  <div>
    <!-- 表格 -->
    <v-list @edit="edit"></v-list>

    <!-- 添加组件 -->
    <v-update :info="info" ref="add"></v-update>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vUpdate from "./components/update";
export default {
  props: [],
  components: {
    vList,
    vUpdate,
  },
  data() {
    return {
      //传递给add的数据
      info: {
        //添加弹框的状态
        isshow: false,
        //添加还是编辑的状态 true添加 ，false 编辑
        isAdd:true
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //编辑
    edit(id){
      this.info.isshow=true;
      this.info.isAdd=false;
      //让add组件发起获取详情的请求
      this.$refs.add.look(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>