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
      <transition name="slide-in-down">
        <form v-if="commentHasFocused" class="currentuser__form">
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
      </transition>
    </div>
    <transition name="fade-out">
      <app-shell v-if="isLoading" />
    </transition>
    <transition name="fade-in">
      <comments-list
        v-if="!isLoading"
        :comments="comments" />
    </transition>
  </div>
</template>

<script>
  import AppShell from './components/app-shell';
  import CommentsList from './components/comments-list';
  import sortComments from './sort-comments';

  const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  export default {
    props: {
      apiURL: String
    },
    mounted() {
      this.isLoading = true;
      fetch(`${this.apiURL}/comments?url=https://yemengying.com/2017/09/04/oracle-foreignkey-lock/`)
        .then(res => res.json())
        .then(comments => {
          console.log(sortComments(comments.response))
          this.comments = sortComments(comments.response);
          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          return Promise.reject(e);
        })
    },
    data() {
      return {
        isLoading: true,
        comments: [],
        isFormValid: false,
        commentHasFocused: false,
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
      onCommentTextareaFocus() {
        const { textarea } = this.$refs;
        if (textarea.classList.contains('invalid')) textarea.classList.remove('invalid');
        this.commentHasFocused = true;
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
      AppShell,
      CommentsList,
    }
  };
</script>

<style>
  @keyframes slide-in-down {
    from {
      transform: translate3d(0, -100%, 0);
      opacity: 0;
    }
    to {
      transform: translateZ(0);
      opacity: 1;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      position: absolute;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .slide-in-down-enter-active {
    animation: slide-in-down 1s ease;
    transition: all .5s ease;
  }

  .fade-in-enter-active {
    animation: fade-in 1s ease;
    transition: opacity .5s ease;
  }

  .fade-out-leave-active {
    animation: fade-out 1s ease;
    transition: opacity .5s ease;
  }

  .header {
    border-bottom: 2px solid #e7e9ee;
    margin-bottom: 20px;
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
      transition: all 10s ease-in-out;
      &:focus {
        border-color: #ABCEFB;
        min-height: 73px;
      }
      &.invalid {
        border-color: #E67470;
      }
    }
  }

  .currentuser__form {
    margin-top: 20px;
    margin-left: 58px;
    padding-bottom: 4px;
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
        border-color: #E67470;
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
      outline: none;
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
</style>

