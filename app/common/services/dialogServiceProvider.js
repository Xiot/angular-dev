angular.module('dev').provider('dialogService', function () {

    var dialogs = {};

    this.add = function (name, options) {
        dialogs[name] = options;
        return this;
    }

    this.$get = function ($modal) {

        return {
            show: show
        }

        function show(name, data) {

            var opts = dialogs[name];
            if (!opts)
                throw new Error('The dialog \'' + name + '\' was not defined.');

            var normalizedData = normalizeData(data);
            var resolve = angular.extend({}, opts.resolve, normalizedData);

            opts = angular.extend({}, opts, { resolve: resolve });

            var instance = $modal.open(opts);
            return instance;

        }

        function normalizeData(data) {

            var resolve = {};
            if (!data)
                return resolve;

            if (angular.isObject(data)) {

                angular.forEach(data, function (value, key) {

                    if (angular.isFunction(value)) {
                        resolve[key] = value;

                    } else if (angular.isArray(value)) {
                        // Supports minified ready array syntax
                        resolve[key] = value;

                    } else {
                        resolve[key] = function () { return value; };
                    }
                });
            } else {
                resolve.data = function () { return data; };
            }

            return resolve;
        }
    }
});