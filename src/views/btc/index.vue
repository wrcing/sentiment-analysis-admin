<template>
  <!-- <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}</div>
  </div> -->
  <div class="app-container">

  <!-- 卡片使用 https://element.eleme.cn/#/zh-CN/component/card#jian-dan-qia-pian -->
  <el-row>
    <el-col :span="22" :offset="1">
      <el-card :body-style="{ padding: '14px' }">
        <div class="">
		      <div id="btcPriceChart" :style="{width: '100%', height: '680px'}"></div>
	      </div>
      </el-card>
    </el-col>
    
  </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBTCPrices } from '@/api/analysis'

export default {
  name: 'Dashboard',
  user: '后台运行状态',
  data(){
    return {
      // 查询请求的参数
      form: {
        url: '',
        location: '',
        minLike: '',
        minReply: '',
        timeRange: '',
      },
      // 查询btc price的参数
      btcPricesConditon: {
        startTime: new Date(2023, 0, 1),
        endTime: new Date(),
        type: 100, 
        sepSeconds: 60*60,
      },
      predictedBtcPricesConditon: {
        startTime: new Date(2023, 0, 1),
        endTime: new Date(),
        type: 0, 
        sepSeconds: 60*60,
      },
      // btc price的图表的dom
      btcPriceChart: {},
      btcPrices: [],
      predictedBtcPrices: [], 
    }
  },
  mounted() {
    this.btcPriceChart = this.$echarts.init(document.getElementById('btcPriceChart'));
    this.getData();
  },
  methods: {
    getData(){
      
      Promise.all([
        getBTCPrices(this.btcPricesConditon).then(response => {
          // console.log(typeof response.data[0]["close"]);
          // console.log(response.data[0]["close"].toString());
          // console.log(response.data[0]["close"].toFixed(5));
          // console.log(response.data[0]["volume"]);
          // console.log(typeof response.data[0]["timePoint"]);
          this.btcPrices = [];
          for (let i = 0, len = response.data.length; i < len; i++){
            this.btcPrices.push([
              response.data[i]["timePoint"].substring(0, 16).replace("T", " "), 
              response.data[i]["close"],
            ]);
          }
        }),
        getBTCPrices(this.predictedBtcPricesConditon).then(response => {
          this.predictedBtcPrices = [];
          for (let i = 0, len = response.data.length; i < len; i++){
            this.predictedBtcPrices.push([
              response.data[i]["timePoint"].substring(0, 16).replace("T", " "), 
              response.data[i]["close"],
            ]);
          }
        }),
      ]).then((result)=>{
        // console.log(this.btcPrices.length);
        // console.log(this.predictedBtcPrices.length);
        // 要在这里更新，放在外面响应还没到就更新，因此还是没更新数据
        this.drawBTCPriceChart();
      });
    },

    // 绘制btc价格图
    drawBTCPriceChart(){
      this.btcPriceChart.setOption({
        title: {
          text: 'BITFINEX交易所-Bitcoin 价格预测',
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          order: 'valueDesc',
          //核心代码，处理tooltip中的数据需要在此formatter函数中做处理
          formatter(params) {
              var relVal = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                  //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
                  relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4);
              }
              return relVal;
          },
        },
        legend: {
          data: ['实际价格', '预测价格']
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          data: this.btcPrices.map(function (item) {
            return item[0];
          })
        },
        yAxis: {},
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            startValue: '2014-06-01'
          },
          {
            type: 'inside'
          }
        ],
        visualMap: {
          seriesIndex: 0,
          top: 50,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 10000,
              color: '#FBDB0F'
            },
            {
              gt: 10000,
              lte: 20000,
              color: '#FC7D02'
            },
            {
              gt: 20000,
              lte: 25000,
              color: '#DD4822'
            },
            {
              gt: 25000,
              color: '#FD0100'
            },
          ],
          outOfRange: {
            color: '#999'
          }
        },
        series: [
          {
            name: '实际价格',
            type: 'line',
            data: this.btcPrices.map(function (item) {
              return item[1];
            }),
            // markLine: {
            //   silent: true,
            //   lineStyle: {
            //     color: '#333'
            //   },
            //   data: []
            // }
          },
          {
            name: '预测价格',
            type: 'line',
            lineStyle:{
              // color: 'blue',
            },
            data: this.predictedBtcPrices.map(function (item) {
              return item[1];
            }),
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
