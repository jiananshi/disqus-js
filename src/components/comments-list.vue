<template>
  <ul class="comments-container">
    <li
      class="comment"
      :class="{ 'comment__reponse': comment.parent }"
      v-for="comment in comments">
      <img :src="comment.author.avatar.cache" alt="avatar" class="avatar">
      <div>
        <header>
          <span class="comment__author">{{ comment.author.name }}</span>
          <span class="comment__date">{{ timeago(comment.createdAt) }}</span>
        </header>
        <p class="comment__content">{{ comment.raw_message }}</p>
        <p class="comment__reply">回复</p>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      comments: {
        type: Array,
        default: function() { return [] }
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
      }
    }
  };
</script>

<style>
.comments-container {
  .comment {
    display: flex;
    align-items: top;
    padding: 0 15px;
    margin-bottom: 24px;
    &.comment__reponse {
      margin-left: 48px;
    }
    > .avatar {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      margin-right: 10px;
      border-radius: 3px;
    }
    .comment__author {
      color: #579DF8;
      margin-right: 14px;
      font-weight: 500;
    }
    .comment__date {
      color: #999;
      font-size: .8em;
    }
    .comment__content {
      margin-top: 7px;
      color: #333;
    }
    .comment__reply {
      color: #409eff;
      cursor: pointer;
      margin-top: 7px;
      &:hover {
        opacity: .8;
      }
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
</style>

