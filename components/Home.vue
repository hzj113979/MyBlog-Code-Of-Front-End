<template>
  <el-container class="home_container">
    <el-header >
      <div style="width: 320px;font-family: '华文行楷'">一个主打技术分享的博客网站</div>
      <el-menu default-active="0"
               mode="horizontal"
               class="el-menu-demo"
               text-color="black"
               router>
        <template v-for="(item, index) in this.$router.options.routes" v-if="!item.hidden && item.isuser">
          <el-submenu :index="index + ''" v-if="item.children.length > 1" :key="index">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children"
                          v-if="!child.hidden"
                          :index="child.path"
                          :key="child.path">
              {{ child.name }}
            </el-menu-item>
          </el-submenu>
          <template v-else>
            <el-menu-item :index="item.children[0].path">
              <i :class="item.children[0].iconCls"></i>
              <span slot="title">{{ item.children[0].name }}</span>
            </el-menu-item>
          </template>
        </template>
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
      </el-menu>
    </el-header>
    <el-container >
<!--      <el-aside width="200px"  style="background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff)">-->
      <!--      <SideBar />-->
<!--      </el-aside>-->
<!--      <el-container>-->
        <el-main >
          <div class="box_main">
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
          </div>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
<!--    </el-container>-->
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
    getRequest("/user/currentUser").then(resp => {
      // console.log(resp);
      this.currentUserName = '游客';
      if(resp.status == '200'){
        var data = resp.data;
        console.log(data);
        if(data.status == '200'){
          this.currentUserName = data.data.nickname;
          console.log("current:"+this.currentUserName);
          window.localStorage.setItem('id', data.data.id);
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
  /*background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);*/
  /*background-color: black;*/
  color: black;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}


/*.el-aside {*/
/*  background-color: #ECECEC;*/
/*  font-size: 16px;*/
/*  line-height: 40px;*/
/*  padding-top: 30px;*/
/*}*/

.el-menu{
  background-color: rgba(0, 0, 0, 0);
}

.el-main {
  /*background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);*/
  background-color: #ffffff;
  color: #000;
  text-align: center;
}

.home_title {
  color: #ffffff;
  font-size: 20px;
  display: inline;
}

.home_userinfo {
  color: #ffffff;
  cursor: pointer;
}

.home_userinfoContainer {
  display: inline;
  /*padding-top: 10px;*/
  margin-left: 10px;
  margin-right: 20px;
}

.home_userinfoContaine .el-dropdown span {
  color: #000;
}
.el-dropdown{
  margin: 9px 0 0 0;
}
.main_container {
  margin-top: 10px;
  margin-right: 54px;
  padding: 24px 0 0 24px;
  position: relative;
  background-color: white;
  border-radius: 2px;
}
el-menu-item{
  width: 50px;
}

.box_main {
  padding-right: 12px;
  width: 76%;
}
</style>
