<template>
<div>
    <el-dialog
      :title="info.isAdd ? '添加商品规格' : '编辑商品规格'"
      :visible.sync="info.isshow"
      @closed="close"
    >
 <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

     <el-form-item
          label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
        >
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index == 0" @click="addAttr"
              >新增规格属性</el-button
            >
            <el-button type="danger" v-else @click="del(index)">删除</el-button>
          </div>
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
    
</div>
</template>
<script>
import {mapGetters,mapActions} from "vuex"

import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
props:["info"],
components:{},
data(){
    return {
      //规格和属性数组
      attrArr: [{ value: "" }, { value: "" }],
       form:{
          specsname:"",
          attrs:"",
          status:1,
       }
}
},
computed:{
...mapGetters({
})
},
methods:{
...mapActions({
    reqListAction:"specs/reqListAction",
    reqTotalAction:"specs/reqTotalAction"
}),
//新增规格属性
addAttr(){
  this.attrArr.push({value:""})
},
dele(index){
  this.attrArr.splice(index,1)
},
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
    this.attrArr=[{ value: "" }, { value: "" }],
     this.form={
         specsname:"",
          attrs:"",
          status:1,
       }
     },

//验证数据合格
checkedDate(){
  if(this.form.specsname==""){
    warningAlert("规格名称不能为空")
    return false
  }
  //验证属性值不为空
 if(this.attrArr.some((item) =>item.value=="")){
    warningAlert("属性值不能为空");
    return false;
  }
  return true
},



     //点击添加按钮
add(){
    if(!this.checkedDate()){
      return;
    }
   this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
     reqSpecsAdd(this.form).then(res=>{
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
  reqSpecsDetail(id).then((res)=>{
     if(res.data.code==200){
       this.form=res.data.list[0];
       this.form.id=id;
     }else{
        warningAlert(res.data.msg);
     }
  })
},
//修改
  update() {
    if(!this.checkedDate()){
      return;
    }
    this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsUpdate(this.form).then((res) => {
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
},
mounted(){
    
},
}
</script>
<style scoped>
.con{
  display: flex;
}
.input-wrap{
  flex:1;
}

</style>