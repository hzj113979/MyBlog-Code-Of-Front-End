<template>
  <div class="collection">
    <div class="collection-content">
      <div class="list-wrap">
        <div class="collection-list">
          <div class="ull">
            <!-- 收藏顶部部分 -->
            <div class="titleHead">
              <div class="nameBox">
                <span>
                  <span class="collection-folder-name">我的收藏夹</span>
                </span>
              </div>
              <span class="collection-detail">
                <p class="collection-edit-box">
                  <em class="cursor line" @click="$alert('功能还未实现')">
                    批量删除
                  </em>
                </p>
              </span>
            </div>
            <!-- 收藏内容部分 -->
            <div class="collection-sublist">
              <ul>
                <li v-for="item in collectList" :key="item.aid" class="item">
                  <div class="collection-con">
                    <span>
                      <span class="collection-dir">
                        <!-- 文章类型 -->
                        <em class="conllection-type">
                        </em>
                        <!-- 文章标题 -->
                        <span class="subtitle" @click="itemClick(item.aid)">
                          {{ item.title }}
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="collect-detail-right">
                    <input type="checkbox" name="ids" :value="item.aid" />
                    <!-- 取消收藏 -->
                    <a class="collect-cancel" @click="deleteCollect(item.aid)" style="color: #108ee9;">
                      删除
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRequest, deleteRequest } from '../utils/api'
export default {
  inject: ['reload'],
  data() {
    return {
      userId: 0,
      collectList: [],
      newsData: [], //存放接收后端的数据
      loading: false,
    }
  },
  mounted: function () {
    var _this = this;
    // 数据加载
    this.loading = true;
    var _this = this;
    _this.getUserId()
    clearTimeout(this.timer);  //清除延迟执行
    this.timer = setTimeout(() => {   //设置延迟执行
      var _this = this;
      _this.loadCollect()
    }, 2000);
  },
  methods: {
    // 获取当前用户ID
    async getUserId() {
      var _this = this;
      await getRequest("/user/currentUserId").then(function (msg) {
        _this.userId = msg.data.data
      })
    },
    // 查询该用户收藏
    loadCollect() {
      var _this = this;
      var nid = _this.userId
      console.log(_this.userId)
      var url = "/collection/selectCollectionByUid" + "?uid=" + nid
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.collectList = resp.data.data.titles;
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
        //压根没见到服务器
        _this.loading = false;
        _this.$message({ type: 'error', message: '数据加载失败!' });
      })
    },
    //
    deleteCollect(aid) {
      var _this = this;
      this.loading = true;
      var url = '/collection/deleteCollectionByAid/' + aid
      deleteRequest(url).then(resp => {
        if (resp.status == 200) {
          _this.$message({ type: 'success', message: '删除成功!' });
          location.reload()
        }
        _this.loading = false;
      }, resp => {
        _this.loading = false;
        _this.$message({ type: 'error', message: '删除失败!' });
      });
    },
    itemClick(cd) {
      this.$router.push({ path: '/blogDetail', query: { aid: cd } })
    },
    deletes() {
      var els = document.getElementById
    }
  },
  props: ['state']
}
</script>
<style>
.collection {
  width: 100%;
  background: #fff;
  zoom: 1;
  display: block;
}

.collection-content {
  background-image: linear-gradient(to bottom right, #f9a7a7, #66b1ff);
  min-height: 400px;
  height: 858px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nameBox {
  height: 32px;
}

.nameBox span:first-child {
  font-size: 18px !important;
  color: #60616c;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.collection-folder-name {
  display: block;
}

.list-wrap {
  min-height: 760px;
}

.collection .collection-list .ull {
  border: none;
  position: relative;
  padding: 16px 0;
  line-height: 20px;
  list-style: none;
}

.collection-detail {
  width: 100% !important;
  display: block;
}

.collection-edit-box {
  width: 100%;
}

.collection-edit-box em {
  color: #108ee9;
  font-style: normal;
  margin-right: -90%;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}

.collection-sublist {
  margin-top: 8px;
  margin-bottom: -17px;
  padding: 0 16px;
}

.collection-sublist ul li {
  padding: 0;
  position: relative;
  margin-top: 0;
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 4px;
  margin-bottom: 8px;
  height: 52px;
  overflow: hidden;
  line-height: 52px;
}

.collection-con {
  position: relative;
  padding: 0 24px;
  background: #fff;
  display: inline-block;
  width: 100%;
  font-size: 14px !important;
  line-height: 52px;
}

.collection-list li span {
  display: block;
}

.collection-dir {
  width: 89%;
  font-size: 14px !important;
  color: #555666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.subtitle {
  color: #555666;
  display: inline;
  cursor: pointer;
}

.collect-detail-right {
  position: absolute;
  right: 30px;
  width: 150px;
  height: 100%;
  top: 0;
  text-align: right;
  line-height: 52px;
  padding-right: 18px;
}

.collect-cancel {
  margin-right: 10px;
  text-decoration: none;
  cursor: pointer;
}

.collect-cancel:hover {
  color: #108ee9;
}

.collect-detail-right a img {
  position: relative;
  top: 3px;
  left: 6px;
  border: 0;
}
</style>
