<template>
  <div class="min">
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
          <div class="data_col">
              <h3 class="data_title">商品总览</h3>
              <el-row>
                  <el-col :span="6">
                      <p>100</p>
                      <div>已下架</div>
                  </el-col>
                  <el-col :span="6">
                      <p>400</p>
                      <div>已上架</div>
                  </el-col>
                  <el-col :span="6">
                      <p>50</p>
                      <div>库存紧张</div>
                  </el-col>
                  <el-col :span="6">
                      <p>500</p>
                      <div>全部商品</div>
                  </el-col>
              </el-row>
          </div>
      </el-col>
      <el-col :span="10">
          <div class="data_col">
              <h3 class="data_title">用户总览</h3>
              <el-row>
                  <el-col :span="6">
                      <p>100</p>
                      <div>今日新增</div>
                  </el-col>
                  <el-col :span="6">
                      <p>200</p>
                      <div>昨日新增</div>
                  </el-col>
                  <el-col :span="6">
                      <p>1000</p>
                      <div>本月新增</div>
                  </el-col>
                  <el-col :span="6">
                      <p>5000</p>
                      <div>会员总数</div>
                  </el-col>
              </el-row>
          </div>
      </el-col>
    </el-row>
    <div id="main" class="echart">

    </div>
  </div>
</template>
<script>
// 引入echaets
import echarts from "echarts"
export default {
    mounted() {
         var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: ''
            },
            tooltip: {},
            legend: {
                data:['近一周订单数量']
            },
            xAxis: {
                data: ["周一","周二","周三","周四","周五","周六","周日"],
                boundaryGap:false
            },
            yAxis: {},
            series: [{
                name: '近一周订单数量',
                type: 'line',
                data: [0, 200, 200, 600, 500, 1000]
            }],
            toolbox:{
                feature:{
                    saveAsImage:{

                    }
                }
            },

        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
};
</script>
<style lang="stylus">
.min{
    .data_col{
        height 190px
        border 2px solid #000
        .data_title{
            height 50px
            line-height 50px
            background #fff
            padding-left 20px
        }
        .el-col-6{
            text-align center
            margin-top 46px
        }
        p{
            line-height 20px
            color #f40
            font-size 18px
        }
        div{
            font-size 14px
            margin-top 5px
        }
    }
    .echart{
        width 810px
        height 385px
        margin-top 50px
        margin-left 170px
    }
}
</style>