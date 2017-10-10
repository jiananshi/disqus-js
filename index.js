'use strict';

import Vue from 'vue';

class RequiredParamsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PARAMS_REQUIRED';
    this.message = message;
  }
}

class DisqusJS {
  constructor({ el, blogName, apiURL }) {
    if (!blogName) throw new RequiredParamsError('blogName 不能为空');
    if (!apiURL) throw new RequiredParamsError('apiURL 不能为空');

    document.addEventListener('DOMContentLoaded', () => {
      new Vue({
        el: el || document.querySelector('#disqus_thread'),
        render(h) {
          return h(require('./index.vue').default, {
            props: {
              apiURL,
              blogName
            }
          });
        }
      });
    });
  }
}

window.DisqusJS = DisqusJS;

new DisqusJS({ blogName: 'giraffe0813', apiURL: '//shijianan.com/disqus' });
