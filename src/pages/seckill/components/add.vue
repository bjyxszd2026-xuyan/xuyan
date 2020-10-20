<template>
  <div class="add">
    <el-dialog :title="info.isAdd ? '添加活动' : '编辑活动'" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              v-model="times"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change=" changeFirstCateList">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeSecondCateList">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="form.goodsid" >
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqSeckillAdd,
  reqSeckillDetail,
  reqSeckillUpdate,
  reqCateList,
  reqGoodsList
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
    //二级分类
      secondCateList: [],
      //商品列表
      goodsList: [],
      times: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      //秒杀活动列表
      reqListAction: "seckill/reqListAction",
      //商品分类列表
      reqCateListAction: "cate/reqListAction"
    }),
    cancel() {
      this.info.isshow = false;
    },
    add() {
      reqSeckillAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.info.isshow = false;
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    empty() {
      this.times = [];
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
    },
    look(id) {
      reqSeckillDetail(id).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;

          // 将获取到的时间戳生成事件对象赋值给time，既而可以展示到form表单上
          this.times.push(new Date(Number(this.form.begintime)));
          this.times.push(new Date(Number(this.form.endtime)));
          // console.log(111,this.times);

          // 获取二级分类列表
          reqCateList({ pid: this.form.first_cateid }).then(res => {
            this.secondCateList = res.data.list;
          });
          // 获取对应分类的商品列表
          reqGoodsList({
            fid: this.form.first_cateid,
            sid: this.form.second_cateid
          }).then(res => {
            this.goodsList = res.data.list;
          });
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      console.log(333, this.form);

      reqSeckillUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.info.isshow = false;
          this.empty();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    changeTime(e) {
      // console.log(1,e,typeof e);
      // console.log(this.times);
      // 将开始时间和结束时间对象转化成时间戳赋值给form
      this.form.begintime = e[0].getTime();
      this.form.endtime = e[1].getTime();
    },
    // 修改一级分类触发：
    changeFirstCateList() {
      this.form.second_cateid = "";
      this.form.goodsid = "";
      // 这里只需要数据不需要action里的then处理逻辑，所以只需要用接口去请求不需要actions里的函数
      reqCateList({ pid: this.form.first_cateid }).then(res => {
        this.secondCateList = res.data.list;
      });
    },
    // 修改二级分类触发：
    changeSecondCateList() {
      this.form.goodsid = "";
      reqGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid
      }).then(res => {
        this.goodsList = res.data.list;
      });
    }
  },
  mounted() {
    // 如果商品分类list没有请求过就请求一次，这里需要获取到catelist并做then处理,所以必须通过actions里的函数来发请求
    if (this.cateList.length == 0) {
      this.reqCateListAction();
    }
  }
};
</script>
<style  scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}

.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}

.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}

.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style> 