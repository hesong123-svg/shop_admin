<template>
  <div>
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'限时秒杀添加':'编辑限时秒杀'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="userForm">
        <el-form-item class="item" label="活动名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              type="datetimerange"
              range-separator="至"
              v-model="Time"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="item" label="一级分类">
          <!-- changge 点击改变时触发的事件 -->
          <el-select v-model="form.first_cateid" @change="firstChange">
            <el-option
              v-for="(item,index) in firstCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="secondChange">
            <el-option
              v-for="(item,index) in secondCateList"
              :label="item.catename"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="form.goodsid">
            <el-option
              v-for="(item,index) in listArr "
              :key="index"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow=false">取 消</el-button>
        <el-button type="primary" @click="subFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  title: "", //限时秒杀名称
  begintime: "", //开始时间
  endtime: "", // 结束时间
  first_cateid: "", // 商品一级分类编号
  second_cateid: "", // 商品二级分类编号
  goodsid: "", // 商品编号
  status: true, // 状态   1正常2禁用
};
export default {
  props: ["info"],
  data() {
    return {
      Time: [],
      // 一二级分类
      firstCateList: [],
      secondCateList: [],
      listArr: [],
      goodsid: [],
      form: {
        ...defaultForm,
      },
      rules: {
        title: [
          {
            required: true, //必填项
            message: "请输入活动名称", // 提示信息
            trigger: "blur", // 触发条件
          },
        ],
      },
    };
  },
  methods: {
    //   获取一二级分类数据
    async getCateList(pid = 0) {
      let res = await this.$http.get("/api/catelist", { pid });
      if (pid == 0) {
        if (res.code == 200) {
          this.firstCateList = res.list;
        }
      } else {
        // 二级分类
        this.secondCateList = [];
        if (res.code == 200) {
          this.secondCateList = res.list;
        }
      }
    },
    // 弹窗一级分类点击切换事件
    firstChange(id) {
      this.getCateList(id);
    },
    // 获取商品列表
    async goodsidFn() {
      let res = await this.$http.get("/api/goodslist", {
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      });
      if (res.code == 200) {
        this.listArr = res.list;
      }
    },
    secondChange() {
      this.goodsidFn();
    },
    openFn() {},
    resetFn() {
      this.form = {
        ...defaultForm,
      };
      this.Time = [];
      this.info.isAdd = true;
    },
    subFn() {
      this.$refs.userForm.validate(async (value) => {
        if (value) {
          let url = this.info.isAdd ? "/api/seckadd" : "/api/seckedit";
          this.form.status = this.form.status ? 1 : 2;
          this.form.begintime = this.Time[0].getTime();
          this.form.endtime = this.Time[1].getTime();
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$message.success("添加成功");
            this.$emit("getTableDate");
          }
        }
        this.info.isShow = false;
      });
    },
  },
  created() {
    this.getCateList();
  },
};
</script>
