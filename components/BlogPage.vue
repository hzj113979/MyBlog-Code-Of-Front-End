<template>
  <div>
    <div class="container">
      <div class="left">
        orem ipsum dolor sit amet consectetur adipisicing elit. Velit repudiandae iusto odio, deleniti, voluptatibus
        beatae quibusdam rerum sequi accusamus a aperiam quia quidem fuga, nam laboriosam quae eum non repellat!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit repudiandae iusto odio, deleniti, voluptatibus
        beatae quibusdam rerum sequi accusamus a aperiam quia quidem fuga, nam laboriosam quae eum non repellat!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit repudiandae iusto odio, deleniti, voluptatibus
        beatae quibusdam rerum sequi accusamus a aperiam quia quidem fuga, nam laborios
      </div>
      <div class="right">
        <div class="blog_content">
          <blog_detail />
        </div>
      </div>
  </div>
    <div style="padding: 20px 20px"></div>
    <div class="container">
        <div class="left">
        </div>
        <div class="right">
          <div class="blogs">
            <ul class="list">
              <li v-for="item in articleList" :key="item.id" class="item">
                <div class="content" @click="itemClick(item.id)">
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
</template>

<script>
import BlogDetail from "./BlogDetail.vue";
import {getRequest} from "../utils/api";
import {provide} from "vue";

export default {
  name: "BlogPage",
  components: {
    "blog_detail": BlogDetail,
  },
  data() {
    return {
      aid: '',
      articleList: [],
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
    var _this = this;
    window.bus.$on('blogTableReload', function () {
      _this.loading = true;
      _this.loadBlogs(this.currentPage, this.pageSize);
    })
    this.aid = this.$route.query.aid;
    // console.log("文章ID为"+this.aid)
  },
  methods:{
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
    itemClick(id) {
      this.$router.push({ path: '/blogDetail', query: { aid: id } })
    },
  }
}
</script>

<style scoped>

.container {
  width: 1100px;
  height: calc(100% - 50px);
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}

.container .left {
  width: 200px;
  height: 100%;
  background-color: #3a8ee6
}

.container .right {
  width: 895px;
  height: 100%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.blog_content {
  height: 100%;
  width: 100%;
  padding: 10px 0px;
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
</style>
