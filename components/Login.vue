<template>
    <div class="loginbody" style="font-family: 华文行楷; right: 0px">
      <div style="margin-right: 150px">
        <div class="left-div" style="height: 300px; width: 800px; padding-right: 30px">
          <div class="block" style="text-align: center">
            <span class="demonstration">MyBlog博客系统</span>
            <el-carousel :interval="4000" type="card" height="300px">
              <el-carousel-item v-for="(item,index) in images" :key="item" style="border-radius: 30px">
                <img :src="require('../assets/' + item)" :alt="index + 1" style="width: 100%; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!--   登录    -->
        <div class="right-div">
          <div class="logindata">
            <el-card class="box-card" style="border-radius: 30px">
              <div class="logintext">
                <h2>登录</h2>
              </div>
              <div class="formdata">
                <el-form ref="form" :model="loginForm" :rules="rules">
                  <el-form-item prop="username">
                    <el-input v-model="loginForm.username" clearable placeholder="请输入账号"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input v-model="loginForm.password" clearable placeholder="请输入密码" show-password></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="registerbtn">
                <el-checkbox class="login_remember" v-model="checked" label-position="left"
                             style="float: left;">记住密码
                </el-checkbox>
                <router-link :to="{ name: 'register' }">
                  <span style="float: right;">注册账户</span>
                </router-link>
              </div>
              <div class="butt">
                  <el-button type="primary" @click.native.prevent="submitClick" style="margin-right: 78px">登录</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import {getRequest, LoginRequest} from '../utils/api';
import router from '../router';
import {reload} from "vue-hot-reload-api";


export default {
  name: 'LoginAccount',
  data() {
    return {
      rules: {
        account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        checkPass: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      checked: true,
      // isReload: false,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      images: [
        'snowAndChurch.png',
        'successfulHouse.png',
        'MyBlog-logo.png',
      ],
    }
  },

  created() {

    this.$router.options.routes[8].hidden
  },
  methods: {
    submitClick: function () {
      var _this = this;
      this.loading = true;
      LoginRequest('/ul/login', {
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          //成功
          var json = resp.data;
          // console.log(json);
          console.log("token:"+json.data.token)
          if (json.status == 200) {
            localStorage.setItem('token', json.data.token);
            getRequest('/user/isAdmin').then(res => {
              if (res.data.data === true) {
                this.$router.options.routes[8].hidden = false
              }
            })
            this.isReload = false;
            _this.$router.replace({path: '/home'});
          } else {
            _this.$alert('登录失败!', '失败!');
          }
        } else {
          //失败
          _this.$alert('登录失败!', '失败!');
        }
      }, resp => {
        _this.loading = false;
        _this.$alert('找不到服务器', '失败!');
      });
    },
  }
}
</script>
<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  /*background-color: #f0f2f5;*/
  background-size: 100% 100%;
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 150px;
}

.logintext {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 10px;
}

.logindata {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 70%;
}

.tool {
  display: flex;
  justify-content: space-between;
  color: #606266;
}

.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: #606266;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
  float: left;
}

.registerbtn {
  line-height: 40px;
  margin-right: 10px;
  font-size: 14px;
  position: relative;
  line-height: 40px;
  zoom: 1;
}

.registerbtn a {
  color: #79a4ca;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  margin-right: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.left-div,
.right-div {
  display: inline-block;
}
</style>
