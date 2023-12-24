<template>
  <div class="body">
    <div class="oolbar-container-middle">
      <div class="toolbar-search">
        <div style="display: flex;justify-content: flex-start">
          <el-input placeholder="通过标题搜索该分类下的博客..." prefix-icon="el-icon-search" v-model="keywords" style="width: 400px"
            size="mini">
          </el-input>
          <el-button type="primary" icon="el-icon-search" size="mini" class="search_btn" @click="searchClick">搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="blogs">
      <ul class="list">
        <li v-for="item in articleList" :key="item.id" class="item">
          <div class="content" @click="itemClick(item.id)">
            <h4 class="title">{{ item.title }}</h4>
             <p class="description">{{ item.summary }}</p>
            <div class="meta">
              <span>{{ item.msg }}</span>
              <span>{{ item.nickname }}</span>
              <span class="time">{{ item.editTime | formatDate }}</span>
            </div>
          </div>
          <!-- 收藏功能 -->
          <div class="star_on_off" style="cursor: pointer">
            <span v-if="!item.state">未收藏</span>
            <span v-else @click="addCollect(item.id)">收藏</span>
          </div>
        </li>
      </ul>
      <div class="blog_table_footer">
        <span></span>
        <el-pagination background :page-size="pageSize" layout="prev, pager, next" :total="totalCount"
          @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style scoped>
.blogs {
  /*左对齐*/
  text-align: left;
  cursor: pointer;
}

.blogs li {
  /*去除起前面的点*/
  list-style-type: none;
  /*内部间距*/
  padding: 10px 0 10px;
  /*每篇下面的实线*/
  border-bottom: 2px solid #f0f0f0;
  /*标题，鼠标，悬浮，变绿色*/
}

.blogs li:hover .title {
  color: #42b983;
}

/**/
.description {
  min-height: 30px;
  margin: 4px 0 4px;
  font-size: 18px;
  color: #555;
}

.meta {
  font-size: 13px;
  line-height: 20px;
}

.meta span {
  margin-right: 12px;
  color: #666;
}

.title {
  color: #333;
  margin: 7px 0 7px;
  font-size: 28px;
  line-height: 1.5;
}
</style>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
import BlogPage from "./BlogPage.vue";
export default {
  data() {
    return {
      articleList: [],
      newsData: [], //存放接收后端的数据
      currentPage: 1, // 当前页 默认设值1
      pageSize: 6, // 每页显示条目 默认设置5
      keywords: '',//关键词
      loading: false,
      totalCount: -1,
    }
  },
  mounted: function () {
    // 数据加载
    this.loading = true;
    this.loadBlogs(1, this.pageSize);
    var _this = this;
    window.bus.$on('blogTableReload', function () {
      _this.loading = true;
      _this.loadBlogs(this.currentPage, this.pageSize);
    })
  },
  methods: {
    // 搜索
    searchClick() {
      this.loadBlogs(1, this.pageSize);
    },
    // 文章详细
    itemClick(id) {
      // this.$router.push({ path: '/blogDetail', query: { aid: id } })
      this.$router.push({ path: '/blogPage', query: { aid: id } })

    },
    // 收藏操作
    addCollect(aid) {
      var _this = this;
      this.loading = true;
      var url = '/collection/addCollection'
      postRequest(url,{aid: aid}).then(resp => {
        if (resp.status == 200) {
          _this.$message({ type: 'success', message: '收藏成功!' });
        }
        _this.loading = false;
      }, resp => {
        _this.loading = false;
        _this.$message({ type: 'error', message: '收藏失败!' });
      });
    },
    loadBlogs(page) {
      var _this = this;
      var url = '';
      url = "/admin/article/all" + "?page=" + page + "&keywords=" + this.keywords;
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.articleList = resp.data.articles;
          _this.totalCount = resp.data.totalCount;
        } else {
          _this.$message({ type: 'error', message: '数据加载失败!' });
        }
      }, resp => {
        _this.loading = false;
        if (resp.response.status == 403) {
          _this.$message({ type: 'error', message: resp.response.data });
        } else {
          _this.$message({ type: 'error', message: '数据加载失败!' });
        }
      }).catch(resp => {
        _this.loading = false;
        _this.$message({ type: 'error', message: '数据加载失败!' });
      })
    },
    // 翻页
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.loading = true;
      this.loadBlogs(currentPage, this.pageSize);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadallPage(this.pageNum, this.pageSize);
    },
  },
}
</script>
<style scoped>
.el-icon-star-on {
  font-size: 30px;
}

.toolbar-container-middle {
  position: absolute;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 0 40px;
  min-width: 200px;
  padding: 0 32px;
  margin: 0;
}

.toolbar-search {
  max-width: 836px;
  height: 28px;
  line-height: 28px;
  margin-top: calc((48px - 32px)/ 2);
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.search_btn {
  display: inline-block;
  width: 88px;
  margin-left: 3px;
  border-radius: 0 16px 16px 0;
  width: 88px;
}

.blogs {
  /*左对齐*/
  text-align: left;
}

.blogs li {
  /*去除起前面的点*/
  list-style-type: none;
  /*内部间距*/
  padding: 15px 0 10px;
  /*每篇下面的实线*/
  border-bottom: 2px solid #f0f0f0;
  /*标题，鼠标，悬浮，变绿色*/
}

.blogs li:hover .title {
  color: #42b983;
}

/**/
.description {
  min-height: 30px;
  margin: 4px 0 4px;
  font-size: 18px;
  color: #555;
}

.meta {
  line-height: 20px;
}

.meta span {
  font-size: 14px;
  color: #555666;
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: #222226;
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 25px;
  margin-bottom: 4px;
}
.body{
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
}


.star_on_off span {
  float: right;
  z-index: 9999;
}</style>
