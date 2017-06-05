var Observable = require('FuseJS/Observable');

/* Method `refreshAllMaintainOrder`
 * Experimental improvement to the Observable `refreshAll` method. `refreshAll` is implemented in a way
 * that ends up with the correct items, but does so by applying the wrong operations.
 *
 * Note - the parameters have changed slightly to take a `keyProp`. The assumtion is that this new method
 * works on list items that are objects, each one uniquely identifiable by the property specified by `keyProp`
 */
Observable.prototype.refreshAllMaintainOrder = function(newValues, keyProp, compareFunc, updateFunc, mapFunc) {

  // ensure there is a mapping function for creating new items
  if (mapFunc === undefined) {
    mapFunc = function(a, b) { return b; }
  }

  // ensure there is a comparison function
  if (compareFunc === undefined) {
    compareFunc = function(x, y) { return x === y; };
  }

  // ensure there is an update function
  if (updateFunc === undefined) {
    updateFunc = function(a, b) {}
  }

  // validate structure of newValues
  if (newValues instanceof Observable) newValues = newValues._values;
  if (!(newValues instanceof Array)) throw new Error("refreshAllMaintainOrder(): argument must be an array or observable");
  if (!newValues) newValues = [];

  // create objects for storing index of unique keys
  // this is used to determine whether we need to update or create new objects later on
  var oldIndexMap = {};
  var newIndexMap = {};

  // iterate through the current (old) values and store the index of each unique key
  var oldValues = this._values;
  for (var i = 0; i < oldValues.length; i++) {
    var oldValue = oldValues[i];
    var key = oldValue[keyProp];
    oldIndexMap[key] = i;
  }

  // iterate through the new values and store the index of each unique key
  for (var i = 0; i < newValues.length; i++) {
    var newValue = newValues[i];
    var key = newValue[keyProp];
    newIndexMap[key] = i
  }

  // we create two pointers that start at the beginning of each list
  var oldIterator = 0;
  var newIterator = 0;

  // iterate until we're at the end of each list
  while (oldIterator < this._values.length || newIterator < newValues.length) {

    // if there are no more new values, delete the rest of the old items
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

    // if the item in the old list does not exist in the new, then delete it
    if (newIndexMap[a[keyProp]] === undefined) {
      this.removeAt(oldIterator);
      continue;
    }

    // if the item in the new list does not exist in the old, then add it, increment both iterators
    if (oldIndexMap[b[keyProp]] === undefined) {
      this.insertAt(oldIterator, mapFunc(b));
      oldIterator++;
      newIterator++;
      continue;
    }
  }
}

module.exports = Observable;
