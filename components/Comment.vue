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
          }}
        </div>
        <el-tag v-if="comment.uid==uid" size="mini">作者</el-tag>
        <div style="color: #8c939d; font-size: 10px"> {{ comment.createTime | formatDateTime }}</div>
        <div class="comment_content">{{ comment.content }}</div>
        <div class="comment_play">
          <span class="el-icon-sunny" style="color: #8c939d"></span>
          <span class="el-icon-heavy-rain" style="color: #8c939d"></span>
          <span class="el-icon-share" style="color: #8c939d"></span>
          <span class="el-icon-chat-dot-round comment_reply_button"
                @click="showCommentBox(comment.username)">
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
              <el-tag v-if="reply.uid == uid" size="mini" style="color: rgb(103,124,232)">作者</el-tag> : {{ reply.content }}
            </span>
          <span class="el-icon-chat-dot-round comment_reply_button"
                @click="showCommentBox(reply.username)">
                          </span>
        </div>
      </div>
      <div class="comment_reply_more" v-if="comment.commentsReplies.length > 1">查看更多...</div>
    </div>
    <div style="padding-left: 0px" v-show="commentBoxShow">
      <el-input
        ref="commentReplyRef"
        placeholder="恶语伤人六月寒"
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
              style="">评论</el-button>
    </div>
    <hr style="margin-top: 10px; background-color: #8c939d"/>
  </div>
</template>

<script>
import {getRequest, postRequest} from "../utils/api";

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
    index:{ // 当前子组件的索引, 通过属性传过来, 主要用于在父组件中能从v-for循环到的组件中标识到唯一到当前组件
      type:Number
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
    showCommentBox(username) {
      if(this.commentBoxShow){
        this.commentBoxShow = false;
        this.textarea_reply = '';
      }else{
        this.commentBoxShow = true
        this.textarea_reply = this.textarea_reply + ' @' + username + ' '
        this.$emit('closeOtherCommentBoxExcept', this.index)
      }
    },
    hideCommentBox() {
      this.commentBoxShow = false
    },
    replyComment(commentId, replyUid) {
      var url = "/comment/reply";
      postRequest(url, {
        commentId: commentId,
        content: this.textarea_reply,
        uid: this.uid,
        replyUid: replyUid
      }).then(resp => {
        if (resp.status == 200) {
          this.$message({type: 'success', message: '回复成功!'});
          this.textarea_reply = '';
          this.showCommentBox = false;
          this.$emit('reloadComments')
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
