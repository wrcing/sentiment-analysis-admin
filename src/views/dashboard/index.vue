<template>
  <!-- <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}</div>
  </div> -->
  <div class="app-container">

  <!-- 卡片使用 https://element.eleme.cn/#/zh-CN/component/card#jian-dan-qia-pian -->
  <el-row>
    <el-col :span="16" :offset="0">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col>
    
    <el-col :span="7" :offset="1">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="distributionChart" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col>

  </el-row>

  <el-row>
    <el-col :span="7" v-for="(o, index) in 3" :key="o" :offset="index > 0 ? 1 : 0">
      <el-card :body-style="{ padding: '0px' }">
        <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
        <div style="padding: 14px;">
          <span>好吃的汉堡</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWeiboCommentCount,getBiliReplyCount,getTotalCount } from '@/api/analysis'

export default {
  name: 'Dashboard',
  user: '后台运行状态',
  data(){
    return {
      form: {
        url: '',
        location: '',
        minLike: '',
        minReply: '',
        timeRange: '',
      },
      countChartCategory: ['总数','乐好喜', '惧', '惊', '哀', '恶', '怒', '未知'],
      countChartHandledData: [666, 666, 666, 666, 666, 666, 666, 666],
      countChartUnhandledData: [666],

      distributionChartData: [
        { value: 1, name: 'bilibili' },
        { value: 1, name: '微博' },
        { value: 1, name: 'Twitter' },
      ],
    }
  },
  mounted() {
    // console.log("mounted");
    this.getData();
  },
  methods: {
    getData(){
      getWeiboCommentCount(this.form).then(response => {
        this.distributionChartData[1].value = (response.data);
        // 要在这里更新，放在外面响应还没到就更新，因此还是没更新数据
        this.DrawdistributionChart();
      });

      getBiliReplyCount(null).then(response => {
        this.distributionChartData[0].value = (response.data);
        this.DrawdistributionChart();
      });

      getTotalCount(null).then(response => {
        this.countChartUnhandledData[0] = (response.data.unhandled);
        this.countChartHandledData[0] = (response.data.handled);
        this.Draw();
      });
      
    },
    Draw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        // options配置项
          title: {
            text: '已抓取评论总体情感倾向'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.countChartCategory
          },
          series: [
            {
              name: '已处理数据',
              type: 'bar',
              data: this.countChartHandledData
            },
            {
              name: '未处理数据',
              type: 'bar',
              data: this.countChartUnhandledData
            }
          ] 
      });

      // let myChart = this.$echarts.init(document.getElementById('distributionChart'))
      // myChart.setOption({})
    },
    DrawdistributionChart(){
      let distributionChart = this.$echarts.init(document.getElementById('distributionChart'));
      distributionChart.setOption({
          title: {
          text: '数据来源分布',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: this.distributionChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 30%;
  }
  // 以下为憨八嘎的配置
    .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
