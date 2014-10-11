module.exports = function (max, padding) {
  padding = padding || 0;
  return Math.floor(Math.random() * max) + padding;
}