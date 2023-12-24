<template>
  <div class="body">
    <el-table class="transparent-table" ref="multipleTable" :data="articles" tooltip-effect="dark"
              style="width: 100%; overflow-x: hidden; overflow-y: hidden; " max-height="390"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35" align="left" v-if="showEdit || showDelete">
      </el-table-column>
      <el-table-column label="标题" width="400" align="left">
        <template  slot-scope="scope" >
          <span style="color: #000000;cursor: pointer" v-if="showEdit">
          {{ scope.row.title }}
          </span>
          <span v-else style="color: #409eff;cursor: pointer" @click="itemClick(scope.row)">
            {{scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最近编辑时间" width="140" align="left">
        <template slot-scope="scope">{{ scope.row.editTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="nickname" label="作者" width="120" align="left">
      </el-table-column>
      <el-table-column prop="cateName"
                       label="所属分类"
                       width="120"
                       align="left">
      </el-table-column>
      <el-table-column label="操作" align="left" v-if="showEdit || showDelete">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-if="showEdit">
            编辑
          </el-button>
          <el-button size="mini" @click="handleRestore(scope.$index, scope.row)" v-if="showRestore">
            还原
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="showDelete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="blog_table_footer">
      <span></span>
      <el-pagination background :page-size="pageSize" layout="prev, pager, next" :total="totalCount"
                     @current-change="currentChange" v-show="this.articles.length > 0">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
.blog_table_footer {
  display: flex;
  box-sizing: content-box;
  padding-top: 10px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  justify-content: space-between;
}

/*最外层透明*/
/deep/ .el-table, /deep/ .el-table__expanded-cell {
  background-color: transparent;
}

/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
  background-color: transparent;
}

</style>

<script>
import {putRequest} from '../utils/api'
import {getRequest} from '../utils/api'

export default {
  data() {
    return {
      articles: [],
      selItems: [],
      loading: false,
      currentPage: 1,
      totalCount: -1,
      pageSize: 6,
      keywords: '',
      dustbinData: []
    }
  },
  mounted: function () {
    var _this = this;
    this.loading = true;
    this.loadBlogs(1, this.pageSize);
    window.bus.$on('blogTableReload', function () {
      _this.loading = true;
      _this.loadBlogs(_this.currentPage, _this.pageSize);
    });

  },
  methods: {
    searchClick() {
      this.loadBlogs(1, this.pageSize);
    },
    itemClick(row) {
      this.$router.push({path: '/blogDetail', query: {aid: row.id}})
    },
    deleteMany() {
      var selItems = this.selItems;
      for (var i = 0; i < selItems.length; i++) {
        this.dustbinData.push(selItems[i].id)
      }
      this.deleteToDustBin(selItems[0].state)
    },
    //翻页
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.loading = true;
      this.loadBlogs(currentPage, this.pageSize);
    },
    loadBlogs(page, count) {
      var _this = this;
      var url = '';
      page = page === undefined ? 1 : page;
      if (this.state == -2) {
        url = "/admin/article/all" + "?page=" + page + "&count=" + count + "&keywords=" + this.keywords;
      } else {
        url = "/article/getArticleByState?state=" + this.state + "&page=" + page + "&count=" + count + "&keywords=" + this.keywords;
      }
      getRequest(url).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          _this.articles = resp.data.articles;
          _this.totalCount = resp.data.totalCount;
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }, resp => {
        _this.loading = false;
        if (resp.response.status == 403) {
          _this.$message({type: 'error', message: resp.response.data});
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }).catch(resp => {
        _this.loading = false;
        _this.$message({type: 'error', message: '数据加载失败!'});
      })
    },
    handleSelectionChange(val) {
      this.selItems = val;
    },
    handleEdit(index, row) {
      this.$router.push({path: '/postArticle', query: {from: this.activeName, aid: row.id}});
    },
    handleDelete(index, row) {
      this.dustbinData.push(row.id);
      this.deleteToDustBin(row.state);
    },
    handleRestore(index, row) {
      let _this = this;
      this.$confirm('将该文章撤销删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.loading = true;
        putRequest('/article/restoreArticle', {articleId: row.id}).then(resp => {
          if (resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            if (data.status == '200') {
              window.bus.$emit('blogTableReload')//通过选项卡都重新加载数据
            }
          } else {
            _this.$message({type: 'error', message: '还原失败!'});
          }
          _this.loading = false;
        });
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消还原'
        });
      });
    },
    deleteToDustBin(state) {
      var _this = this;
      this.$confirm(state != 2 ? '将该文件放入回收站，是否继续?' : '永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.loading = true;
        var url = '';
        if (_this.state == -2) {
          url = "/admin/article/dustbin";
        } else {
          url = "/article/dustbin";
        }
        putRequest(url, {aids: _this.dustbinData, state: state}).then(resp => {
            if (resp.status == 200) {
              var data = resp.data;
              _this.$message({type: data.status, message: data.msg});
              if (data.status == '200') {
                window.bus.$emit('blogTableReload')//通过选项卡都重新加载数据
              }
            } else {
              _this.$message({type: 'error', message: '删除失败!'});
            }
            _this.loading = false;
            _this.dustbinData = []
          },
          resp => {
            _this.loading = false
            _this.$message({type: 'error', message: '删除失败!'});
            _this.dustbinData = []
          },
          location.reload()
        );

      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
        _this.dustbinData = []
      });

    }

  },
  props: ['state', 'showEdit', 'showDelete', 'activeName', 'showRestore']
}
</script>

