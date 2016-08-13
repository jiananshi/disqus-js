var disqusCSS = '\
    #disqus_thread {\
      margin: 0;\
      padding: 0;\
      width: 100%;\
      background-color: #fff;\
      list-style: none;\
    }\
    .disqus_lists {\
      list-style: none;\
      margin: 0;\
      padding: 0;\
    }\
    .disqus_comment {\
      overflow: auto;\
      padding: 10px;\
    }\
    .disqus_comment .username {\
      font-weight: 700;\
      margin-right: 10px;\
      color: rgb(56, 183, 234);\
    }\
    .disqus_comment .avatar {\
      width: 48px;\
      height: 48px;\
      float: left;\
      margin-right: 15px;\
      vertical-align: middle;\
    }\
    .disqus_comment .date {\
      color: #7f919e;\
      font-weight: 500;\
    }\
    .disqus_form {\
      margin-top: 30px;\
      padding: 10px;\
    }\
    .disqus_form label {\
      font-weight: 300;\
      margin-right: 10px;\
    }\
    .disqus_form .form-group {\
      margin-bottom: 15px;\
    }\
    .disqus_form input {\
      padding: 10px 15px;\
      border-radius: 4px;\
      border: 1px solid #d4d4d4;\
      width: 284px;\
    }\
    .disqus_form button {\
      border: none;\
      padding: 10px 15px;\
      margin-top: 15px;\
      border: none;\
      background-color: #2e9fff;\
      color: #fff;\
      border-radius: 4px;\
      font-size: 1em;\
    }';

function dateFormat(raw) {
  var date = new Date(raw);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  return year + '.' + month + '.' + day;
}

document.addEventListener('DOMContentLoaded', function() {
  var $commentsContainer = document.querySelector('#disqus_thread');
  
  var xhr = new XMLHttpRequest();
  var $style = document.createElement('style');

  $style.type = 'text/css';
  $style.appendChild(document.createTextNode(disqusCSS));

  document.head.appendChild($style);

  xhr.open('get', 'http://xiaoming.io/disqus/comments');
  xhr.send();

  xhr.onreadystatechange = function() {
    if (+xhr.readyState === 4) {
      var raw = JSON.parse(xhr.responseText);
      var $container = document.createElement('ul');

      
      $container.classList.add('disqus_lists');

      raw.response.forEach(function(comment) {
        $container.appendChild(createComment(comment));
      });

      $commentsContainer.appendChild($container);
      $commentsContainer.appendChild(createForm());
    }
  }

  function postComment() {
    xhr.open('post', 'http://xiaoming.io/disqus/comment');  
    xhr.send(JSON.stringify({
      email: document.querySelector('#input-email').value,       
      comment: document.querySelector('#input-comment').value,
      name: document.querySelector('#input-name').value
    }));

    xhr.onreadystatechange = function() {
      if (+xhr.readyState === 4) {
        var raw = JSON.parse(xhr.responseText);
        console.info(raw);   
      }
    }
  }

  function createComment(comment) {
    var $itemContainer = document.createElement('li');
    var $avatar = document.createElement('img');
    var $username = document.createElement('span');
    var $date = document.createElement('span');
    var $comment = document.createElement('p');
    
    $itemContainer.classList.add('disqus_comment');
    $avatar.classList.add('avatar');
    $username.classList.add('username');
    $date.classList.add('date');
    $comment.classList.add('comment');

    $avatar.src = comment.author.avatar.cache;
    $username.innerHTML = comment.author.username;
    $date.innerHTML = dateFormat(comment.createdAt);
    $comment.innerHTML = comment.raw_message;

    $itemContainer.appendChild($avatar);
    $itemContainer.appendChild($username);
    $itemContainer.appendChild($date);
    $itemContainer.appendChild($comment);

    return $itemContainer;
  }

  function createForm() {
    var $form = document.createElement('form');
    var $postContainer = document.createElement('div');
    var $emailContainer = document.createElement('div');
    var $nameContainer = document.createElement('div');
    var $postLabel = document.createElement('label');
    var $emailLabel = document.createElement('label');
    var $nameLabel = document.createElement('label');
    var $inputPost = document.createElement('input');
    var $inputEmail = document.createElement('input');
    var $inputName = document.createElement('input');
    var $inputBtn = document.createElement('button'); 

    $form.classList.add('disqus_form');

    $postContainer.classList.add('form-group');
    $emailContainer.classList.add('form-group');
    $nameContainer.classList.add('form-group');

    $postLabel.appendChild(document.createTextNode('评论'))
    $emailLabel.appendChild(document.createTextNode('邮箱'))
    $nameLabel.appendChild(document.createTextNode('姓名'))

    $inputPost.classList.add('disqus_input');
    $inputPost.name = 'comment';
    $inputPost.type = 'text';
    $inputPost.placeholder = '请输入评论';
    $inputPost.id = 'input-comment';

    $inputEmail.classList.add('disqus_input');
    $inputEmail.name = 'email';
    $inputEmail.type = 'email';
    $inputEmail.placeholder = '请输入邮箱';
    $inputEmail.id = 'input-email';

    $inputName.classList.add('disqus_input');
    $inputName.name = 'name';
    $inputName.type = 'text';
    $inputName.placeholder = '请输入姓名';
    $inputName.id = 'input-name';

    $inputBtn.classList.add('disqus_btn');
    $inputBtn.type = 'button';
    $inputBtn.appendChild(document.createTextNode('发表'));
    $inputBtn.addEventListener('click', postComment);

    $postContainer.appendChild($postLabel);
    $postContainer.appendChild($inputPost);
    $emailContainer.appendChild($emailLabel);
    $emailContainer.appendChild($inputEmail);
    $nameContainer.appendChild($nameLabel);
    $nameContainer.appendChild($inputName);

    $form.appendChild($postContainer);
    $form.appendChild($emailContainer);
    $form.appendChild($nameContainer);
    $form.appendChild($inputBtn);

    return $form;
  }
});
