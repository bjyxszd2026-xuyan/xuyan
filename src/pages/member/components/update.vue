<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加会员' : '编辑会员'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
         <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
          留空则不修改
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMemberList,
  reqMemberDetail,
  reqMemberUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
     form: {
        uid:"",
        nickname:"",
        phone:"",
        password:"",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      //菜单list
      List: "member/list",
    }),
  },
  methods: {
    ...mapActions({
      //请求菜单list
      reqListAction: "member/reqListAction",
    }),
    //取消
    cancel() {
      this.info.isshow = false;
    },
    //弹框消失完成
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //数据重置
    empty() {
      this.form = {
        uid:"",
        nickname:"",
        phone:"",
        password:"",
        status: 1,
      };
    },
   
    //获取菜单详情 （1条）
    look(uid) {
      //发请求
      reqMemberDetail(uid).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          this.form = res.data.list;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      reqMemberUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
           this.reqListAction()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {

  },
};
</script>
<style scoped>
</style>