function flatten(list) {
  return list.reduce((base, item) => {
    base.push(item);
    if (item.children.length) Array.prototype.push.apply(base, item.children);
    return base;
  }, []);
}

export default response => {
  response.reverse();
  const idList = response.map(({ id }) => +id);
  response.forEach(comment => void (comment.children = []));
  response.forEach(comment => {
    if (!comment.parent) return;
    const pIndex = idList.indexOf(+comment.parent);
    response[pIndex].children.push(comment);
  });
  return flatten(response.filter(comment => !comment.parent));
};

