/// <reference path="json-patch.js" />


function firstOrDefault(array, predicate) {
    if (!IsArray(array))
        return null;

    if (typeof predicate !== "function")
        return null;


    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (predicate(value, i))
            return value;
    }
    return null;
}

function IsArray(check) {
    return Object.prototype.toString.call(check) === '[object Array]';
}

function IsObject(check) {
    return Object.prototype.toString.call(check) === '[object Object]';
}


if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };
}

function ObjectDiff(left, right) {

    var diff = {};

    for (var propertyName in right) {

        var leftValue = left[propertyName];
        var rightValue = right[propertyName];

        if (!right.hasOwnProperty(propertyName))
            continue;

        if (typeof (leftValue) == 'function') {
            continue;
        }

        if (rightValue === undefined)
            continue;

        if (propertyName == 'id') {
            continue;
        }

        if (propertyName.startsWith('$') || propertyName.startsWith('_'))
            continue;

        if (IsArray(rightValue)) {
            var items = [];

            for (var i = 0; i < rightValue.length; i++) {

                if (rightValue[i] == undefined) {

                    continue;
                }

                var itemId = rightValue[i].id;
                var result = $.grep(leftValue, function (e) { return itemId != 0 && e.id == itemId; });

                if (result.length == 0) {
                    // No Items are found
                    var item = rightValue[i];
                    item._diffState = 'new'
                    items.push(item);
                } else {
                    var elementDiff = ObjectDiff(result[0], rightValue[i]);
                    if (Object.keys(elementDiff).length > 0) {
                        elementDiff._diffState = 'modified';
                        items.push(elementDiff);
                    }
                }
            }

            for (var i = 0; i < leftValue.length; i++) {
                var itemId = leftValue[i].id;
                var result = $.grep(rightValue, function (e) { return e != undefined && e.id == itemId; });
                if (result.length == 0) {
                    var deletedItem = { id: itemId, _diffState: 'deleted' };
                    items.push(deletedItem);
                }
            }

            diff[propertyName] = items;
            continue;
        }

        if (leftValue === null && rightValue === null)
            continue;

        if (leftValue == undefined || leftValue != rightValue) {
            console.log(propertyName + ': ' + leftValue + ' -> ' + rightValue);
            diff[propertyName] = rightValue;
        }
    }

    if (left.id != undefined && Object.keys(diff).length > 0)
        diff.id = left.id;

    return diff;
}

var GenerateGUID = (typeof (window.crypto) != 'undefined' &&
                typeof (window.crypto.getRandomValues) != 'undefined') ?
    function () {
        // If we have a cryptographically secure PRNG, use that
        // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
        var buf = new Uint16Array(8);
        window.crypto.getRandomValues(buf);
        var S4 = function (num) {
            var ret = num.toString(16);
            while (ret.length < 4) {
                ret = "0" + ret;
            }
            return ret;
        };
        return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
    }

    :

    function () {
        // Otherwise, just use Math.random
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

function AssignObjectIds(obj) {

    obj.$$uuid = GenerateGUID();

    for (var propertyName in obj) {

        if (!obj.hasOwnProperty(propertyName))
            continue;

        var value = obj[propertyName];

        if (IsArray(value)) {

            for (var i = 0; i < value.length; i++) {
                if (IsObject(value[i]))
                    AssignObjectIds(value[i]);
            }

        } else if (IsObject(value)) {
            AssignObjectIds(value);
        }
    }
}

function CreateJsonPatch(left, right, propertiesToIgnore) {

    var patch = new JsonPatch();

    propertiesToIgnore = propertiesToIgnore || [];

    for (var propertyName in right) {
        
        if (!right.hasOwnProperty(propertyName))
            continue;

        if (_.contains(propertiesToIgnore, propertyName))
            continue;

        var leftValue = left[propertyName];
        var rightValue = right[propertyName];

        if (typeof (leftValue) == 'function') {
            continue;
        }

        //if (rightValue === undefined)
        //    continue;

        //if (propertyName == 'id') {
        //    continue;
        //}

        if ((propertyName.startsWith('$') && propertyName != '$$uuid') || propertyName.startsWith('_'))
            continue;
        
        if (propertyName.startsWith('$'))
            continue;
        
        if (IsArray(rightValue)) {

            for (var i = 0; i < rightValue.length; i++) {

                if (rightValue[i] == undefined) {
                    continue;
                }

                var itemId = rightValue[i].$$uuid;
                var result = _.find(leftValue, function (e) { return itemId != 0 && e.$$uuid == itemId; });

                if (!result) {
                    // No Items are found
                    var item = rightValue[i];
                    patch.add(propertyName, item);


                } else {
                    var elementDiff = CreateJsonPatch(result, rightValue[i]);
                    if (elementDiff.operations.length > 0) {
                        patch.addSubPatch(elementDiff, propertyName, i);
                    }
                }
            }

            for (var i = 0; i < leftValue.length; i++) {
                var itemId = leftValue[i].$$uuid;
                var result = _.find(rightValue, function (e) { return e != undefined && e.$$uuid == itemId; });
                if (!result) {
                    patch.remove(propertyName, i);
                }
            }

            //diff[propertyName] = items;
            continue;
        } else if (IsObject(rightValue)) {

            //for (var key in rightValue) {
            //if (rightValue.hasOwnProperty(key)) {

            if (!_.isEqual(leftValue, rightValue)) {

                patch.replace(propertyName, rightValue);

                //var elementDiff = CreateJsonPatch(leftValue, rightValue);
                //if (elementDiff.operations.length > 0) {
                //    patch.addSubPatch(elementDiff, propertyName);
                //}               
            }
            continue;
            //}
            //}            
        }

        if (leftValue === null && rightValue === null)
            continue;

        if (leftValue == undefined || leftValue != rightValue) {
            //console.log(propertyName + ': ' + leftValue + ' -> ' + rightValue);
            patch.replace(propertyName, rightValue);
        }
    }

    //if (includeId && left.id != undefined && patch.operations.length > 0)
    //    diff.id = left.id;

    return patch;
}

function JsonPatch() {

    this.operations = [];
    var self = this;

    var addOperation = function (op, path, values) {
        var p = { op: op };

        if (values['from'] !== undefined)
            p.from = values['from'];

        if (path[0] != '/')
            path = '/' + path;

        p.path = path;

        if (values.value !== undefined)
            p.value = values.value;

        self.operations.push(p);
    };

    this.replace = function (path, value) {
        addOperation('replace', path, { value: value });
        return self;
    };

    this.test = function (path, value) {

    };

    this.add = function (arrayName, value) {
        return self.insert(arrayName, '-', value);
    };

    this.insert = function (arrayName, index, value) {
        var path = arrayName + '/' + index;
        addOperation('add', path, { value: value });
        return self;
    };

    this.remove = function (arrayName, index) {

        var path = arrayName + '/' + index;

        addOperation('remove', path, {});
        return self;
    };

    this.move = function (from, path) {
        addOperation('move', path, { from: from });
        return self;
    };

    this.copy = function (from, path) {
        addOperation('copy', path, { from: from });
        return self;
    };

    this.addSubPatch = function (childPatch, basePath, index) {

        var parentPath = basePath;
        if (index !== undefined)
            parentPath += '/' + index;

        if (parentPath[0] != '/')
            parentPath = '/' + parentPath;

        for (var i = 0; i < childPatch.operations.length; i++) {

            var childOp = childPatch.operations[i];
            childOp.path = parentPath + childOp.path;
            self.operations.push(childOp);
        }
    };

    this.serialize = function () {
        return JSON.stringify(self.operations);
    };

    return this;
}

