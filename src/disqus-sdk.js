import 'normalize.css';
import './style.css';

import Mustache from 'mustache';
import 'whatwg-fetch';
import $tplComment from '../templates/comment.mst';
import $tplForm from '../templates/form.mst';

const DISQUS_SELECTOR = '#disqus-thread';
const API_URL = 'http://xiaoming.io/disqus/comments';

function dateFormat(raw) {
  let date = new Date(raw);
  return `${ date.getFullYear() }.${ date.getMonth() + 1 }.${ date.getDate() }`;
}

function Disqus() {}

Disqus.init = function(apiUrl, container) {
  this.apiUrl = apiUrl;
  this.container = container;
}

Disqus.comments = {
  get: function(url) {
    let remoteUrl = Disqus.apiUrl;

    if (url) remoteUrl = `${ remoteUrl }?url=${ url }`;

    return fetch(remoteUrl)
      .then(res => res.json())
      .then(this.createDom);
  },

  createDom(raw) {
    let $form = document.createElement('form');
    let $list = document.createElement('ul');

    $form.classList.add('disqus-form');
    $form.innerHTML = $tplForm;
    $list.classList.add('disqus-list');

    $list.innerHTML = Mustache.render($tplComment, raw);

    Disqus.container.appendChild($list);
    Disqus.container.appendChild($form);
  }
}

document.addEventListener('DOMContentLoaded', _ => {
  let $commentsContainer = document.querySelector(DISQUS_SELECTOR);

  if (!$commentsContainer) {
    console.warn(`Counld't find dom element: ${ DISQUS_SELECTOR }`);
    return;
  }

  Disqus.init(API_URL, $commentsContainer);
  Disqus.comments.get('http://yemengying.com/2016/07/25/spring-xml/');
});

function loadStyle() {
  var $style = document.createElement('style');
  $style.innerHTML = style; 
}

