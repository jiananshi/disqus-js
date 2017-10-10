<template>
  <div>
    <div>
      <div class="icon icon-loading"></div>
      <p>评论加载中，请稍后...</p>
    </div>
    <div class="disqusjs">
      <header>
        <nav>
          <ul>
            <li class="count"><span>{{ comments.length }}</span>&nbsp;条评论</li>
            <li>{{ blogName }}</li>
          </ul>
        </nav>
      </header>
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
      blogName: String,
      apiURL: String
    },
    mounted() {
      fetch(`${this.apiURL}/comments?url=https://yemengying.com/2017/09/04/oracle-foreignkey-lock/`)
        .then(res => res.json())
        .then(comments => { this.comments = comments.response; })
    },
    data() {
      return {
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
    }
  };
</script>

<style scoped>
  p,
  ul, ol {
    margin: 0;
    padding: 0;
  }
  .icon {
    &::after {
      content: '';
      display: inline-block;
      width: 30px;
      height: 30px;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
    &.icon-loading {
      &::after {
        width: 50px;
        height: 50px;
        background-size: 50px 50px;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij4gICAgPHBhdGggbmctYXR0ci1kPSJ7e2NvbmZpZy5wYXRoQ21kfX0iIG5nLWF0dHItZmlsbD0ie3tjb25maWcuY29sb3J9fSIgc3Ryb2tlPSJub25lIiBkPSJNMTAgNTBBNDAgNDAgMCAwIDAgOTAgNTBBNDAgNDIgMCAwIDEgMTAgNTAiIGZpbGw9IiMyRDlFRkMiIHRyYW5zZm9ybT0icm90YXRlKDE5MiA1MCA1MSkiPiAgICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+ICAgIDwvcGF0aD4gIDwvc3ZnPg==);
      }
    }
  }
  .disqusjs {
    font-family: "Helvetica Neue", arial, sans-serif;
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
    .comments-container {
      .comment {
        display: flex;
        align-items: top;
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

