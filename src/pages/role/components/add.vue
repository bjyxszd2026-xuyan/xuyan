<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <!-- 树形控件 -->
        <!-- data要展示的数组 -->
        <!-- props 配置 ：children 用来判断是否有下一层的字段；label用来展示在页面中的字段 -->
        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="{children: 'children',label: 'title',}"
          >
          </el-tree>
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
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
     form: {
        rolename:"",
        menus:'[]',
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      //菜单list
      menuList: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      //请求菜单list
      reqMenuListAction: "menu/reqListAction",
      //角色的list
      reqRoleList:"role/reqListAction"
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
        rolename:"",
        menus:'[]',
        status: 1,
      };
      //树形控件设置值
      this.$refs.tree.setCheckedKeys([])
    },
   
    //点击了添加按钮
    add() {
      ////树形控件取值 this.$refs.tree.getCheckedKeys()
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);

          //数据重置
          this.empty();

          //弹框消失
          this.cancel();

          //list数据要刷新
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqRoleDetail(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          this.form = res.data.list;
          this.form.id=id
          //给树形控件赋值
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus))
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //如果菜单list没有请求过，就请求一下，如果请求过了，就不用请求了
    if(this.menuList.length==0){
      this.reqMenuListAction()
    }
  },
};
</script>
<style scoped>
</style>