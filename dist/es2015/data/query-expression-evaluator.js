String.prototype.in = function (array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == this) return true;
  }
  return false;
};

export let QueryExpressionEvaluator = class QueryExpressionEvaluator {
  evaluate(data, searchExpression) {
    var res = [];
    if (searchExpression != "") {
      for (let record of data) {
        if (eval(searchExpression)) {
          res.push(record);
        }
      }
    } else res = data;
    return res;
  }

};