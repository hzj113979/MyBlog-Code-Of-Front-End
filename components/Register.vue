<template>
  <div class="loginbody">
    <div class="logindata">
      <div class="logintext">
        <h2>注册</h2>
      </div>
      <div class="formdata">
        <el-form ref="form" :model="registerForm" :rules="rules">
          <el-form-item prop="nickname">
            <el-input v-model="registerForm.nickname" clearable placeholder="请输入你的名字"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" clearable placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" clearable placeholder="至少8位密码，区分大小写" show-password></el-input>
          </el-form-item>
          <el-form-item prop="passwords">
            <el-input v-model="registerForm.passwords" clearable placeholder="确认密码" show-password></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="registerbtn">
        <router-link :to="{ name: 'Login' }">
          <span style="float: right;">使用已有账户登录</span>
        </router-link>
      </div>
      <div class="butt">
        <el-button type="primary" @click.native.prevent="submitClick2">注册</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { postRequest } from '../utils/api'
export default {
  name: 'register',
  data() {
    return {
      rules: {
        nickname: [{ required: true, trigger: 'blur' }],
        username: [{ required: true, trigger: 'blur' }],
        checkPass: [{ required: true, trigger: 'blur' }]
      },
      checked: true,
      registerForm: {
        nickname: '',
        username: '',
        password: '',
        passwords: ''
      },
      loading: false
    }
  },
  methods: {
    submitClick2: function () {
      var _this = this;
      this.loading = true;
      if (this.registerForm.nickname == null || this.registerForm.nickname === '') {
        _this.$alert("昵称不能为空")
      } else if (this.registerForm.username == null || this.registerForm.username === '') {
        _this.$alert("用户名不能为空")
      } else if (this.registerForm.password == null || this.registerForm.password === '') {
        _this.$alert("密码不能为空")
      } else if (this.registerForm.password.length < 8) {
        _this.$alert("密码长度不够")
      } else if (this.registerForm.passwords !== this.registerForm.password) {
        _this.$alert("两次密码输入不一致")
      } else {
        postRequest('/ul/register', {
          nickname: this.registerForm.nickname,
          username: this.registerForm.username,
          password: this.registerForm.password
        }).then(resp => {
          _this.loading = false;
          if (resp.status == 401)
            _this.$alert('用户名重复');
          if (resp.status == 200) {
            //成功
            var json = resp.data;
            if (json.status == '200') {
              _this.$alert('注册成功');
              _this.$router.replace({ path: '/login' });
            } else {
              console.log(resp)
              _this.$alert('注册失败!', '失败!');
            }
          } else {
            //失败
            _this.$alert('后端数据响应失败!', '失败!');
          }
        }, resp => {
          _this.loading = false;
          _this.$alert('找不到服务器', '失败!');
        });
      }
    }
  }
}
</script>
<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  background-color: #f0f2f5;
  background-size: 100% 100%;
  background-position: center center;
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 100px;
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
  margin-left: 50%;
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
</style>
