export function dateFormat(raw) {
  let date = new Date(raw);
  return `${ date.getFullYear() }.${ date.getMonth() + 1 }.${ date.getDate() }`;
}

export function validate({ name, email, comment }) {
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

export function sort({ response }) {
  let idMap = response.map(record => +record.id);

  // 子回复用数组存到父回复下
  response.forEach(record => {
    record.children = [];

    if (record.parent) {
      let parentIndex = idMap.indexOf(+record.parent);
      response[parentIndex].children.push(record); 
    }
  });

  function flatten(list) {
    return list
      .reduce((prev, current) => {
        prev.push(current);

        if (current.children.length) {
          prev.push.apply(prev, flatten(current.children));
        }

        return prev;
      }, []);
  }

  return {
    response: flatten(response.filter(record => !record.parent)),
    dateFormatted: function() {
      return dateFormat(this.createdAt);
    }
  };
}


