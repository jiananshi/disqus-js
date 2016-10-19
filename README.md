<h1 class="massive-header -with-tagline">Disqus-proxy-client</h1>

> comments sharing without boundary

## API

- <a href="#doc-init">init</a>
- <a href="#doc-getcomments">getComments</a>
- <a href="#doc-getrecentcomments">getRecentComments</a>

<h2 id="doc-init">init</h2>

initialize api url

```javascript
Disqus.init({
	getComments: '//yourdomain.com/api/comments',
	getRecentComments: '//yourdomain.com/api/comments?type=recent',
	createComment: '//yourdomain.com/api/comments'
});
```

<h2 id="doc-getcomments">getComments</h2>

```javascript
/**
 * params: comments
 * dataStructure: {
 *   author: {},
 *   createdAt: '2016-10-19T00:50:16',
 *   forum: 'yourdisqusforum',
 *   id: '897893279',
 *   media: [],
 *   message: '<p>comment something</p>',
 *   raw_message: 'comment something'
 * }
 *
 */
Disqus.getComments(
	'http://yourdomain.com/post-a',
	document.querySelector('#comments-container')).then(comments => {

	// now ur able 2 do something with `comments`
});
```

<h2 id="doc-getrecentcomments">getRecentComments</h2>

```javascript
/**
 * params: comments
 * dataStructure: {
 *   author: {},
 *   createdAt: '2016-10-19T00:50:16',
 *   forum: 'yourdisqusforum',
 *   id: '897893279',
 *   media: [],
 *   message: '<p>comment something</p>',
 *   raw_message: 'comment something'
 * }
 *
 */
Disqus.getRecentComments(
	'http://yourdomain.com',
	document.querySelector('#recent-comments-container')).then(comments => {

	// now ur able 2 do something with `comments`
});
```

### License

MIT

