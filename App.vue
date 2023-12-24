<template>
<!--  <div id="app" style="background-color: rgba(235, 235, 235, 0.08)">-->
  <el-container>
    <el-header>
        一个主打技术分享的博客
    </el-header>
    <el-main>
      <router-view >
      </router-view>
<!--      <Login />-->
    </el-main>
    <el-footer>
      @copyright
    </el-footer>
  </el-container>
<!--  </div>-->
</template>

<script>
import { TimeSelect } from 'element-ui';
import { provide } from 'vue';

export default {
  name: 'app',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
.el-main{
  padding: 0px;
  height: 100%;
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
}
.el-container{
  background-color: rgba(235, 235, 235, 0.08);
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  height: 100%;
}

.el-header{
  text-align: center;
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  background-color: #e6e6e6;
  padding: 25px;
  left: 0px;
  right: 0px;
  width: 100%;
  font-family: '华文行楷';
  font-size: 1.5em;
  margin-top: 0;

}
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
