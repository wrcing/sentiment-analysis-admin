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
  </div>


</template>

<script>
import { getWeiboAnalysis } from '@/api/analysis'

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
      list: [],
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
  methods: {
    onSubmit() {
      if (this.form.url == null || this.form.url == ''){
        this.$message({
          message: '请输入网址',
          type: 'warning'
        })
        return true;
      }
      this.listLoading = true
      getWeiboAnalysis(this.form).then(response => {
        this.list = response.data
        this.listLoading = false
        // this.$message(response)
      })
      // this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

