import './style.css';

import Mustache from 'mustache';
import 'whatwg-fetch';
import $tplComment from '../templates/comment.mst';

const DISQUS_SELECTOR = '#disqus-thread';

function dateFormat(raw) {
  let date = new Date(raw);
  return `${ date.getFullYear() }.${ date.getMonth() + 1 }.${ date.getDate() }`;
}

document.addEventListener('DOMContentLoaded', _ => {
  let $commentsContainer = document.querySelector(DISQUS_SELECTOR);

  if (!$commentsContainer) {
    console.warn(`Counld't find dom element: ${ DISQUS_SELECTOR }`);
    return;
  }
});

function loadStyle() {
  var $style = document.createElement('style');
  $style.innerHTML = style; 
}

function loadComments() {
  fetch('http://xiaoming.io/disqus/comments')
    .then(res => res.json())
    .then(raw => console.info(raw));
}

