(function (window, angular) {
  'use strict';

  var Bravo = angular.module('Bravo');

  Bravo.constant('STORAGE_NAMES', {
    lastUser: 'last_user',
    token: 'token',
    server: 'server'
  });

  /**
    * @ngdoc service
    * @name Bravo.Storage
    * @requires $injector Dynamic dependency injector
    *
    * @description
    * <span class="label label-default">Storage</span> service to provide local storage of data. <br>
    * It uses <span style="color:blue">window</span>.<span style="color:red">localStorage</span> in first place.<br>
    * If <span style="color:blue">window</span>.<span style="color:red">localStorage</span> not available, $cookies from ngCookies module, <br>
    * will be dynamicly injected.
    *
   **/
  Bravo.factory('Storage',
    ['$injector', function ($injector) {


      /**
       *    PRIVATES
       * */
      var isLocalStorage, storage = {};
      //  COMPUTE VAR  localstorage or cookie
      var container = (function () {
        if (window.localStorage) {
          isLocalStorage = true;
          return window.localStorage;
        } else {
          return $injector.get('$cookies');
        }
      })();
      //  COMPUTE FUNCTION localStorage || cookie
      storage.read = function (key) {
        if (isLocalStorage) {  // localStorage
          storage.read = function (key) {
            return container.getItem(key);
          };
          return storage.read(key);
        } else {
          storage.read = function (key) {
            return container.get(key);
          };
          return storage.read(key);
        }
      };
      storage.save = function (key, value, expireDate) {
        if (isLocalStorage) {  //  localStorage
          storage.save = function (key, value) {
            return container.setItem(key, value);
          };
          return storage.save(key, value);
        } else {
          storage.save = function (key, value) {
            return container.put(key, value, expireDate);
          };
          return storage.save();
        }
      };
      storage.del = function (key) {
        if (isLocalStorage) {  //  localStorage
          storage.del = function (key) {
            return container.removeItem(key);
          };
          return storage.del(key);
        } else {
          storage.del = function (ke) {
            return container.remove(key);
          };
          return container.remove(key);
        }
      };

      var Storage = {};
      /**
       *    EXPORTS
       * */

      /**
         * @ngdoc method
         * @name Bravo.Storage#read
         * @methodOf Bravo.Storage
         * @param {string} key - object[key]
         * @returns {string} Data from local storage
         *
         * @description
         * Read data from local storage.
         */
      Storage.read = function (key) {
        return storage.read(key);
      };
      /**
         * @ngdoc method
         * @name Bravo.Storage#save
         * @methodOf Bravo.Storage
         * @param {object} data - map object
         * @param {string} data.key - key
         * @param {string} data.value - value for object[key]
         *
         * @description
         * <p>Save data to local storage</p>
         *
         * @example
         * Use object to save more data in one invoke:<br>
         * <pre>
         *    Storage.save({
         *      key1: value1,
         *      key2: value2
         *    })
         * </pre>
         * Or pass in two arguments:<br>
         * <pre>
         *    Storage.save(key1, value1)
         *    Storage.save(key2, value2)
         * </pre>
         */
      Storage.save = function (key, value, expireDate) {
        if (arguments[1]) {  //  for cookies don't use - DEPRECIATED
          expireDate = expireDate || {expires: '21 11 2016'};
          return storage.save(key, value, expireDate);
        } else if (angular.isObject(arguments[0])) {
          var data = arguments[0];
          for (key in data) {
            storage.save(key, data[key]);
          }
        } else {
          throw 'Storage writing error';
        }
      };
      /**
         * @ngdoc method
         * @name Bravo.Storage#del
         * @methodOf Bravo.Storage
         * @param {string} dupa - object[key]
         * @description
         * Delete data from local storage.
         */
      Storage.del = function (key) {
        return storage.del(key);
      };
      return Storage;

  }]);
})(window, angular);
