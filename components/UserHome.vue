<template>
  <div class="body">
    <div class="outerBox" ref="outerDom" @scroll="getScrollTop">
      <div class="toolbar-container-middle">
        <div class="toolbar-search">
          <div style="display: flex;justify-content: flex-start; ">
            <el-input placeholder="通过标题搜索该分类下的博客..." prefix-icon="el-icon-search" v-model="keywords"
                      style="width: 400px"
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
            <div class="content" @click="itemClick(item.id,item.uid)">
              <h4 class="title">{{ item.title }}</h4>
              <p class="description">{{ item.summary }}</p>
              <div class="meta">
                <span class="el-icon-user">作者：{{ item.nickname }}</span>
                <span class="el-icon-view">阅读量：{{ item.pageView }}</span>
                <span class="el-icon-time">发表时间：{{ item.editTime | formatDate }}</span>
              </div>
            </div>
            <div class="star_on_off">
              <span class="el-icon-sunny">点个赞</span>
            </div>
            <div class="star_on_off">
              <span class="el-icon-heavy-rain">踩一脚</span>
            </div>
            <div class="star_on_off">
              <span class="el-icon-share">分享</span>
            </div>
            <!-- 收藏功能 -->
            <div class="star_on_off">
              <span v-if="!item.state">未收藏</span>
              <span class="el-icon-star-off" v-else @click="addCollect(item.id)">收藏</span>
            </div>
          </li>
        </ul>
        <div class="blog_table_footer">
          <span></span>
          <el-pagination background
                         :page-size="pageSize"
                         layout="prev, pager, next"
                         :total="totalCount"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
      <el-button
        size="mini"
        :circle="is_circle"
        class="scrollBox"
        v-show="isShow" @click="goBack">
        <img src="../assets/imgs/top.svg" alt/>
      </el-button>
    </div>
  </div>
</template>
<script>
import {postRequest} from '../utils/api'
import {getRequest} from '../utils/api'
import BlogPage from "./BlogPage.vue";
import Scroll from "./Scroll.vue";

export default {
  data() {
    return {
      scrollTop: 0, //默认距离顶部的距离
      isShow: false, //控制返回顶部按钮的显隐
      scrollTrigger: false, //默认初始值
      is_circle: true,
      articleList: [],
      newsData: [], //存放接收后端的数据
      currentPage: 1, // 当前页 默认设值1
      pageSize: 10, // 每页显示条目 默认设置5
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
    // console.log("scroll"+document.getElementById("to-top-btn"))
    window.addEventListener("scroll", this.scrollToTop);
  },
  methods: {

    // 搜索
    searchClick() {
      this.loadBlogs(1, this.pageSize);
    },

    // 文章详细
    itemClick(aid, uid) {
      // this.$router.push({ path: '/blogDetail', query: { aid: id } })
      this.$router.push({path: '/blogPage', query: {aid: aid, uid: uid}})

    },
    // 收藏操作
    addCollect(aid) {
      var _this = this;
      this.loading = true;
      var url = '/collection/addCollection'
      postRequest(url, {aid: aid}).then(resp => {
        if (resp.status == 200) {
          _this.$message({type: 'success', message: '收藏成功!'});
        }
        _this.loading = false;
      }, resp => {
        _this.loading = false;
        _this.$message({type: 'error', message: '收藏失败!'});
      });
    },
    // currentPage 当前页
    // pageSize 每页显示条目
    loadBlogs(currentPage, pageSize) {
      var _this = this;
      var url = '';
      url = "/admin/article/all" + "?page=" + currentPage + "&count=" + pageSize + "&keywords=" + this.keywords;
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.articleList = resp.data.articles;
          _this.totalCount = resp.data.totalCount;
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }, resp => {
        _this.loading = false;
        if (resp.response.status == 403) {
          _this.$message({type: 'error', message: resp.response.data});
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }).catch(resp => {
        _this.loading = false;
        _this.$message({type: 'error', message: '数据加载失败!'});
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
    // 返回顶部事件
    goBack() {
      let that = this; // 防止this指向问题
      // 防止频繁点击，故返回顶部后设置scrollTrigger为初始值
      if (that.scrollTrigger) {
        return;
      }
      // 获取当前距离顶部的距离
      let scrollTop = this.scrollTop;
      console.log(scrollTop);
      let steep = scrollTop / 2000;
      let timer = setInterval(() => {
        that.scrollTrigger = true;
        // 滚动的速度逐渐变快，第一次走2000/1，然后减去已走的距离，下一次用剩下的距离再减去步进值，步进值也是不断变化，这样速度会越来越快
        scrollTop -= steep;
        // 步进值不改变的话会匀速缓慢上滑，不断增加步进值上滑的距离增加，视觉效果速度变快
        steep += 20;
        if (scrollTop <= 0) {
          clearInterval(timer);
          that.scrollTrigger = false;
        }
        that.$refs.outerDom.scrollTop = scrollTop;
      }, 30);
    },
    // 监听滚动条
    getScrollTop(e) {
      let that = this; // 防止this指向问题
      // 设备一屏的高度
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollTop = e.srcElement.scrollTop;
      this.scrollTop = scrollTop;
      // 判断距离顶部多少显示回到顶部图标
      if (scrollTop > clientHeight) {
        that.isShow = true;
      } else {
        that.isShow = false;
      }
    },
  },

}
</script>
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
  min-height: 20px;
  margin: 4px 0 4px;
  font-size: 15px;
  color: #8c939d;
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
  font-size: 18px;
  line-height: 1.5;
}

.el-icon-star-on {
  font-size: 30px;
}

.toolbar-container-middle {
  position: top;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 200px;
  margin-left: 400px;
}

.toolbar-search {
  max-width: 836px;
  height: 28px;
  line-height: 28px;
  margin-top: calc((48px - 32px) / 2);
  margin-left: auto;
  margin-right: auto;
  position: relative;

}

.search_btn {
  display: inline-block;
  width: 88px;
  margin: 0 10px;
  border-radius: 0 16px 16px 0;
}

.star_on_off {
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  color: #666;
}

.star_on_off span {
  float: left;
  z-index: 9999;
  padding-top: 10px;
}

/* 最外层盒子样式 */
.outerBox {
  position: absolute;
  top: 55px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 4px 6px;
}

/* 返回顶部图标样式 */
.scrollBox {
  position: fixed;
  width: 3rem;
  height: 3rem;
  right: 50px;
  bottom: 40px;
  /*font-size: 22px;*/
  z-index: 99;
}
.scrollBox img{
  width: 100%;
}



</style>
