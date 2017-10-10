<template>
  <div>
    <div class="loading" v-if="this.isLoading"> 
      <icon-loading></icon-loading>
    </div>
    <div class="disqusjs">
      <header>
        <nav>
          <ul>
            <li class="count"><span>{{ comments.length }}</span>&nbsp;条评论</li>
          </ul>
        </nav>
      </header>
      <div class="currentuser-container">
        <div class="container">
          <img class="avatar" src="//oiw32lugp.qnssl.com/2017-04-12-giraffe.jpg">
          <div>
            <textarea ref="textarea" placeholder="我想对博主说... (///▽///)"></textarea>
            <div class="errormsg">
              <span></span>
            </div>
            <footer ref="footer">
              <button ref="button" on-click="{onSubmit}">发表评论</button>
            </footer>
          </div>
        </div>
        <form>
          <p class="title">访客信息</p>
          <input ref="name" type="text" placeholder="昵称">
          <input ref="email" type="email" placeholder="邮箱" />
          <p class="notice">经过可爱的博主同意后你的留言就会出现在页面上了 (≧▽≦)</p>
        </form>
      </div>
      <ul class="comments-container">
        <li class="comment" v-for="comment in comments">
          <img :src="comment.author.avatar.cache" alt="avatar" class="avatar">
          <div>
            <header>
              <span>{{ comment.author.name }}</span>
              <span>{{ timeago(comment.createdAt) }}</span>
            </header>
            <p>{{ comment.raw_message }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import 'normalize.css';
  export default {
    props: {
      apiURL: String
    },
    mounted() {
      this.isLoading = true;
      fetch(`${this.apiURL}/comments?url=https://yemengying.com/2017/09/04/oracle-foreignkey-lock/`)
        .then(res => res.json())
        .then(comments => { this.comments = comments.response; })
    },
    data() {
      return {
        isLoading: false,
        comments: []
      };
    },
    methods: {
      timeago(createdAt) {
        const gap = Date.now() - Date.parse(createdAt);
        switch (true) {
          case gap < 6E4: return '刚刚';
          case gap < 36E5: return Math.round(gap / 6E4) + ' 分钟前';
          case gap < 864E5: return Math.round(gap / 36E5) + ' 小时前';
          case gap < 2592E6: return Math.round(gap / 864E5) + ' 天前';
          case gap < 31536E6: return Math.round(gap / 2592E6) + ' 个月前';
          case gap >= 31536E6: return Math.round(gap / 31536E6) + ' 年前';
        }
      }
    },
    components: {
      iconLoading: require('./components/loading.vue').default
    }
  };
</script>

<style scoped>
  p,
  ul, ol {
    margin: 0;
    padding: 0;
  }
  .loading {
    text-align: center;
  }
  .disqusjs {
    font-family: PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
    font-size: 14px;
    * {
      box-sizing: border-box;
    }
    > header {
      border-bottom: 2px solid #e7e9ee;
      margin-bottom: 24px;
      > nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > ul {
          > li {
            width: 105px;
            display: inline-block;
            text-align: center;
            font-weight: 500;
            &.count {
              display: inline-block;
              color: #2a2e2e;
              font-size: 15px;
              padding: 12px 0;
              margin-right: 15px;
              font-weight: 700;
              border-bottom: 2px solid #2e9fff;
              margin-bottom: -1px;
              > span { margin-right: 5px; }
            }
          }
        }
      }
    }
    .currentuser-container {
      margin-bottom: 24px;
      padding: 0 15px;
      overflow: auto;
      > .container {
        display: flex;
        > .avatar {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 3px;
          margin-right: 10px;
          vertical-align: middle;
        }
        > div {
          width: 100%;
          > textarea {
            box-sizing: border-box;
            height: 48px;
            display: block;
            border: 2px solid #dbdfe4;
            border-radius: 4px;
            padding: 15px 10px;
            resize: none;
            cursor: text;
            color: #2a2e2e;
            width: 100%;
            font-family: "Helvetica Neue",arial,sans-serif;
            line-height: 1.4;
            word-break: break-word;
            font-size: 14px;
            &.error { border-color: #F55567; }
            &:focus { outline: none; }
          }
          > .errormsg {
            > svg { vertical-align: middle; }
            margin-bottom: 5px;
            background-color: #F55567;
            padding: 10px 15px;
            color: #fff;
            font-weight: 300;
            font-size: 13px;
          }
          > footer {
            box-sizing: border-box;
            margin-top: -5px;
            opacity: 0;
            transition: opacity linear .2s;
            background-color: #F6F8F9;
            height: 36px;
            width: 100%;
            border: 2px solid #dbdfe4;
            border-radius: 4px;
            > svg {
              vertical-align: middle;
              margin: 8px;
            }
            > button {
              box-sizing: border-box;
              float: right;
              background-color: #737F87;
              color: #fff;
              padding: 4px 15px;
              border-bottom-right-radius: 4px;
              margin-top: -1px;
              margin-right: -1px;
              height: 34px;
              border: none;
              cursor: pointer;
              outline: none;
              &:hover { background-color: rgba(29,47,58,.7); }
              &:disabled {
                opacity: .6;
                cursor: not-allowed;
              }
            }
          }
        }
      }
      > form {
        float: right;
        display: none;
        &.show { display: block; }
        > .title {
          margin: 10px 0;
        }
        > .notice {
          margin: 10px 0;
          font-size: 13px;
          color: #7f919e;
          font-weight: 300;
        }
        > input {
          box-sizing: border-box;
          background-color: #fff;
          color: #7f919e;
          padding: 5px 9px;
          border: 2px solid #dbdfe4;
          display: block;
          border-radius: 4px;
          font-size: 13px;
          height: 32px;
          width: 100%;
          margin-bottom: 12px;
          &.error { border-color: #F55567; }
          &:focus { outline: none; }
        }
      }
    }
    .comments-container {
      .comment {
        display: flex;
        align-items: top;
        padding: 0 15px;
        margin-bottom: 24px;
        > .avatar {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          margin-right: 10px;
          border-radius: 3px;
        }
        .responseform { margin-top: 15px; }
        .date {
          color: #656c7a;
          font-weight: 300;
          font-size: 12px;
        }
        .author {
          color: rgb(42, 146, 189);
          font-weight: 700;
          margin-right: 5px;
        }
        .comment {
          font-weight: 400;
          margin: 0;
          margin-top: 10px;
          color: #2a2e2e;
          margin-bottom: 5px;
          display: inline-block;
        }
        footer {
          > ul {
            > li {
              display: block;
              font-size: 13px;
              > a {
                color: #656c7a;
                text-decoration: none;
                display: inline-block;
                &.active { color: #2e9fff; }
              }
            }
          }
        }
      }
    }
  }
</style>

