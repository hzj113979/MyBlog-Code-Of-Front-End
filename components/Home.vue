<template>
  <el-container class="home_container">
    <el-header>
      <div style="width: 300px;">一个主打技术分享的博客</div>
      <div class="home_userinfoContainer">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo">
            {{ currentUserName }}<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sysMsg">系统消息</el-dropdown-item>
            <el-dropdown-item command="MyArticle">我的文章</el-dropdown-item>
            <el-dropdown-item command="MyHome">个人主页</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container >
      <el-aside width="200px"  style="background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff)">
        <SideBar />
      </el-aside>
      <el-container>
        <el-main >
          <div class="box_main">
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
          </div>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import SideBar from '../components/SideBar.vue';
import {getRequest, postRequest} from '../utils/api';
import {locale} from "element-ui";
import {reload} from "vue-hot-reload-api";
export default {
  data() {
    return {
      currentUserName: '',//用户名
    }
  },
  components: { SideBar },
  methods: {
    handleCommand(command) {
      var _this = this;
      if (command === 'logout') {
        this.$confirm('注销登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          postRequest("/ul/logout")
          localStorage.clear()
          // window.location.reload()
          _this.currentUserName = '游客';
          _this.$router.replace('/')
        }, function () {
          //取消
        })
      }
    },
    loadBlogs(page, count) {
      var _this = this;
      var url = '';
      url = "/admin/article/all" + "?page=" + page + "&keywords=" + this.keywords;
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.articles = resp.data.articles;
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
  },
  mounted: function () {
    var _this = this;
    getRequest("/user/currentUserName").then(resp => {
      console.log(resp);
      _this.currentUserName = '游客';
      if(resp.status == '200'){
        var data = resp.data;
        if(data.status == '200'){
          _this.currentUserName = data.msg;
        }
      }

    });
  },
}
</script>
!important
<style scoped>
.home_container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.el-header {
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  background-color: white;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
}
/*.el-header{*/
/*  text-align: center;*/
/*  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);*/
/*  background-color: #e6e6e6;*/
/*  padding: 25px;*/
/*  !*left: 0px;*!*/
/*  !*right: 0px;*!*/
/*  !*width: 100%;*!*/
/*  font-family: '华文行楷';*/
/*  font-size: 1.5em;*/
/*  margin-top: 0;*/

/*}*/


.el-aside {
  background-color: #ECECEC;
  font-size: 16px;
  line-height: 40px;
  padding-top: 30px;
}

.el-main {
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  background-color: #f5f6f7;
  color: #000;
  text-align: center;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
}

.home_userinfo {
  color: #000;
  cursor: pointer;
}

.home_userinfoContainer {
  display: inline;
  margin-right: 20px;
}

.home_userinfoContaine .el-dropdown span {
  color: #000;
}

.main_container {
  margin-top: 10px;
  margin-right: 54px;
  padding: 24px 0 0 24px;
  position: relative;
  background-color: white;
  border-radius: 2px;
}

.box_main {
  padding-right: 12px;
  width: 76%;
}
</style>
