<template>
  <el-container>
    <el-header style="  font-family: '华文行楷';">
        一个主打技术分享的博客网站
    </el-header>
    <el-main>
      <router-view >
      </router-view>
    </el-main>
    <el-footer>
      @copyright
    </el-footer>
  </el-container>
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
  padding: 1px;
  height: auto;
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  overflow: hidden;
}
.el-container{
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
  color: black;
  padding: 25px;
  left: 0px;
  right: 0px;
  width: 100%;

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
