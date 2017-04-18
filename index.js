'use strict';

/* global Jinkela, req */
(exports => {
  const api = req.create({ baseUrl: '//xiaoming.io/disqus/' });
  const $style = document.createElement('style');
  $style.type = 'text/css';
  $style.appendChild(document.createTextNode(`
    @keyFrames busy {
      0% {
        content: '评论加载中.';
      }
      25% {
        content: '评论加载中..';
      }
      50% {
        content: '评论加载中...';
      }
      75% {
        content: '评论加载中..';
      }
      100% {
        content: '评论加载中.';
      }
    }
  `));
  document.head.appendChild($style);

  function sortComments(response) {
    response.reverse();
    let idMap = response.map(record => +record.id);
    // 子回复用数组存到父回复下
    response.forEach(record => { record.children = []; });
    response.forEach(record => {
      if (record.parent) {
        let parentIndex = idMap.indexOf(+record.parent);
        response[parentIndex].children.push(record);
      }
    });
    function flatten(list) {
      return list
        .reduce((prev, current) => {
          prev.push(current);
          if (current.children.length) {
            prev.push.apply(prev, flatten(current.children));
          }
          return prev;
        }, []);
    }
    return flatten(response.filter(record => !record.parent));
  }

  class DisqusHeader extends Jinkela {
    get template() {
      return `
        <header>
          <nav>
            <ul>
              <li class="count"><span>{data}</span>条评论</li>
              <li>Giraffe's Home</li>
            </ul>
            <svg class="icon-comment" t="1491486820738" class="icon" style="" viewBox="0 0 1195 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3484" xmlns:xlink="http://www.w3.org/1999/xlink" width="116.5" height="100"><defs><style type="text/css"></style></defs><path d="M1191 424.02534C1191 500.879932 1164.333333 571.882091 1111 637.031817 1057.666667 702.181542 985.222221 753.638784 893.666667 791.403541 802.111113 829.168299 702.111113 848.050675 593.666667 848.050675 562.555554 848.050675 530.333333 846.283904 497 842.750362 409 920.046647 306.777778 973.491507 190.333333 1003.084941 168.555555 1009.268642 143.222222 1014.127266 114.333333 1017.660813 106.777778 1018.544196 100 1016.556578 94 1011.697954 88 1006.83933 84.111111 1000.434782 82.333333 992.484309 81 990.054997 82.111111 987.404838 85.666667 983.871292 89.222222 980.337749 89.666667 978.129284 87 977.245897 84.333333 976.362509 85.333333 974.264469 90 970.95177L94 964.988915 98.666667 959.357329 104 953.39447C107.111111 949.860928 114 942.241724 124.666667 930.536858 135.333333 918.831991 143 910.439821 147.666667 905.36035 152.333333 900.280883 159.222222 891.557444 168.333333 879.190037 177.444445 866.82263 184.666667 855.559458 190 845.400516 195.333333 835.241579 201.333333 822.211631 208 806.310682 214.666667 790.409732 220.444445 773.625395 225.333333 755.957675 155.555555 716.646993 100.555555 668.060753 60.333333 610.198963 20.111111 552.337173 0 490.279296 0 424.02534 0 366.605239 15.777778 311.724877 47.333333 259.38425 78.888889 207.043622 121.333333 161.880507 174.666667 123.894903 228 85.9093 291.555555 55.763749 365.333333 33.458249 439.111113 11.15275 516.444446 0 597.333333 0 705.777779 0 805.777779 18.882378 897.333333 56.647135 988.888887 94.411892 1061.333333 145.869133 1114.666667 211.01886 1168 276.168586 1194.666667 347.170748 1194.666667 424.02534L1191 424.02534Z" p-id="3485" fill="#656C7A"></path></svg>
          </nav>
        </header>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          border-bottom: 2px solid #e7e9ee;
          margin-bottom: 24px;
          > nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            > .icon-comment { width: 19px; height: 19px; }
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
                  > span { margin-right: 5px; }
                }
              }
            }
          }
        }
      `;
    }
  }

  class DisqusForm extends Jinkela { // eslint-disable-line no-unused-vars
    get value() {
      return { name: this.name, email: this.email };
    }
    get template() {
      return `
        <form>
          <p class="title">访客信息</p>
          <input ref="name" type="text" placeholder="昵称">
          <input ref="email" type="email" placeholder="邮箱" />
          <p class="notice">经过可爱的博主同意后你的留言就会出现在页面上了 (≧▽≦)</p>
        </form>
      `;
    }
    get styleSheet() {
      return `
        :scope {
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
            &:focus {
              outline: none;
            }
          }
        }
      `;
    }
  }

  class DisqusCurrentUser extends Jinkela {
    get DisqusForm() { return DisqusForm; }
    showActions() {
      this.footer.style.opacity = 1;
      this.form.element.classList.add('show');
      this.textarea.style.height = '100px';
    }
    setError(target) {
      const { name, email } = this.form.value;
      [this.textarea, name, email].forEach(el => el.classList.remove('error'));
      if (target) target.classList.add('error');
    }
    onSubmit() {
      const { name, email } = this.form.value;
      switch (true) {
        case !this.textarea.value || !this.textarea.value.trim():
          this.errorMessage = '请填写评论内容';
          this.setError(this.textarea);
          return;
        case !name.value || !name.value.trim():
          this.errorMessage = '请填写昵称';
          this.setError(name);
          return;
        case !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value):
          this.errorMessage = '邮箱格式非法';
          this.setError(email);
          return;
      }
      this.setError(null);
      this.errorMessage = null;
      const payload = {
        name: name.value,
        email: email.value,
        comment: this.textarea.value
      };
      if (this.restarget) payload.parent = this.restarget;
      api.post('comments', JSON.stringify(payload)).end()
        .then(() => {
          alert('评论发送成功，请耐心等候博主审核通过');
        }, () => { this.errorMessage = '服务器抽风了，请稍后再重试 (>﹏<)'; });
    }
    get template() {
      return `
        <section>
          <div class="container">
            <img class="avatar" src="//oiw32lugp.qnssl.com/2017-04-12-giraffe.jpg">
            <div>
              <textarea ref="textarea" on-focus="{showActions}" placeholder="我想对博主说... (///▽///)"></textarea>
              <div if="{errorMessage}" ref="error" class="errormsg">
                <svg t="1492008694441" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2395" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M152.040788 895.149377c-31.53932-0.007163-63.390749-0.919952-81.033571-33.3035-17.146519-31.472805-4.296863-60.225663 11.933797-87.453794 117.941156-197.847044 235.969293-395.639852 354.317725-593.239256 41.621956-69.489654 120.338762-69.883627 161.352875-0.301875C713.660906 376.013863 828.467675 571.328223 941.752788 767.510348c12.18553 21.096481 17.924231 48.070832 19.281135 72.722278 1.762133 32.110325-21.809725 53.420677-54.162574 54.4491L152.040788 895.149377zM569.051367 457.17637c0-37.759999 0.522909-75.530231-0.159636-113.275903-0.584308-32.528857-26.465768-57.789171-57.515948-57.668421-30.520107 0.12075-54.547337 24.502044-54.723346 57.169047-0.397043 74.010621-0.402159 148.025335 0 222.030839 0.185218 33.542954 24.841781 58.651818 56.035224 58.667168 31.740912 0.017396 55.780421-24.312732 56.276724-58.171887C569.496505 529.683754 569.085136 493.426992 569.051367 457.17637M567.282071 731.36615c0.252757-31.596625-23.641443-55.468312-55.493895-55.432497-31.888268 0.029676-55.967686 23.829731-55.881728 55.212486 0.089028 31.16786 24.63712 55.892985 55.619762 56.027038C542.378891 787.303136 567.029314 762.629177 567.282071 731.36615" p-id="2396" fill="#ffffff"></path></svg>
                <span>{errorMessage}</span>
              </div>
              <footer ref="footer">
                <button on-click="{onSubmit}">发表评论</button>
              </footer>
            </div>
          </div>
          <jkl-disqus-form ref="form"></jkl-disqus-form>
        </section>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          margin-bottom: 24px;
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
                }
              }
            }
          }
        }
      `;
    }
  }

  class DisqusComment extends Jinkela {
    get DisqusCurrentUser() { return DisqusCurrentUser; }
    init() {
      if (this.isResponse) {
        this.element.style.marginLeft = '48px';
      }
    }
    toggleRespond() {
      this.isResponsing = !this.isResponsing;
      this.respond.classList.toggle('active');
    }
    get template() {
      return `
        <li>
          <img class="avatar" src="{avatar}">
          <div>
            <header>
              <span class="author">{author}</span>
              <span class="date">{date}</span>
            </header>
            <p class="comment">{comment}</p>
            <footer>
              <ul>
                <li>
                  <a
                    ref="respond"
                    on-click="{toggleRespond}"
                    class="respond"
                    href="Javascript:;">回复</a>
                </li>
                <li>
                  <jkl-disqus-current-user
                    restarget="{resTarget}"
                    if="{isResponsing}"></jkl-disqus-current-user>
                </li>
              </ul>
            </footer>
          </div>
        </li>
      `;
    }
    get styleSheet() {
      return `
        :scope {
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
      `;
    }
  }

  class DisqusCommentList extends Jinkela {
    init() {
      this.data.forEach(comment => {
        const { createdAt } = comment;
        const date = new Date(createdAt);
        const { cache } = comment.author.avatar;
        new DisqusComment({
          author: comment.author.name,
          comment: comment.raw_message,
          avatar: /noavatar/.test(cache) ? '//oiw32lugp.qnssl.com/2017-04-12-giraffe.jpg' : cache,
          date: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
          isResponse: !!comment.parent,
          resTarget: comment.parent
        }).to(this);
      });
    }
    get tagName() { return 'ul'; }
  }

  class DisqusFooter extends Jinkela {
    get template() {
      return `
        <footer>
          <ul>
            <li>
              <svg t="1491636886122" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2374" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M128 268l0 512 768 0 0-512-768 0zM512 547.8l-325.6-247.8 651.2 0-325.6 247.8zM160 748l0-427.8 230.2 175.2-136.2 154.6 4 4 157.8-139.2 96.2 73.2 96.2-73.2 157.8 139.2 4-4-136.2-154.8 230.2-175 0 427.8-704 0z" p-id="2375" fill="#656C7A"></path></svg>
              <a href="//yemengying.com/atom.xml" target="_blank">订阅</a>
            </li>
            <li>
              <svg t="1492009091417" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2394" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M941.714 512q0 143.433-83.712 258.011t-216.283 158.574q-15.433 2.853-22.565-3.986t-7.131-17.152v-120.576q0-55.442-29.696-81.152 32.585-3.438 58.587-10.277t53.723-22.272 46.299-37.998 30.281-60.014 11.703-86.016q0-69.157-45.129-117.723 21.138-52.005-4.571-116.553-16.018-5.157-46.299 6.29t-52.553 25.161l-21.723 13.714q-53.138-14.848-109.714-14.848t-109.714 14.848q-9.143-6.29-24.283-15.433t-47.726-22.016-49.152-7.717q-25.161 64.585-3.986 116.553-45.129 48.567-45.129 117.723 0 48.567 11.703 85.723t29.989 60.014 46.007 38.29 53.723 22.272 58.587 10.277q-22.857 20.553-28.014 58.843-11.995 5.705-25.71 8.558t-32.585 2.853-37.413-12.288-31.707-35.73q-10.862-18.286-27.721-29.696t-28.27-13.714l-11.447-1.719q-11.995 0-16.567 2.56t-2.853 6.583 5.157 8.009 7.424 6.839l3.986 2.853q12.581 5.705 24.869 21.723t17.993 29.147l5.705 13.129q7.424 21.723 25.161 35.145t38.29 17.152 39.717 3.986 31.707-2.011l13.129-2.304q0 21.723 0.293 50.871t0.293 30.866q0 10.277-7.424 17.152t-22.857 3.986q-132.571-43.995-216.283-158.574t-83.712-258.011q0-119.442 58.843-220.27t159.707-159.707 220.27-58.843 220.27 58.843 159.707 159.707 58.843 220.27z" p-id="2395" fill="#656C7A"></path></svg>
              <a href="//github.com/giraffe0813" target="_blank">github</a>
            </li>
          </ul>
          <span>DISQUS.JS</span>
        </footer>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          padding: 24px 0;
          margin-top: 24px;
          border-top: 2px solid #e7e9ee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > ul {
            > li {
              display: inline-block;
              font-size: 13px;
              &:not(:last-child) {
                margin-right: 15px;
              }
              > svg { vertical-align: middle; }
              > a {
                color: #494e58;
                text-decoration: none;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }
      `;
    }
  }

  class RecentComment extends Jinkela {
    goComment() { location.href = this.url; }
    get template() {
      return `
       <li>
          <img class="avatar" src="{avatar}">
          <div>
            <header>
              <span class="author">{name}</span>
              <span class="date">{date}</span>
            </header>
            <p on-click="{goComment}" class="comment">{comment}</p>
          </div>
        </li>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          overflow: auto;
          display: flex;
          margin-bottom: 10px;
          font-size: 13px;
          > .avatar {
            width: 42px;
            height: 42px;
            margin-right: 15px;
            flex-shrink: 0;
            border-radius: 4px;
          }
          .author {
            color: #EE6172;
          }
          .comment {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-top: 5px;
            cursor: pointer;
            &:hover { color: #6BB4F3; }
          }
        }
      `;
    }
  }

  class Main extends Jinkela {
    getArticleComments(url) {
      let options = {};
      this.loading = true;
      if (url && url.trim()) options = { query: { url } };
      api.get('comments', options).end().then(response => {
        response = JSON.parse(response).response;
        new DisqusHeader({ data: response.length }).to(this);
        new DisqusCurrentUser().to(this);
        new DisqusCommentList({ data: sortComments(response) }).to(this);
        new DisqusFooter().to(this);
      }, () => { this.internalError = true; })
        .then(() => { this.loading = false; });
    }
    getRecentComments(dom = document.body) {
      api.get('comments/recent').end().then(response => {
        response = JSON.parse(response).response;
        response.forEach(comment => {
          const { cache } = comment.author.avatar;
          const date = new Date(comment.createdAt);
          new RecentComment({
            name: comment.author.name,
            avatar: /noavatar/.test(cache) ? '//oiw32lugp.qnssl.com/2017-04-12-giraffe.jpg' : cache,
            comment: comment.raw_message,
            date: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
            url: comment.url
          }).to(dom);
        });
      });
    }
    get template() {
      return `
        <div>
          <p if="{loading}" class="loading"></p>
          <p if="{internalError}" class="error">服务器开小差了，评论加载失败，请稍后再重试 (>﹏<)</p>
        </div>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          font-family: "Helvetica Neue", arial, sans-serif;
          transition: opacity, .5s, ease;
          color: #656c7a;
          font-weight: 700;
          font-size: 15px;
          ul, ol {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          > .loading::after {
            content: '';
            opacity: .5;
            font-weight: 300;
            animation: busy 1s linear infinite;
            font-size: 20px;
          }
          > .loading, .errormsg {
            text-align: center;
            padding: 15px 0;
          }
        }
      `;
    }
  }

  exports.DisqusJS = {
    getRecentComments(dom = document.body) {
      this.Disqus = this.Disqus || new Main().to(dom);
      this.Disqus.getRecentComments();
    },
    getArticleComments(dom = document.body, url) {
      this.Disqus = this.Disqus || new Main().to(dom);
      this.Disqus.getArticleComments(url);
    }
  };
})(window);
