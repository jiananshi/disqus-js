'use strict';

const api = req.create({ baseUrl: '//xiaoming.io/disqus/' });

function sortComments(response) {
  response.reverse();

  let idMap = response.map(record => +record.id);

  // 子回复用数组存到父回复下
  response.forEach(record => record.children = []);
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

class DisqusActionsGroup extends Jinkela {
  get template() {
    return `
      <nav>
        <ul>
          <li>
            <svg class="icon-recommend" t="1491487174588" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4342" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M510.425643 860.642468 184.060551 535.283286c-4.145413-3.862981-109.671819-103.912651-109.671819-221.193775 0-141.872195 83.97046-226.568179 224.629014-226.568179 92.647073 0 180.303482 86.383416 211.407897 120.627335 31.104415-34.243919 118.761847-120.627335 211.407897-120.627335 140.65753 0 224.64334 84.695984 224.64334 226.568179 0 117.2801-105.541755 217.32977-110.042255 221.533512L510.425643 860.642468zM299.017746 117.840872c-72.571852 0-194.309474 25.493627-194.309474 196.248639 0 104.001679 99.412151 198.453864 100.419084 199.401446l305.298288 304.33638 304.957527-304.010969c1.347694-1.272993 100.775194-95.725178 100.775194-199.726857 0-170.756035-121.751948-196.248639-194.324824-196.248639-98.804307 0-198.630896 121.737622-199.63783 122.966613l-11.753695 14.507412-11.786441-14.507412C497.648642 239.578494 397.615345 117.840872 299.017746 117.840872z" p-id="4343" fill="#F05F70"></path></svg>
            <span>推荐</span>
          </li>
          <li>
            <svg t="1491487378974" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2394" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M809.654272 829.29664c0 10.187776-8.261632 18.450432-18.432 18.450432L144.950272 847.747072c-10.187776 0-18.432-8.261632-18.432-18.450432L126.518272 294.786048c0-10.187776 8.244224-18.432 18.432-18.432l166.211584 0 0-36.864L127.670272 239.490048c-20.358144 0-36.864 16.488448-36.864 36.864l0 571.392c0 20.358144 16.505856 36.845568 36.864 36.845568L808.502272 884.591616c20.358144 0 36.864-16.488448 36.864-36.845568l0-221.184-35.712 0L809.654272 829.29664zM932.864 250.451968l0.180224-0.342016-8.045568-4.391936-22.93248-13.78816-0.59392 0.954368-178.59584-97.487872-17.640448 33.030144 150.173696 81.036288c-229.896192 27.305984-407.501824 189.737984-407.501824 427.91424 0 11.052032 0.900096 21.869568 1.655808 32.7424l42.210304-0.018432c-0.864256-11.052032-1.691648-22.104064-1.691648-33.389568 0-218.73664 164.484096-363.780096 376.380416-387.03616l-89.730048 145.584128 31.806464 19.781632 105.929728-173.717504 0.971776 0.52224 13.121536-23.652352 4.608-7.560192L932.864 250.451968z" p-id="2395" fill="#656C7A"></path></svg>
            <span>分享</span>
          </li>
        </ul>
      </nav>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        > ul {
          padding: 12px 0;
          > li {
            display: inline-block;
            width: 105px;
            > svg { vertical-align: middle; }
          }
        }
      }
    `;
  }
}

class DisqusForm extends Jinkela {
  get template() {
    return `
      <form>
        <p class="title">访客信息</p>
        <input type="text" placeholder="姓名">
        <input type="email" placeholder="邮箱" />
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
          &:focus {
            outline: none;
          }
        }
      }
    `;
  }
}

class DisqusCurrentUser extends Jinkela {
  showActions() {
    this.footer.style.opacity = 1;
    this.form.element.classList.add('show');
    this.textarea.style.height = '100px';
  }
  get template() {
    return `
      <section>
        <div>
          <img class="avatar" src="//oiw32lugp.qnssl.com/2017-04-12-giraffe.jpg">
          <div>
            <textarea ref="textarea" on-focus="{showActions}" placeholder="我想对博主说... (///▽///)"></textarea>
            <footer ref="footer">
              <button>发表评论</button>
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
        > div {
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
              &:focus { outline: none; }
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
  init() {
    if (this.isResponse) this.element.style.marginLeft = '48px';
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
                <jkl-disqus-current-user if="{isResponsing}"></jkl-disqus-current-user>
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
                margin: 10px 0;
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
        isResponse: !!comment.parent
      }).to(this);
    });
  }
  get tagName() { return 'ul'; }
}

class DisqusRecommend extends Jinkela {}

class DisqusFooter extends Jinkela {
  get template() {
    return `
      <footer>
        <ul>
          <li>
            <svg t="1491636886122" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2374" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M128 268l0 512 768 0 0-512-768 0zM512 547.8l-325.6-247.8 651.2 0-325.6 247.8zM160 748l0-427.8 230.2 175.2-136.2 154.6 4 4 157.8-139.2 96.2 73.2 96.2-73.2 157.8 139.2 4-4-136.2-154.8 230.2-175 0 427.8-704 0z" p-id="2375" fill="#656C7A"></path></svg>
            <a href="Javascript:;">订阅</a>
          </li>
          <li>
            <svg t="1491636953459" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2646" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19"><defs><style type="text/css"></style></defs><path d="M530.688 1009.28a489.024 489.024 0 0 1-318.976-118.016L0 920.192l81.792-201.92A498.752 498.752 0 0 1 37.312 512c0-274.56 220.8-497.28 493.44-497.28C803.072 14.72 1024 237.44 1024 512c0 274.688-220.8 497.28-493.312 497.28z m269.44-498.688v-1.408c0-143.488-101.248-245.76-275.712-245.76H336v497.28h185.6c175.808 0 278.4-106.624 278.4-250.112zM526.4 638.464h-55.04v-252.8h55.04c80.96 0 134.72 46.08 134.72 125.696v1.28c0 80.384-53.76 125.824-134.656 125.824z" fill="" p-id="2647"></path></svg>
            <a href="Javascript:;">在您的网站上使用 DISQUS.JS</a>
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
              line-height: 1.1;
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

class Main extends Jinkela {
  init() {
    api.get('comments', {
      query: {
        url: 'http://yemengying.com/message/'
      }
    }).end().then(response => {
      response = JSON.parse(response).response;
      new DisqusHeader({ data: response.length }).to(this);
      new DisqusCurrentUser().to(this);
      new DisqusCommentList({ data: sortComments(response) }).to(this);
      new DisqusFooter().to(this);
    });
  }
  get template() {
    return `
      <div>
        <p id="loading">评论加载中，请稍后...</p>
        <p>服务器开小差了，评论加载失败，请稍后再重试 (>﹏<)</p>
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
      }
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Main().to(document.body);
});

