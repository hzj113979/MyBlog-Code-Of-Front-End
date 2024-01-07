<template>
  <div>
    <div style="text-align: left;height: auto; display: flex">
      <div>
        <el-avatar :size="size" src="../assets/MyBlog-logo.png" @error="errorHandler">
          <img :src="comment.avatar"/>
        </el-avatar>
      </div>
      <div style="padding-left: 10px">
        <div style="color: #66b1ff">{{
            comment.username
          }}<el-tag v-if="comment.uid==uid" size="mini" style="color: rgb(103,124,232)">作者</el-tag>
        </div>

        <div style="color: #8c939d; font-size: 10px"> {{ comment.createTime | formatDateTime }}</div>
        <div class="comment_content">{{ comment.content }}</div>
        <div class="comment_play">
          <el-tooltip class="item" effect="dark" content="点个赞" placement="bottom">
            <span class="el-icon-sunny" @click="praiseComment(comment)" style="color: #8c939d" v-model="comment.praise_count">{{ comment.praiseCount }}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="踩一脚" placement="bottom">
            <span class="el-icon-heavy-rain"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="举报" placement="bottom">
            <span class="el-icon-warning item"></span>
          </el-tooltip>
          <span class="el-icon-chat-dot-round comment_reply_button"
                @click="showCommentBox(comment.username,comment.uid)">
                          </span>
        </div>
      </div>
    </div>
    <div class="comment_reply">
      <div v-for="(reply,idx) in comment.commentsReplies"
           ref="replyComment"
           :key=idx
           class="item">
        <div style="text-align: left; width: 320px;height: auto;padding-left: 20px;">
            <span>
              <span class="comment_reply_content">{{ reply.username }}</span>
              <el-tag v-if="reply.uid == uid" size="mini" style="color: rgb(103,124,232)">作者</el-tag> :
              <span v-html="reply.altName"></span>
              <!--              <span style='color: #66b1ff'>@xxx</span>-->
              {{ reply.content }}
            </span>
          <span class="el-icon-chat-dot-round comment_reply_button"
                @click="showCommentBox(reply.username, reply.uid)">
                          </span>
        </div>
      </div>
      <div class="comment_reply_more" v-if="comment.commentsReplies.length > 1">查看更多...</div>
    </div>
    <div style="padding-left: 0px" v-show="commentBoxShow">
      <el-input
        ref="commentReplyRef"
        :placeholder="altName"
        type="textarea"
        resize="none"
        v-model="textarea_reply"
        maxlength="1000"
        show-word-limit
        style="width: 80%;margin-top: 5px;margin-left: 0px"
      >
      </el-input>
      <el-button type="primary"
                 icon="el-icon-s-promotion"
                 size="mini"
                 style=""
                 @click="replyComment(comment.id, comment.uid)"
      >评论
      </el-button>
    </div>
    <hr style="margin-top: 10px; background-color: #8c939d"/>
  </div>
</template>

<script>
import {getRequest, postRequest, postRequest_json} from "../utils/api";

export default {
  name: "comment",
  props: {
    comment: {
      type: Object,
      required: true
    },
    aid: {
      required: true
    },
    uid: {
      default: 0
    },
    index: { // 当前子组件的索引, 通过属性传过来, 主要用于在父组件中能从v-for循环到的组件中标识到唯一到当前组件
      type: Number
    },
    currentPage: {
      default: 1
    },
    pageSize: {
      default: 6
    },

  },
  data() {
    return {
      circleUrl: '../assets/MyBlog-logo.png',// 头像
      size: 'medium',
      comments_isLoading: true,
      textarea: '', // 一级评论
      textarea_reply: '',// 回复评论
      altName: '恶语伤人六月寒',
      replyUid: '',
      commentBoxShow: false
    }
  },
  methods: {

    errorHandler() {
      return true
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getComments();
    },
    showCommentBox(username, replyUid) {
      if (this.commentBoxShow) {
        this.commentBoxShow = false
        this.textarea_reply = ''
        this.altName = ''
        this.replyUid = '';
      } else {
        this.commentBoxShow = true
        this.altName = ' @' + username + ' '
        this.replyUid = replyUid
        this.$emit('closeOtherCommentBoxExcept', this.index)
      }
    },
    hideCommentBox() {
      this.commentBoxShow = false
    },
    replyComment(commentId, replyUid) {
      let _this = this;
      let alt = "<span style='color: #66b1ff'>"+this.altName+"<span>"
      console.log("=======")
      console.log("replyUid="+this.replyUid)
      var url = "/comment/reply";
      postRequest_json(url, {
        commentId: commentId,
        content: this.textarea_reply,
        uid: this.uid,
        replyUid: replyUid,
        altName: alt,
      }).then(resp => {
        if (resp.status == 200) {
          _this.$message({type: 'success', message: '回复成功!'});
          _this.textarea_reply = '';
          _this.altName = '';
          _this.commentBoxShow = false;
          // this.reply.children.push(resp.data.data) // 将结果放入到reply.children中
          _this.$emit('reloadComments')
        }
      },resp => {
        _this.loading = false;
        _this.$message({type: 'error', message: '回复失败!'});
      })
    },
    praiseComment(comment){
      // console.log(comment)
      var _this = this;
      postRequest("/comment/praise", {
        id: comment.id,
      }).then(resp => {
        if (resp.data.status == 200) {
          _this.$message({type:'success', message: resp.data.msg});
          comment.praiseCount = comment.praiseCount + 1;
        }else{
            _this.loading = false;
            _this.$message({type: 'error', message: resp.data.msg});
        }
      })
    }
  }
}
</script>

<style scoped>
// ===========下面是评论部分的CSS=========//
.comment_content {
  padding-top: 15px
}

.comment_play {
  padding-top: 10px;
}

.comment_play span {
  margin-right: 10px;
}

.comment_reply {
  background-color: #f1f1f5;
  margin: 10px;
  width: 380px;
  border-radius: 8px
}

.comment_reply_content {
  color: #66b1ff
}

.comment_reply_more {
  margin: 10px 0 5px 0;
  padding-bottom: 10px;
  width: 100px;
  padding-left: 10px;
  color: #66b1ff;
}

.comment_reply_button {
  color: #8c939d;
  padding-left: 0px;
  cursor: pointer;
  z-index: 9999;
}

/* 浏览器滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(174, 174, 174);
  border-radius: 50px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>
