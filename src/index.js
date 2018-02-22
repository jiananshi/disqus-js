import 'normalize.css';
import './global.css';
import Vue from 'vue';

class RequiredParamsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PARAMS_REQUIRED';
    this.message = message;
  }
}

class DisqusJS {
  constructor({ el, apiURL }) {
    if (!apiURL) throw new RequiredParamsError('apiURL 不能为空');
    function r() {
      return new Vue({
        el: el || document.querySelector('#disqus_thread'),
        render(h) {
          return h(require('./index.vue').default, {
            props: {
              apiURL
            }
          });
        }
      });
    }
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', r)
      : r();
  }
}

window.DisqusJS = DisqusJS;

new DisqusJS({ apiURL: '//yemengying.com/disqus' }); // eslint-disable-line
