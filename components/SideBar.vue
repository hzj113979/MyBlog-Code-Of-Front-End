<template>
  <!-- 管理者菜单 -->
    <div v-if="isAdm">
      <el-menu default-active="0" class="el-menu-vertical-demo"  router>
        <template v-for="(item, index) in this.$router.options.routes" v-if="!item.hidden">
          <el-submenu :index="index + ''" v-if="item.children.length > 1" :key="index">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children" v-if="!child.hidden" :index="child.path" :key="child.path">
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
      </el-menu>
    </div>
    <!-- 用户菜单 -->
    <div v-else>
      <el-menu default-active="0" class="el-menu-vertical-demo" style="background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff)" router>
        <template v-for="(item, index) in this.$router.options.routes" v-if="!item.hidden && item.isuser">
          <el-submenu :index="index + ''" v-if="item.children.length > 1" :key="index">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children" v-if="!child.hidden" :index="child.path" :key="child.path">
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
      </el-menu>
    </div>
</template>
<style>
  .el-menu{
    background-color: rgba(0, 0, 0, 0);
  }

</style>
<script>
import {getRequest, postRequest} from '../utils/api';

export default {
  data() {
    return {
      isAdm: ''
    }
  },
  created() {
    getRequest('/user/isAdmin').then(res => {

      if (res.data.data == true) {
        this.isAdm = true

      } else {
        this.isAdm = false
      }


    })

  }

}
</script>
