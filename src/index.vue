<template>
  <div>
    <header class="header">
      <div class="header__count"><span>{{ comments.length }}</span>&nbsp;条评论</div>
    </header>
    <div class="currentuser">
      <div class="currentuser__comment">
        <div class="currentuser__comment-avatar"></div>
        <div class="currentuser__comment-action">
          <textarea 
            v-model="form.comment"
            @blur="formValidate('comment')"
            @focus="onCommentTextareaFocus"
            ref="textarea" 
            placeholder="加入讨论..."></textarea>
        </div>
      </div>
      <form class="currentuser__form">
        <p class="currentuser__form-title">访客信息</p>
        <div>
          <input 
            ref="name"
            @blur="formValidate('name')"
            v-model="form.name" 
            type="text" 
            placeholder="昵称" />
          <input 
            ref="email"
            @blur="formValidate('email')"
            v-model="form.email" 
            type="email" 
            placeholder="邮箱" />
        </div>
        <button type="button" :disabled="!isFormValid">发表评论</button>
      </form>
    </div>
    <ul v-if="isLoading" class="comments-shell">
      <li
        v-for="n in 5"
        class="comments-shell__item">
        <div class="comments-shell__avatar"></div>
        <ul class="comments-shell__content">
          <li class="comments-shell__content-item"></li>
          <li class="comments-shell__content-item"></li>
          <li class="comments-shell__content-item"></li>
        </ul>
      </li>
    </ul>
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
</template>

<script>
  const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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
        comments: [],
        isFormValid: false,
        form: {
          comment: '',
          name: '', 
          email: ''
        }
      };
    },
    watch: {
      form: {
        handler(val) {
          const { name, email, comment } = val
          if (!name || !name.trim()) return this.isFormValid = false
          if (!comment || !comment.trim()) return this.isFormValid = false
          if (!email || !email.trim() || !emailReg.test(email)) return this.isFormValid = false
          this.isFormValid = true
        },
        deep: true
      }
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
      },
      onCommentTextareaFocus() {
        const { textarea } = this.$refs;
        if (!textarea.classList.contains('focus')) textarea.classList.add('focus');
      },
      formValidate(type) {
        switch (type) {
          case 'comment':
          case 'name':
            const field = this.form[type];
            const el = this.$refs[({ comment: 'textarea', name: 'name' })[type]]
            if (!field || !field.trim()) return el.classList.add('invalid')  
            if (el.classList.contains('invalid')) el.classList.remove('invalid')
            break;
          case 'email':
            const { email } = this.form;
            const element = this.$refs.email;
            if (!email || !email.trim() || !emailReg.test(email)) return element.classList.add('invalid')  
            if (element.classList.contains('invalid')) element.classList.remove('invalid')
            break;
        }
      }
    },
    components: {
    }
  };
</script>

<style>
  @keyframes shellPulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: .6;
    }
    100% {
      opacity: 1;
    }
  }

  .header {
    border-bottom: 2px solid #e7e9ee;
    margin-bottom: 24px;
  }

  .header__count {
    display: inline-block;
    text-align: center;
    font-weight: 500;
    display: inline-block;
    color: #2a2e2e;
    font-size: 15px;
    padding: 12px;
    margin-right: 15px;
    font-weight: 700;
    border-bottom: 2px solid #156FCD;
    margin-bottom: -1px;
    > span {
      color: #000;
      font-size: 1.2em; 
      font-weight: bold;
    }
  }

  .currentuser {
    margin-bottom: 24px;
    padding: 0 15px;
    overflow: auto;
  }

  .currentuser__comment {
    display: flex;
  }

  .currentuser__comment-avatar {
    background-color: #7F909D;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 3px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .currentuser__comment-action {
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
      word-break: break-word;
      font-size: 14px;
      outline: none;
      transition: min-height .15s ease-in-out;
      &.focus {
        min-height: 73px;
      }
      &.invalid {
        border-color: #EE6072;  
      }
    }
  }

  .currentuser__form {
    margin-top: 20px; 
    margin-left: 58px;
    input {
      margin-bottom: 10px;
      outline: none;
      display: block;
      width: 40%;
      padding: 5px 9px;
      border-radius: 4px;
      border: 2px solid #dbdfe4; 
      &:focus {
        border-color: #c2c6cc; 
      } 
      &.invalid {
        border-color: #EE6072;  
      }
    }
    button {
      display: inline-block;
      background-color: #288ce4;
      border-radius: 3px;
      padding: 9px;
      border: none;
      font-size: .8em;
      color: #fff;
      cursor: pointer;
      margin-top: 5px;
      &:disabled {
        background-color: #778289;
        opacity: .6; 
        cursor: not-allowed;
        &:hover {
          opacity: .6;   
        }
      }
      &:hover {
        opacity: .9; 
      }
    }
  }

  .currentuser__form-title {
    font-weight: bold;
    color: #687a86;
    font-size: 1.1em;
    margin-bottom: 10px;
  }

  .disqusjs {
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
  .comments-shell {
    .comments-shell__item {
      display: flex;
      padding: 0 15px;
      margin-bottom: 24px;
    }
    .comments-shell__avatar {
      border-radius: 3px;
      background-color: #F8F8F8;
      display: inline-block;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      margin-right: 10px;
    }
    .comments-shell__content {
      list-style: none;
      width: 100%;
      .comments-shell__content-item {
        animation: shellPulse 1s infinite;
        background-color: #F8F8F8;
        display: block;
        margin-bottom: 5px;
        height: 13px;
        &:first-child {
          width: 50%;
        }
        &:nth-child(2) {
          width: 40%;
        }
        &:last-child {
          width: 20%;
        }
      }
    }
  }
</style>

