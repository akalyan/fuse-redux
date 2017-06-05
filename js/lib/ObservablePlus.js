var Observable = require('FuseJS/Observable');

Observable.prototype.refreshAllMaintainOrder = function(newValues, keyProp, compareFunc, updateFunc, mapFunc) {

  if (mapFunc === undefined) {
    mapFunc = function(a, b) { return b; }
  }

  if (compareFunc === undefined) {
    compareFunc = function(x, y) { return x === y; };
  }

  if (updateFunc === undefined) {
    updateFunc = function(a, b) {}
  }

  if (newValues instanceof Observable) {
    newValues = newValues._values;
  }

  if (!(newValues instanceof Array)) {
    throw new Error("refreshAllMaintainOrder(): argument must be an array or observable");
  }

  if (!newValues) {
    newValues = [];
  }

  var oldIndexMap = {};
  var newIndexMap = {};

  var oldValues = this._values;
  for (var i = 0; i < oldValues.length; i++) {
    var oldValue = oldValues[i];
    var key = oldValue[keyProp];
    oldIndexMap[key] = i;
  }

  for (var i = 0; i < newValues.length; i++) {
    var newValue = newValues[i];
    var key = newValue[keyProp];
    newIndexMap[key] = i
  }

  var oldIterator = 0;
  var newIterator = 0;

  while (oldIterator < this._values.length || newIterator < newValues.length) {

    // if there are no more new values, delete the old
    if (newIterator >= newValues.length) {
      this.removeAt(oldIterator);
      continue;
    }

    // if there are no more old values, add the new ones
    if (oldIterator >= oldValues.length) {
      this.add(mapFunc(newValues[newIterator]));
      oldIterator++;
      newIterator++;
      continue;
    }

    var a = oldValues[oldIterator]; // old
    var b = newValues[newIterator]; // new

    // if they are the same item, update and advance each iterator
    if (compareFunc(a, b)) {
      updateFunc(a, b);
      oldIterator++;
      newIterator++;
      continue;
    }

    // if the item in the old values does not exist in the new, then delete it
    if (newIndexMap[a[keyProp]] === undefined) {
      this.removeAt(oldIterator);
      continue;
    }

    // if the item in the new values does not exist in the old, then add it
    if (oldIndexMap[b[keyProp]] === undefined) {
      this.insertAt(oldIterator, mapFunc(b));
      oldIterator++;
      newIterator++;
      continue;
    }
  }
}

module.exports = Observable;
