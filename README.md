<h1 class="massive-header -with-tagline">Disqus-proxy/Client</h1>

> sharing thoughts through gfw

## Explain

由于众所周知的原因，Disqus 服务在国内无法直接访问，所幸 Disqus 的 API 是 [开放的](https://disqus.com/api/docs/)，于是写了这样一个小工具。

disqus-proxy/client 在你部署好服务端后通过反向代理的方式调用 disqus 的接口，用户访问你的网站无需翻墙也可以正常使用 Disqus 服务。

## Usage

<!-- 目前很多功能依然在开发中，目前已有的功能都在 [方法](docs/methods.md) 里面 -->

```html
<script src="disqus-proxy-client.min.js"></script>
```

如果希望对未翻墙用户使用原本的 disqus，代码可以参考下面：

```html
<script>
  var disqus_shortname = 'your_disqus_forumname';
  var timer;

  (function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;

    dsq.onload = function() {
      clearTimeout(timer);
    }

    // 脚本放在页面底部要确保已加载 disqus-proxy-client
    document.addEventListener('DOMContentLoaded', function() {
      Disqus.getRecentComments();
    });

    // 3000ms 后脚本仍未加载出来，调用 disqus-proxy-client 的方法
    // Note: 如果你有更好的方法，欢迎一起探讨 @WXiaoming
    timer = setTimeout(function() {
      Disqus.getComments();
    }, 3000);

    dsq.src = '//' + disqus_shortname + '.disqus.com/count.js';

  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
</script>
```

## Contribute

1. Fork this repository to your own GitHub account and then clone it to your local device

2. Install the dependencies: npm run install

3. Build the code and watch for changes: npm run watch

After that, all files would be built under dist folder

## Supports

[Gitter Chat](https://gitter.im/disqus-proxy-client/Lobby#)

## License

MIT &copy; **@WXiaoming**

built upon &hearts;

