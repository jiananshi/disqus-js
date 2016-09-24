import 'normalize.css';
import './style.css';
import 'sweetalert/dist/sweetalert.css';

import Mustache from 'mustache';
import 'whatwg-fetch';
import 'sweetalert';
import $tplComment from '../templates/comment.mst';
import $tplForm from '../templates/form.mst';

const DISQUS_SELECTOR = '#disqus-thread';
const COMMON_HEADERS = {
  // TODO: add access control allow header
  //'Accept': 'application/json',
  //'Content-Type': 'application/json'
} ;

function dateFormat(raw) {
  let date = new Date(raw);
  return `${ date.getFullYear() }.${ date.getMonth() + 1 }.${ date.getDate() }`;
}

function validate({ name, email, comment }) {
  let isNameValid = name
    && name.trim();

  let isEmailValid = email
    && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);

  let isCommentValid = comment
    && comment.trim();

  let isValid = isNameValid && isEmailValid && isCommentValid;

  switch(false) {
    case !!isNameValid:
      return { isValid, errorMsg: '昵称不能为空' };

    case !!isEmailValid:
      return { isValid, errorMsg: '邮箱格式不合法' };

    case !!isCommentValid:
      return { isValid, errorMsg: '评论不能为空' };

    default:
      return { isValid };
  }
}

function addEvents(form) {
  let $button = form.querySelector('button');
  let $comment = form.querySelector('#disqus-comment');
  let $name = form.querySelector('#disqus-name');
  let $email = form.querySelector('#disqus-email');

  $button.onclick = _ => {
    let params = {
      name: $name.value,
      email: $email.value,
      comment: $comment.value
    };

    let { isValid, errorMsg } = validate(params);

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

function Disqus() {}

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

  if (url) getComments += `?url=${ url }`;

  return fetch(getComments, {
      method: 'GET',
      headers: COMMON_HEADERS
    })
    .then(res => res.json())
    .then(this.createDom);
};

Disqus.createComment = function({ name, email, comment }) {
  let { createComment } = Disqus.apiUrl;

  return fetch(createComment, {
      method: 'POST',
      headers: COMMON_HEADERS
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
      // TODO: 打个 log
      swal({
        title: '评论发送失败',
        text: `${ e }，请稍后重新发送评论或联系管理员: klamtine@gmail.com`,
        type: 'error',
        confirmButtonText: '好的'
      });
    });
};

Disqus.createDom = function(raw) {
  let $form = document.createElement('form');
  let $list = document.createElement('ul');

  $form.classList.add('disqus-form');
  $form.innerHTML = $tplForm;
  $list.classList.add('disqus-list');

  $list.innerHTML = Mustache.render($tplComment, raw);

  Disqus.container.appendChild($list);
  Disqus.container.appendChild($form);

  addEvents($form);
};

document.addEventListener('DOMContentLoaded', _ => {
  let $commentsContainer = document.querySelector(DISQUS_SELECTOR);

  if (!$commentsContainer) {
    console.warn(`Counld't find dom element: ${ DISQUS_SELECTOR }`);
    return;
  }

  Disqus.init({
    getComments: '//xiaoming.io/disqus/comments',
    createComment: '//xiaoming.io/disqus/comments',
    getRecentComments: '//xiaoming.io/disqus/comments/recent'
  }, $commentsContainer);

  Disqus.getComments('http://yemengying.com/2016/07/25/spring-xml/');
});

