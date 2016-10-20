导航
===

- [初始化](#init)
- [获取评论](#get-comments)
- [获取最近评论](#get-recent-comments)
- [创建评论](#create-comment)

## init

initialze api url

```javascript
Disqus.init({
  getComments: '//yourdomain.com/api/comments',
  getRecentComments: '//yourdomain.com/api/comments?type=recent',
  createComment: '//yourdomain.com/api/comments'
});
```

## get comments

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

## get recent comments

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

## create comment

```javascript
/**
 * params: { name, comment, email, parent(可选) }
 * 
 */
Disqus.createComment({
  name,
  comment,
  email,
  parent
}).then(comment => {});
```