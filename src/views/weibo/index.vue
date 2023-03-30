<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="微博网页地址" required>
        <el-input v-model="form.url" />
      </el-form-item>

      <el-form-item label="筛选评论">
        <el-col :span="4">
          <el-select v-model="form.location" placeholder="评论来源地区" clearable>
            <el-option label="中国" value="中国" />
            <el-option label="美国" value="美国" />
            <el-option label="山东" value="山东" />
          </el-select>
        </el-col>
        <el-col :span="3" class="el-form-item__label">最低点赞数</el-col>
        <el-col :span="5">
          <el-input
            placeholder="最低点赞数"
            v-model="form.minLike"
            type="number"
            min=0
            max=10000000
            clearable>
          </el-input>
        </el-col>
        <el-col :span="3" class="el-form-item__label">最低评论数</el-col>
        <el-col :span="5">
          <el-input
            placeholder="最低评论数"
            v-model="form.minReply"
            type="number"
            min=0
            max=10000000
            clearable>
          </el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="评论发布时间段">
        <el-col :span="11">
          <el-date-picker v-model="form.timeRange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left">
          </el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询分析结果</el-button>
        <!-- <el-button @click="onCancel">Cancel</el-button> -->
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="16" :offset="0">
        <el-card :body-style="{ padding: '14px' }">
          <div class="">
            <div id="sentimentPieChart" :style="{width: '100%', height: '400px'}"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="16" :offset="0">
        <el-card :body-style="{ padding: '14px' }">
          <div class="">
            <div id="ChinaMap" :style="{height: '650px', width: '700px'}"></div>
            <!-- <div id="ChinaMap" style="position: relative; width: 1200px; height: 500px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div> -->
          </div>
        </el-card>
      </el-col>
        <el-col :span="8" :offset="0">
        <el-card :body-style="{ padding: '14px' }">
          <div class="foreignMap">
            <div id="" :style="{height: '650px', width: '400px'}"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>    
  </div>


</template>

<script>
import { getWeiboAnalysis } from '@/api/analysis';
import '@/echarts/map/china.js';

