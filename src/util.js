module.exports.updateArray = (arr, idx, update) => {
  const res = arr.slice();
  res[idx] = typeof(update) === 'function' ? update(res[idx]) : res[idx];
  return res;
};

module.exports.sum = (arr) => arr.reduce((acc, n) => acc + n, 0);
