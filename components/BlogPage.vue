<template>
  <div style="margin-top: 10px;">
    <div class="container">
      <div class="left">
        <div class="card">
          <img src="../assets/MyBlog-logo.png" alt="">
          <h3 href="">{{ nickname }}</h3>
          <el-button :loading="this.isLoading" @click="changeFansStatus" round>{{
              isFans ? '已关注' : '关注'
            }}
          </el-button>
          <div class="counter1">
            <span>粉丝</span>
            <span>文章</span>
          </div>
          <div class="counter2">
            <span>{{ fans }}</span>
            <span>{{ articleCount }}</span>
          </div>
        </div>
        <div class="card" style="margin-top: 20px; padding-left: 0px; padding-top: 1px">
          <h4 style="padding-top: 1px; padding-left: 23px; text-align: left;">作者推荐文章</h4>
          <hr/>
          <ol class="Article">
            <li v-for="item in archives" :key="item.id" class="item">
              <div class="link" @click="itemClick(item.id, uid)">
                <div class="title">{{ item.title }}
                  (<div class="el-icon-view">{{ item.pageView }}</div>)
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div class="right">
        <div class="blog_content">
          <blog_detail @getNickname="getNickname"/>
        </div>
        <div class="right" style="background-color: rgba(255,255,255,0.5); margin-top: 10px;border-radius: 10px;">
          <div class="blogs" style="margin-top: 20px;">
            <ul class="list">
              <li v-for="item in articleList" :key="item.id" class="item">
                <div class="content" @click="itemClick(item.id, item.uid)">
                  <div class="title">{{ item.title }}</div>
                  <p class="description">{{ item.summary }}</p>
                  <div class="meta">
                    <span>{{ item.msg }}</span>
                    <span>{{ item.nickname }}</span>
                    <span class="time">{{ item.editTime | formatDate }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
    <div style="padding: 20px 20px"></div>
    <div class="container">
      <div class="left">
      </div>

    </div>
  </div>
</template>

<script>
import BlogDetail from "./BlogDetail.vue";
import {getRequest, postRequest} from "../utils/api";
import {provide} from "vue";
import {get} from "../utils/request";

export default {
  name: "BlogPage",
  components: {
    "blog_detail": BlogDetail,
  },
  data() {
    return {
      aid: '',
      // 子传父,作者ID
      uid: '',
      // 作者昵称
      nickname: '',
      // 粉丝数量
      fans: 0,
      // 文章数量
      articleCount: 0,
      // 是否关注状态
      isFans: false,
      // 按钮加载状态
      isLoading: false,
      // 推荐文章集合
      articleList: [],
      // 作者文章集合
      archives: [],
      newsData: [], //存放接收后端的数据
      currentPage: 1, // 当前页 默认设值1
      pageSize: 6, // 每页显示条目 默认设置5
      keywords: '',//关键词
      loading: false,
      totalCount: -1,
    }
  },
  // 传递值给子组件
  mounted: function () {
    // 数据加载
    this.loading = true;
    this.loadBlogs(1, this.pageSize);
    window.bus.$on('blogTableReload', function () {
      this.loading = true;
      this.loadBlogs(this.currentPage, this.pageSize);

    })
    this.aid = this.$route.query.aid;
    this.uid = this.$route.query.uid;
    this.getCountOfFansByUid();
    this.getCountOfArticlesByUid()
    this.getFansStatus()
    this.getArchivesByUid()
  },

  methods: {
    loadBlogs(page) {
      var _this = this;
      var url = '';
      url = "/admin/article/all" + "?page=" + page + "&keywords=" + this.keywords;
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.articleList = resp.data.articles;
          console.log(resp.data.articles);
          _this.totalCount = resp.data.totalCount;
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }, resp => {
        _this.loading = false;
        if (resp.data.status == 403) {
          _this.$message({type: 'error', message: resp.response.msg});
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }).catch(resp => {
        _this.loading = false;
        _this.$message({type: 'error', message: '数据加载失败!'});
      })
    },
    // 文章点击事件
    itemClick(aid,uid) {
      this.$router.push({path: '/blogPage', query: {aid: aid, uid: uid}})
      window.location.reload();
    },
    // 获取作者昵称（子传父绑定）
    getNickname(nickname) {
      this.nickname = nickname;
    },

    // 根据用户ID获取粉丝数量
    getCountOfFansByUid() {
      // 构建请求URL
      var url = "/fans/getCountOfFans?uid=" + this.uid;
      console.log("uid" + this.uid);
      // 发送请求，获取响应
      getRequest(url).then(response => {
        // 如果响应状态码为200
        if (response.status == 200) {
          // 将响应数据中的data赋值给this.fans
          this.fans = response.data.data;
        }
      }, reason => {
        // 如果响应的状态码为403
        if (reason.response.status == 403) {
          // 显示错误提示消息
          this.$message({type: 'error', message: reason.response.msg});
        } else {
          // 显示通用的错误提示消息
          this.$message({type: 'error', message: '数据加载失败!'});
        }
      })
    },
    // 获取指定uid的文章数量
    getCountOfArticlesByUid() {
      var url = "/article/getCountOfArticleByUid?uid=" + this.uid;
      getRequest(url).then(response => {
        if (response.status == 200) {
          this.articleCount = response.data.data;
        }
      }, reason => {
        if (reason.response.status == 403) {
          this.$message({type: 'error', message: reason.response.msg});
        }
      })
    },
    // 获取关注状态
    getFansStatus() {
      var fid = window.localStorage.getItem('id');
      var url = "/fans/isFans?uid=" + this.uid + "&fid=" + fid;
      getRequest(url).then(response => {
        if (response.status == 200) {
          this.isFans = response.data.data;
        }
      }, reason => {
        if (reason.status == 403) {
          this.$message({type: 'error', message: reason.response.msg});
        }
      })
    },
    // 关注/取消关注
    changeFansStatus() {
      var url = '';
      // 当前用户没有关注，使用粉丝添加的路由
      if (!this.isFans) {
        url = "/fans/addFans"
      } else {
        url = "/fans/deleteFans"
      }
      postRequest(url, {
        uid: this.uid,
        fid: window.localStorage.getItem('id'),
      }).then(response => {
        this.isLoading = true;
        console.log(response);
        if (response.status == 200) {
          this.isFans = !this.isFans;
          this.getCountOfFansByUid();
          this.$message({type: 'success', message: response.data.msg});
        }
        this.isLoading = false;
      }, reason => {
        console.log(reason);
        if (reason.status == 403) {
          this.$message({type: 'error', message: reason.data.msg})
        }
      })
    },
    // 获取指定uid的文章集合
    getArchivesByUid() {
      var url = "/article/getArchives?uid=" + this.uid;
      getRequest(url,).then(response => {
        console.log(response);
        if (response.status == 200) {
          this.archives = response.data.data;
        }
      }, reason => {
        if (reason.response.status == 403) {
          this.$message({type: 'error', message: reason.response.msg});
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 1100px;
  /*height: calc(100% - 50px);*/
  height: auto;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}

.container .el-button {
  margin-bottom: 10px;
}

.container .left {
  width: 200px;
  height: 100%;
  /*background-color: #3a8ee6*/
}

.container .right {
  width: 895px;
  height: 100%;
  overflow: auto;


}

.blog_content {
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px 0px;
  border-radius: 10px;
}

.blog_content .title {
  color: black;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  padding: 10px 0;
}

.blog_content .date {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.blog_content #content {
  color: black;
  /* 缩进 */
  text-indent: 2em;
  margin-top: 10px;
  line-height: 30px;
  font-size: 17px;
  scroll-behavior: auto;
  opacity: 60%;
}

// 文章列表CSS
.blogs {
  /*左对齐*/
  text-align: left;
  cursor: pointer;
}

.blogs li {
  /*去除起前面的点*/
  list-style-type: none;
  /*内部间距*/
  padding: 5px 0 5px;
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
  font-size: 20px;
  line-height: 1.5;
}

.card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 30px;
}

.card img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  /*padding: 0px;*/
}

.card h3 {
  text-align: center;
  padding: 10px;
}

.card a {
  display: block;
  text-align: center;
  padding: 10px;
  color: black;
  text-decoration: none;
}

.card .counter1 {
  padding: 5px;
  display: flex;
  justify-content: space-between;
}

.card .counter2 {
  padding: 12px;
  display: flex;
  justify-content: space-between;
}

.Article {
  text-align: left;
}

.Article .link {
  color: black;
  text-decoration: none;
}

.Article .link .title {
  color: #8c939d;
  margin: 7px 0 7px;
  font-size: 15px;
  line-height: 1.5;
  border-bottom: 2px solid #f0f0f0;
}

.Article li:hover .title {
  color: #42b983;
}

</style>
