<template>
  <el-container class="article_list">
    <el-main class="main">
      <div style="text-align: left; padding-bottom: 20px" >
        <el-button type="text" icon="el-icon-back" @click="goBack" style="padding-bottom: 0px;">回到首页</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="全部文章" name="all">
          <blog_table state="-1" :showEdit="false" :showDelete="false" :showRestore="false" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="草稿箱" name="draft">
          <blog_table state="0" :showEdit="true" :showDelete="true" :showRestore="false" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="已发表" name="post">
          <blog_table state="1" :showEdit="true" :showDelete="true" :showRestore="false" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="回收站" name="dustbin">
          <blog_table state="2" :showEdit="false" :showDelete="true" :showRestore="true" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="审核中" name="check">
          <blog_table state="3" :showEdit="false" :showDelete="false" :showRestore="false" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="博客管理" name="blogmana" v-if="isAdmin">
          <blog_table :state="isAdmin===true -2 || -1" :showEdit="false" :showDelete="true" :showRestore="false" :activeName="activeName">
          </blog_table>
        </el-tab-pane>
        <el-tab-pane label="博客配置" name="blogcfg">
          <blog_cfg></blog_cfg>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script >
import BlogTable from '@/components/BlogTable'
import BlogCfg from '@/components/BlogCfg'
import { getRequest } from '../utils/api'
export default {

  created() {
    window.localStorage.setItem("activeTab ", "all")
  },
  mounted: function () {
    var _this = this;
    getRequest("/user/isAdmin").then(resp => {
      if (resp.status == 200) {
        _this.isAdmin = resp.data;
      }
    });
    // 获取tab中的页面状态，避免刷新后被重置，从而保证页面不会一直回到第一个
    // all,post,draft,dustbin,blogmana,blogcfg
    this.activeName = window.localStorage.getItem("activeTab ") || "all";
  },
  data() {
    return {
      activeName: 'all',
      isAdmin: false
    };
  },
  methods: {
    handleClick(tab, event) {
      // 保存tab页面状态，避免刷新后被重置，从而保证页面不会一直回到第一个
      // all,post,draft,dustbin,blogmana,blogcfg
      window.localStorage.setItem("activeTab ", this.activeName);
    },
    goBack() {
      this.$router.push("/UserHome");
    },
  },
  components: {
    'blog_table': BlogTable,
    'blog_cfg': BlogCfg
  }
};
</script>
<style scoped>
.article_list>.header {
  margin-top: 10px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}

.article_list>.main {
  /*justify-content: flex-start;*/
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  display: flex;
  flex-direction: column;
  padding-left:50px;
  background-color: #fff;
  padding-top: 0px;
  margin-top: 8px;
}
</style>

