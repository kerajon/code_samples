function beautifulPromises (array) {

    var getFunction = function (index) {
        return array[index];
    };

    var currentIndex = -1;

    //  iterator
    var next = function () {
        if (++currentIndex < array.length) {
            getFunction(currentIndex).apply(null, [callback].concat(arguments[0] || []));
        }
    };

    //  callback for function
    var callback = function () {
        next(Array.prototype.slice.call(arguments, 1));
    };

    next();

}
//  made for protractor promises