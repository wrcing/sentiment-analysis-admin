<template>
  <!-- <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}</div>
  </div> -->
  <div class="app-container">

  <!-- twitter统计，及数据来源 -->
  <el-row>
    <el-col :span="17" :offset="0">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="twitterStatisticChart" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col>
    
    <el-col :span="7" :offset="0">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="distributionChart" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col>

  </el-row>

  <el-row>
    <el-col :span="17" :offset="0">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col>
    
    <!-- <el-col :span="7" :offset="0">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="" :style="{width: '100%', height: '400px'}"></div>
	      </div>
      </el-card>
    </el-col> -->

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
import { getWeiboCommentCount, getBiliReplyCount, getWeiboStatistic, getTwitterCommentCount, getTwitterAnalysisStatistic } from '@/api/analysis'

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
      // 微博情绪分布数据
      // ['总数','乐好喜', '惧', '惊', '哀', '恶', '怒', '未知']
      countChartCategory: ['总数'],
      countChartHandledData: [0],
      countChartUnhandledData: [0],

      // 分布来源的数据
      distributionChartData: [
        { value: 1, name: 'bilibili' },
        { value: 1, name: '微博' },
        { value: 1, name: 'Twitter' },
      ],

      // twitter情绪分布的数据
      twitterSentCategory: ['总数'],
      twitterSentHandledData: [0], 
      twitterSentUnhandledData: [0], 
    }
  },
  mounted() {
    // console.log("mounted");
    this.getData();
  },
  methods: {
    getData(){
      
      Promise.all([
        getWeiboCommentCount(this.form).then(response => {
          this.distributionChartData[1].value = (response.data);
        }),
        getBiliReplyCount(null).then(response => {
          this.distributionChartData[0].value = (response.data);
        }),
        getTwitterCommentCount(null).then(response => {
          this.distributionChartData[2].value = (response.data);
        }),
        // 以下为各个网站情感分布数量统计
        // weibo
        getWeiboStatistic(null).then(response => {
          let handled = 0;
          let arr = response.data;
          for (let i = 0, len = arr.length; i < len; i++) {
            this.countChartCategory.push(arr[i]["sentiment"]);
            this.countChartHandledData.push(arr[i]["num"]);
            handled += arr[i]["num"]; 
          }
          // 0 idx是总数
          this.countChartHandledData[0] = handled;
        }),
        // twitter的情感分布
        getTwitterAnalysisStatistic({
              keys: "",
              timePoint: new Date(), 
              preSeconds: 3600*24*365,
          }).then(response => {
            let handled = 0;
            let sents = response.data;
            for (let key in sents){
              this.twitterSentCategory.push(key);
              this.twitterSentHandledData.push(sents[key]);
              handled += sents[key];
            }
            // 0 idx是总数
            this.twitterSentHandledData[0] = handled;
          }).catch(expection=>{
            console.log(expection);        
          })
      ]).then((result)=>{
        // 要在这里更新，放在外面响应还没到就更新，因此还是没更新数据
        this.countChartUnhandledData[0] = this.distributionChartData[1].value - this.countChartHandledData[0];
        this.DrawdistributionChart();
        // weibo情感分布
        this.Draw();
        // twitter
        // this.twitterSentUnhandledData[0] = this.distributionChartData[2].value - this.twitterSentHandledData[0];
        // this.twitterSentUnhandledData[0] = -12113;
        // twitter的情感分布图
        this.DrawTwitterSentimentsStatistic();
      });

    },
    Draw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        // options配置项
          title: {
            text: '微博&Bili-已抓取评论情感倾向'
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
              realtimeSort: true,
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
    DrawTwitterSentimentsStatistic() {
      // 基于准备好的dom，初始化echarts实例
      let twitterStatisticChart = this.$echarts.init(document.getElementById('twitterStatisticChart'))
      // 绘制图表
      twitterStatisticChart.setOption({
          // options配置项
          title: {
            text: 'Twitter-已抓取评论情感倾向'
          },
          tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
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
            data: this.twitterSentCategory
          },
          series: [
            {
              name: '已处理数据',
              type: 'bar',
              realtimeSort: true,
              data: this.twitterSentHandledData
            },
            {
              name: '未处理数据',
              type: 'bar',
              data: this.twitterSentUnhandledData
            }
          ] 
      });

      // let myChart = this.$echarts.init(document.getElementById('distributionChart'))
      // myChart.setOption({})
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
