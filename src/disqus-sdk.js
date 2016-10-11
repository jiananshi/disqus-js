import 'normalize.css';
import './style.css';
import 'sweetalert/dist/sweetalert.css';
import 'animate.css';

import Mustache from 'mustache';
import 'whatwg-fetch';
import 'sweetalert';
import $tplHeader from '../templates/header.mst';
import $tplComment from '../templates/comment.mst';
import $tplForm from '../templates/form.mst';

import { dateFormat, validate, sort } from './util';

const DISQUS_SELECTOR = '#disqus-thread';
const DISQUS_COMMENT_SELECTOR = '#disqus-comment';
const DISQUS_REPLY_SELECTOR = '.disqus-reply';
const COMMON_HEADERS = {
  // TODO: add access-control-allow headers on server
  //'Accept': 'application/json',
  //'Content-Type': 'application/json'
} ;

function addEvents(form) {
  let $button = form.querySelector('button');
  let $comment = form.querySelector('#disqus-comment');
  let $name = form.querySelector('#disqus-name');
  let $email = form.querySelector('#disqus-email');

  $button.onclick = function() {
    let params = {
      name: $name.value,
      email: $email.value,
      comment: $comment.value
    };

    let { isValid, errorMsg } = validate(params);

    if (this.getAttribute('data-parent')) {
      params.parent = this.getAttribute('data-parent');
    }

    if (!isValid) {
      return swal({
        title: '出错啦',
        text: errorMsg,
        confirmButtonText: '返回'
      });
    }

    Disqus.createComment(params);
  };
}

var Disqus = window.Disqus = function() {};

Disqus.init = function({ getComments, createComment, getRecentComments }, container) {
  this.apiUrl = {
    getComments,
    createComment,
    getRecentComments
  };

  this.container = container;
};

Disqus.getComments = function(url) {
  let { getComments } = Disqus.apiUrl;

  if (url) {
    getComments += `?url=${ url }`;
    this.url = url;
  }

  return fetch(getComments, {
      method: 'GET',
      headers: COMMON_HEADERS
    })
    .then(res => res.json())
    .then(sort)
    .then(this.createDom);
};

Disqus.getRecentComments = function() {
  let { getRecentComments } = Disqus.apiUrl;

  return fetch(getRecentComments, {
    headers: COMMON_HEADERS
  })
  .then(res => res.json());
}

Disqus.createComment = function(params) {
  let { createComment } = Disqus.apiUrl;

  if (this.url) {
    params.url = this.url;
  }

  return fetch(createComment, {
      method: 'POST',
      headers: COMMON_HEADERS,
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then(_ => {
      swal({
        title: '评论发送成功',
        text: '博主已经收到你的评论啦，请耐心等候审核通过 (*≧ω≦)',
        type: 'success',
        confirmButtonText: '好的'
      });
    })
    .catch(e => {
      // 留条 log
      fetch(`//xiaoming.io/disqus/log?${ JSON.stringify(e) }`);

      swal({
        title: '评论发送失败',
        text: `${ e }，请稍后重试或将错误提交给我们`,
        type: 'error',
        confirmButtonText: '好的'
      });
    });
};

Disqus.createDom = function(raw) {
  let $form = document.createElement('form');
  let $list = document.createElement('ul');
  let $header = Mustache.render($tplHeader, { total: raw.response.length });

  $form.classList.add('disqus-form');
  $form.innerHTML = $tplForm;
  $list.classList.add('disqus-list', 'animated', 'slideInUp');

  $list.innerHTML = Mustache.render($tplComment, raw);

  Disqus.container.innerHTML = $header;
  Disqus.container.appendChild($form);
  Disqus.container.appendChild($list);

  addEvents($form);

  let $comment = $form.querySelector(DISQUS_COMMENT_SELECTOR);

  [].forEach.call($list.querySelectorAll(DISQUS_REPLY_SELECTOR), $dom => {
    $dom.addEventListener('click', function(e) {
      if (!e.target.classList.contains('disqus-reply')) return;

      this.isReplying = !this.isReplying;

      if (this.isReplying) {
        let $replyForm = $form.cloneNode(true);

        $replyForm.querySelector('button')
          .setAttribute('data-parent', this.getAttribute('data-parent'));

        addEvents($replyForm);

        this.appendChild($replyForm);
      } else {
        console.info(this.querySelector('form'));
        this.removeChild(this.querySelector('form'));
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', _ => {
  let $commentsContainer = document.querySelector(DISQUS_SELECTOR);

  if (!$commentsContainer) {
    console.warn(`Counld't find dom element: ${ DISQUS_SELECTOR }`);
    return;
  }

  Disqus.init({
    getComments: '//xiaoming.io/disqus/comments',
    createComment: '//xiaoming.io/disqus/comment',
    getRecentComments: '//xiaoming.io/disqus/comments/recent'
  }, $commentsContainer);
});

