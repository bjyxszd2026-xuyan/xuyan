<template>
<div>
    <el-dialog
      :title="info.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isshow"
      @closed="close"
    >
 <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.pid" placeholder="请选择上级菜单" @change="changePid">
            <el-option label="顶级菜单" value="0"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.title"
              :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="form.type == 1">
          <el-select v-model="form.icon" placeholder="请选择上级菜单">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" v-else> 
          <el-select v-model="form.name" placeholder="请选择上级菜单">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="'/' + item.path"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1"
           :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
    <!-- 对话框需要一个变量isshow来控制出现和消失，将数据isshow定义在menu.vue中，传递过来，
    但是dialog需要直接修改这个数据，所以不能传递简单类型，需要传递一个json格式的数据，
    才可以实现父变子变，子变 父变得要求。 -->
</div>
</template>
<script>
import {mapGetters,mapActions} from "vuex"
import {indexRoutes} from "../../../router/index"
import {
  reqMenuAdd,
  reqMenuDetail,
  reqMenuUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
props:["info"],
components:{},
data(){
    return {
    //图标
          icons: [
            "el-icon-s-tools",
            "el-icon-user",
            "el-icon-camera",
            "el-icon-message-solid",
      ],
      //路由
       indexRoutes: indexRoutes,
       form:{
           pid:0,
           title:"",
           icon:"",
           type:1,
           url:"",
           status:1
       }
}
},
computed:{
...mapGetters({
    list:"menu/list"
})
},
methods:{
...mapActions({
    reqListAction:"menu/reqListAction"
}),
//取消
cancel(){
    this.info.isshow=false;
},
close(){
  //添加时，就不处理数据，编辑时，就清除数据
  if(!this.info.isAdd){
    this.empty()
  }
},
//重置
empty(){
     this.form={
           pid:0,
           title:"",
           icon:"",
           type:1,
           url:"",
           status:1
       }
     },
     //点击添加按钮
add(){
     reqMenuAdd(this.form).then(res=>{
        if(res.data.code==200){
          //成功
          successAlert(res.data.msg)

          //数据重置
          this.empty()

          //弹框消失
          this.cancel()

          //list数据要刷新
          this.reqListAction()
        }else{
          warningAlert(res.data.msg)
        }
      });
},
//编辑时获取菜单详情
look(id){
  //发请求
  reqMenuDetail(id).then((res)=>{
     if(res.data.code==200){
       this.form=res.data.list;
       this.form.id=id;
     }else{
        warningAlert(res.data.msg);
     }
  })
},
//修改
  update() {
      reqMenuUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
 //修改pid
changePid(){
    if(this.form.pid==0){
        this.form.type=1
    }else{
        this.form.type=2
    }
},
},
// mounted(){
//     this.reqListAction()
// },
}
</script>
<style scoped>

</style>