export default {
  data() {
    return {
      form: {
        url: '',
        location: '',
        minLike: '',
        minReply: '',
        timeRange: '',
      },

      // sentimentCount每种情绪の计数
      sentimentCount: new Map([["ikun", 1]]),
      // list 为所有分析结果
      list: [{value : 1, name: "无数据"}],
      // 每个省份 人数
      location_num: {location: "shandong", num: 99},

      // 地图数据 [{省份，数量}]
      mapDataList: [
        {
          name: "南海诸岛",
          value: 0
        },
        {
            name: '北京',
            value: 0
        },
        {
            name: '天津',
            value: 0
        },
        {
            name: '上海',
            value: 0
        },
        {
            name: '重庆',
            value: 0
        },
        {
            name: '河北',
            value: 0
        },
        {
            name: '河南',
            value: 0
        },
        {
            name: '云南',
            value: 0
        },
        {
            name: '辽宁',
            value: 0
        },
        {
            name: '黑龙江',
            value: 0
        },
        {
            name: '湖南',
            value: 0
        },
        {
            name: '安徽',
            value: 0
        },
        {
            name: '山东',
            value: 0
        },
        {
            name: '新疆',
            value: 0
        },
        {
            name: '江苏',
            value: 0
        },
        {
            name: '浙江',
            value: 0
        },
        {
            name: '江西',
            value: 0
        },
        {
            name: '湖北',
            value: 0
        },
        {
            name: '广西',
            value: 0
        },
        {
            name: '甘肃',
            value: 0
        },
        {
            name: '山西',
            value: 0
        },
        {
            name: '内蒙古',
            value: 0
        },
        {
            name: '陕西',
            value: 0
        },
        {
            name: '吉林',
            value: 0
        },
        {
            name: '福建',
            value: 0
        },
        {
            name: '贵州',
            value: 0
        },
        {
            name: '广东',
            value: 0
        },
        {
            name: '青海',
            value: 0
        },
        {
            name: '西藏',
            value: 0
        },
        {
            name: '四川',
            value: 0
        },
        {
            name: '宁夏',
            value: 0
        },
        {
            name: '海南',
            value: 0
        },
        {
            name: '台湾',
            value: 0
        },
        {
            name: '香港',
            value: 0
        },
        {
            name: '澳门',
            value: 0
        }
      ],

      listLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  mounted(){
    this.DrawPieChart();
    this.DrawChinaMap();
  },
  methods: {
    onSubmit() {
      if (this.form.url == null || this.form.url == ''){
        this.$message({
          message: '请输入网址',
          type: 'warning'
        });
        return true;
      }
      // 处理请求
      this.listLoading = true;
      getWeiboAnalysis(this.form).then(response => {
        this.sentimentCount = new Map();
        this.location_num = {};
        let arr = response.data;
        for (let i = 0, len = arr.length; i < len; i++) {
          // 情绪统计
          let sen = arr[i]["analysisPO"]["analysis"];
          if (!this.sentimentCount.has(sen)){
            this.sentimentCount.set(sen, 1);
          }
          else{
            this.sentimentCount.set(sen, this.sentimentCount.get(sen)+1);
          }

          // location 统计
          if (!this.location_num.hasOwnProperty(arr[i]["location"])){
            this.location_num[arr[i]["location"]] = 1;
          }
          else{
            this.location_num[arr[i]["location"]]++;
          }
        }

        // 将数据转化为echarts需要的格式
        // 情绪饼图数据转化
        this.list = [];
        for (let [key, value] of this.sentimentCount){
          this.list.push({
            value: value,
            name: key
          });
        }


        // 地图数据转化
        for (let i = 0, len = this.mapDataList.length; i < len; i++){
          // 初始化清零
          this.mapDataList[i].value = 0;
        }
        for (let key in this.location_num){
          let province = key;
          if (province.startsWith("中国")) province = province.substring(2);
          for (let i = 0, len = this.mapDataList.length; i < len; i++){
            if (this.mapDataList[i].name == province){
              this.mapDataList[i].value = this.location_num[key];
              break;
            }
          }
        }

        this.listLoading = false;
        this.DrawPieChart();
        this.DrawChinaMap();
        // this.$message(response.msg)
      });

    },
    
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    
    DrawPieChart(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('sentimentPieChart'));
      
      // 绘制图表
      myChart.setOption({
        title: {
          text: '情感类型数量分布',
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
            name: '情感类型分布',
            type: 'pie',
            radius: '70%',
            data: this.list,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },

    DrawChinaMap(){
      let myChart = this.$echarts.init(document.getElementById('ChinaMap'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '评论来源分布',
          subtext: '',
          left: 'center'
        },
        tooltip: {
            triggerOn: "click",
            formatter: function(e, t, n) {
                return .5 == e.value ? e.name + "：评论人数" : e.seriesName + "<br />" + e.name + "：" + e.value
            }
        },
        visualMap: {
            min: 0,
            max: 1000,
            left: 26,
            bottom: 40,
            showLabel: !0,
            text: ["高", "低"],
            pieces: [{
                gte: 300,
                label: "> 300 人",
                color: "#7f1100"
            }, {
                gte: 100,
                lt: 300,
                label: "100 - 300 人",
                color: "#ff5428"
            }, {
                gte: 10,
                lt: 100,
                label: "10 - 100 人",
                color: "#ff8c71"
            }, {
                gt: 0,
                lt: 10,
                label: "1 - 9 人",
                color: "#ffd768"
            }, {
                value: 0,
                color: "#ffffff"
            }],
            show: !0
        },
        geo: {
            map: "china",
            roam: !1,
            scaleLimit: {
                min: 1,
                max: 2
            },
            zoom: 1.23,
            top: 120,
            label: {
                normal: {
                    show: !0,
                    fontSize: "14",
                    color: "rgba(0,0,0,0.7)"
                }
            },
            itemStyle: {
                normal: {
                    //shadowBlur: 50,
                    //shadowColor: 'rgba(0, 0, 0, 0.2)',
                    borderColor: "rgba(0, 0, 0, 0.2)"
                },
                emphasis: {
                    areaColor: "#f2d5ad",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    borderWidth: 0
                }
            }
        },
        series: [{
            name: "评论人数",
            type: "map",
            geoIndex: 0,
            data: this.mapDataList
        }]
      });
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

