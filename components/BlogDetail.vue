<template>
  <div class="body">
    <el-row v-loading="loading">
      <el-col :span="24">
        <div style="text-align: left;">
          <el-button type="text" icon="el-icon-back" @click="goBack" style="padding-bottom: 0px;">返回</el-button>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <div>
            <h3 style="margin-top: 0px;margin-bottom: 0px">{{ article.title }}</h3>
          </div>
          <div style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center">
            <div style="display: inline; color: #20a0ff;margin-left: 50px;margin-right:20px;font-size: 12px;">
              {{ article.nickname }}
            </div>
            <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">浏览
            {{ article.pageView == null ? 0 : article.pageView }}</span>
            <span style="color: #20a0ff;margin-right:20px;font-size: 12px;"> {{
                article.editTime | formatDateTime
              }}</span>
            <el-tag type="success" v-for="(item, index) in article.tags" :key="index" size="small"
                    style="margin-left: 8px">{{ item.tagName }}
            </el-tag>
            <span style="margin:0px 50px 0px 0px"></span>
          </div>
        </div>
      </el-col>
      <el-col>
<!--        <div style="text-align: left" v-html="article.htmlContent">-->
<!--        </div>-->
        <v-md-preview :text="article.mdContent"></v-md-preview>
<!--        <v-md-editor :value="article.mdContent" mode="preview"></v-md-editor>-->
      </el-col>
    </el-row>-
  </div>
</template>
<script>
import {getRequest} from '../utils/api'

export default {
  name: 'BlogDetail',
  data() {
    return {
      article: {},
      loading: false,
      // activeName: ''
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted: function () {
    var aid = this.$route.query.aid;
    // this.activeName = this.$route.query.an
    this.loading = true;
    getRequest("/article/getArticleById/" + aid).then(resp => {
      if (resp.status === 200) {
        this.article = resp.data;
        this.$emit('getNickname', this.article.nickname);
      }
      this.loading = false;
    }, resp => {
      this.loading = false;
      this.$message({type: 'error', message: '页面加载失败!'});
    });
  },
}
</script>
<style>
.el-row {
  background-color: rgba(0, 0, 0, 0);
}
.body{
  /*background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);*/
  height: 100%;
}

</style>
