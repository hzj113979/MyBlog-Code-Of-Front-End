<template>
  <el-container class="post-article">
    <el-header class="header">
      <el-select v-model="article.cid" placeholder="请选择文章栏目" style="width: 150px; margin-bottom: 50px">
        <el-option v-for="item in categories" :key="item.id" :label="item.cateName" :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="article.title" placeholder="请输入标题..." style="width: 400px;margin-left: 10px"></el-input>
      <el-tag :key="tag" v-for="tag in article.dynamicTags" closable :disable-transitions="false"
              @close="handleClose(tag)" style="margin-left: 10px">
        {{ tag }}
      </el-tag>
      <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">+Tag</el-button>
    </el-header>
    <el-main class="main">
      <div id="editor">
        <v-md-editor style="height: 100%;width: 100%;"
                     v-model="article.mdContent"
                     :include-level="[1, 2]"
                     left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code |save | emoji mermaid katex"
                     right-toolbar="preview toc sync-scroll fullscreen"
        ></v-md-editor>
      </div>
      <div style="display: flex;align-items: center;margin-top: 15px;justify-content: flex-end">
        <el-button @click="cancelEdit" v-if="from != undefined">放弃修改</el-button>
        <template v-if="from == undefined || from == 'draft'">
          <el-button @click="saveBlog(0)">保存到草稿箱</el-button>
          <el-button type="primary" @click="saveBlog(1)">发表文章</el-button>
        </template>
        <template v-else="from==post">
          <el-button type="primary" @click="saveBlog(0)">保存修改</el-button>
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
import { uploadFileRequest } from '../utils/api'
import { isNotNullORBlank } from '../utils/utils'
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor';

// 调用方法将 markdown 转换成 html 并使用 xss 过滤
// Vue2

export default {
  data() {
    return {
      categories: [],
      tagInputVisible: false,
      tagValue: '',
      loading: false,
      from: '',
      article: {
        id: '-1',
        dynamicTags: [],
        title: '',
        mdContent: '',
        cid: ''
      }
    }
  },
  mounted: function () {
    this.getCategories();
    var from = this.$route.query.from;
    this.from = from;
    var _this = this;
    if (from != null && from != '' && from != undefined) {
      var id = this.$route.query.aid;
      this.id = id;
      this.loading = true;
      getRequest("/article/EditArticleById/" + id).then(resp => {
        _this.loading = false;
        if (resp.status == 200) {
          console.log(resp.data)
          _this.article = resp.data.data;
          var tags = _this.article.tags;
          _this.article.dynamicTags = []
          for (var i = 0; i < tags.length; i++) {
            _this.article.dynamicTags.push(tags[i].tagName)
          }
        } else {
          _this.$message({ type: 'error', message: '页面加载失败!' })
        }
      }, resp => {
        // 说明不是从草稿箱里面编辑来的
        _this.loading = false;

        // _this.$message({ type: 'error', message: '页面加载失败!' })
      })
    }
  },
  methods: {
    cancelEdit() {
      this.$router.go(-1)
    },
    saveBlog(state) {
      if (!(isNotNullORBlank(this.article.title, this.article.mdContent, this.article.cid))) {
        this.$message({ type: 'error', message: '数据不能为空!' });
        return;
      }
      var _this = this;
      _this.loading = true;
      console.log(_this.article.dynamicTags)
      // const html = xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(_this.article.mdContent));
      postRequest("/article/addNewArticle", {
        id: _this.article.id,
        title: _this.article.title,
        mdContent: _this.article.mdContent,
        // htmlContent: _this.$refs.md.d_render,
        htmlContent:  xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(_this.article.mdContent)),
        cid: _this.article.cid,
        state: state,
        dynamicTags: _this.article.dynamicTags
      }).then(resp => {
        _this.loading = false;
        if (resp.status == 200 && resp.data.status == '200') {
          _this.article.id = resp.data.msg;
          _this.$message({ type: 'success', message: state == 0 ? '保存成功!' : '发布成功!' });
          //            if (_this.from != undefined) {
          window.bus.$emit('blogTableReload')
          //            }
          if (state == 1) {
            _this.$router.replace({ path: '/articleList' });
          }
        }
      }, resp => {
        _this.loading = false;
        _this.$message({ type: 'error', message: state == 0 ? '保存草稿失败!' : '博客发布失败!' });
      })
    },
    imgAdd(pos, $file) {
      var _this = this;
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('image', $file);
      uploadFileRequest("/article/uploadimg", formdata).then(resp => {
        var json = resp.data;
        if (json.status == 'success') {
          //            _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
          _this.$refs.md.$imglst2Url([[pos, json.msg]])
        } else {
          _this.$message({ type: json.status, message: json.msg });
        }
      });
    },
    imgDel(pos) {
    },
    getCategories() {
      let _this = this;
      getRequest("/category/getAllCategories").then(resp => {
        _this.categories = resp.data;
      });
    },
    handleClose(tag) {
      this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.tagInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let tagValue = this.tagValue;
      if (tagValue) {
        this.article.dynamicTags.push(tagValue);
      }
      this.tagInputVisible = false;
      this.tagValue = '';
    }
  },

  // props: ['_id','_dynamicTags','_title','_mdContent','_cid']
}
</script>
<style scoped>
.post-article{
  background-color: rgba(255, 255, 255, 0.5);
}
.post-article>.main>#editor {
  width: 100%;
  height: 450px;
  text-align: left;
}

.post-article>.header {
  background-color: #ececec;
  margin-top: 0px;
  padding-left: 5px;
  padding-bottom: 50px;
  display: flex;
  justify-content: flex-start;
}

.post-article>.main {
  /*justify-content: flex-start;*/
  display: flex;
  flex-direction: column;
  /*padding-left: 5px;*/
  background-color: #ececec;
  padding-top: 0px;

}

.post-article>.header>.el-tag+.el-tag {
  margin-left: 10px;
}

.post-article>.header>.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.post-article>.header>.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
