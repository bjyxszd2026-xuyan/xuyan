<template>
<div>
  <el-table
    :data="list"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :tree-props="{ children: 'children' }"
  >
    <el-table-column prop="id" label="规格编号" sortable width="180">
    </el-table-column>
    <el-table-column prop="specsname" label="规格名称" sortable width="180">
    </el-table-column>
   
   <el-table-column label="规格属性">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{
            item
          }}</el-tag>
        </template>
      </el-table-column>

    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1" type="primary">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <el-button type="danger" @click="dele(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePageAction"
    >
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
import {reqSpecsDel} from "../../../utils/request"
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "specs/list",
      total: "specs/total",
      size: "specs/size",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",
      reqTotalAction: "specs/reqTotalAction",
      changePageAction: "specs/changePageAction",
    }),
    //编辑
    edit(id){
      this.$emit("edit",id)
    },
    //删除
    dele(id) {
          //点了确定按钮
          reqSpecsDel(id).then(res=>{
            if(res.data.code==200){
              successAlert(res.data.msg)
              this.reqListAction();
            }else{
              warningAlert(res.data.msg)
            }
          })
    },
  },
  mounted() {
    this.reqListAction();
    console.log(this.list)
  },
};
</script>
<style scoped>
</style>