(function (window, angular, $) {
  'use strict';

  var Bravo = angular.module('Bravo');

  Bravo.directive('bBankAccount', function () {

    /* there is no account length checker */

    var bba = {};

    bba.restrict = 'A';

    bba.scope = {

      bBankAccountIsValid: '&',

      bBankAccountNo: '&',

      bBankAccountIsFull: '&?',

      bBankAccountRead: '@?'

    };

    bba.templateUrl = 'core/html/inputs/bBankAccount.html';

    bba.link = function (scope, elem, attr, ctrl) {

      var Utils = ctrl.Utils,
          ibanCountryCodes = ctrl.ibanCountryCodes,
          read = true;

      var inputs = $('.bank-account--input-inline-block');

      scope.bank_input = {};

      scope.$watch('bBankAccountRead', function (v) {
        if (v && read) {

          sliceBankAccount_setInputs(v);
          emit_info(v);

        } else {
          read = true;
        }
      });

      scope.bank_input.countryCode = 'PL';  //  set default for options

      scope.bank_input.ibanCountryCodes = ibanCountryCodes;

      scope.bank_input.select1 = function (v) {

        emit_info();

      };

      scope.bank_input.check1 = function (v) {

        var input = inputs.eq(0),
            next = inputs.eq(1);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 2);
        if (scope.bank_input.one && scope.bank_input.one.length > 2) {
          scope.bank_input.one = scope.bank_input.one.slice(0, 2);
        }

        isForward(v_length, scope.bank_input.check1, function () {

          if (v_length === 2) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

        }, function (input_length, cache) {

        });

        emit_info();

      };

      scope.bank_input.check2 = function (v) {

        var input = inputs.eq(1),
            next = inputs.eq(2),
            prev = inputs.eq(0);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.two && scope.bank_input.two.length > 4) {
          scope.bank_input.two = scope.bank_input.two.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check2, function () {

          if (v_length === 4) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {
          if (input_length === 0) onBackspace(input, prev);
        });

        emit_info();

      };

      scope.bank_input.check3 = function (v) {

        var input = inputs.eq(2),
            next = inputs.eq(3),
            prev = inputs.eq(1);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.three && scope.bank_input.three.length > 4) {
          scope.bank_input.three = scope.bank_input.three.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check3, function () {

          if (v_length === 4) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {
          if (input_length === 0) onBackspace(input, prev);
        });

        emit_info();

      };

      scope.bank_input.check4 = function (v) {

        var input = inputs.eq(3),
            next = inputs.eq(4),
            prev = inputs.eq(2);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.four && scope.bank_input.four.length > 4) {
          scope.bank_input.four = scope.bank_input.four.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check4, function () {

          if (v_length === 4) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {
          if (input_length === 0) onBackspace(input, prev);
        });

        emit_info();

      };

      scope.bank_input.check5 = function (v) {

        var input = inputs.eq(4),
            next = inputs.eq(5),
            prev = inputs.eq(3);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.five && scope.bank_input.five.length > 4) {
          scope.bank_input.five = scope.bank_input.five.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check5, function () {

          if (v_length === 4) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {
          if (input_length === 0) onBackspace(input, prev);
        });

        emit_info();

      };

      scope.bank_input.check6 = function (v) {

        var input = inputs.eq(5),
            next = inputs.eq(6),
            prev = inputs.eq(4);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.six && scope.bank_input.six.length > 4) {
          scope.bank_input.six = scope.bank_input.six.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check6, function () {

          if (v_length === 4) {
            next.focus();
            onBackspace(next, input);
          } else {
            destroyFocus(input);
            destroyBackspace(input);
          }

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {
          if (input_length === 0) onBackspace(input, prev);
        });

        emit_info();

      };

      scope.bank_input.check7 = function (v) {

        var input = inputs.eq(6),
            prev = inputs.eq(5);

        var v_length = v && v.length || 0;

        paste_sliceBankAccount_setInputs(v, 4);
        if (scope.bank_input.seven && scope.bank_input.seven.length > 4) {
          scope.bank_input.seven = scope.bank_input.seven.slice(0, 4);
        }

        isForward(v_length, scope.bank_input.check7, function () {

          destroyFocus(input);
          destroyBackspace(input);

        }, function () {

          if (v_length === 0) {

            onBackspace(input, prev);

          }

        }, function (input_length, cache) {

          if (input_length === 0) onBackspace(input, prev);

        });

        if (scope.bBankAccountIsFull && v_length === 4) {
          if (bankAccount()) {
            scope.bBankAccountIsFull({isFull: true});
          }
        }

        emit_info();

      };

      //  helper functions
      function emit_info (v) {

        if (v) {  //  from server so no validation needed
          scope.bBankAccountNo({no: v});
          scope.bBankAccountIsValid({isValid: true});
          scope.bBankAccountIsFull({isFull: true});
          return;
        }

        var ba = bankAccount();
        if (ba) {

          scope.bBankAccountNo({no: ba});
          var ba_valid = Utils.finance().isIBAN(ba);
          scope.bBankAccountIsValid({isValid: ba_valid});
          read = false;

        }

      }
      function bankAccount () {

        if (!scope.bank_input.one) return false;
        if (!scope.bank_input.two) return false;
        if (!scope.bank_input.three) return false;
        if (!scope.bank_input.four) return false;
        if (!scope.bank_input.five) return false;
        if (!scope.bank_input.six) return false;
        if (!scope.bank_input.seven) return false;

        var sum = scope.bank_input.one + scope.bank_input.two + scope.bank_input.three + scope.bank_input.four + scope.bank_input.five + scope.bank_input.six + scope.bank_input.seven;

        if (sum.length === 26) return scope.bank_input.countryCode + sum;
        return false;

      }
      function sliceBankAccount_setInputs (v) {

        if (v && v.length < 20) {
          scope.bBankAccountIsValid({isValid: false});
          return false;
        }

        var iban = String(v).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
            code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
            code = code && code[1] || 'pl';
            iban = iban.slice(2, iban.length);

        if (code) scope.bank_input.countryCode = code.toUpperCase();

        if (iban && iban.length === 26) {
          scope.bank_input.one = iban.slice(0, 2);
          scope.bank_input.two = iban.slice(2, 6);
          scope.bank_input.three = iban.slice(6, 10);
          scope.bank_input.four = iban.slice(10, 14);
          scope.bank_input.five = iban.slice(14, 18);
          scope.bank_input.six = iban.slice(18, 22);
          scope.bank_input.seven = iban.slice(22, 26);
          scope.bBankAccountIsFull({isFull: true});
          emit_info();
        }

      }
      function paste_sliceBankAccount_setInputs (v, length) {

        if (v && v.length > length) {

          var iban = String(v).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
              code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
              if (code && code[1]) iban = iban.slice(2, iban.length);
              code = code && code[1] || 'pl';

          if (code) scope.bank_input.countryCode = code.toUpperCase();

          if (iban && iban.length === 26) {
            scope.bank_input.one = iban.slice(0, 2);
            scope.bank_input.two = iban.slice(2, 6);
            scope.bank_input.three = iban.slice(6, 10);
            scope.bank_input.four = iban.slice(10, 14);
            scope.bank_input.five = iban.slice(14, 18);
            scope.bank_input.six = iban.slice(18, 22);
            scope.bank_input.seven = iban.slice(22, 26);
            scope.bBankAccountIsFull({isFull: true});
            emit_info();
          } else if (iban && iban.length > 26) {
            scope.bank_input.one = '';
            scope.bank_input.two = '';
            scope.bank_input.three = '';
            scope.bank_input.four = '';
            scope.bank_input.five = '';
            scope.bank_input.six = '';
            scope.bank_input.seven = '';
          } else if (iban && iban.length > 4) {
            scope.bank_input.seven = scope.bank_input.seven.slice(0, 4);
          } else if (iban && iban.length > 2) {
            scope.bank_input.one = scope.bank_input.one.slice(0, 2);
          }

        }

      }

    };

    bba.controller = function (Utils, SHORT_COUNTRY_NAMES) {
      this.Utils = Utils;
      this.ibanCountryCodes = SHORT_COUNTRY_NAMES;
    };

    return bba;

  }); // end of b-bank-account component

  //  helper functions
  function isForward (input_length, function_name, _forward, _notForward, _default) {

    if (!function_name.cache) {
      function_name.cache = [];
    }
    function_name.cache.push(input_length);
    var cache = function_name.cache;

    //  forward
    if (cache.length > 1 && cache[cache.length - 1] > cache[cache.length - 2]) {
      //console.log('forward');
      //console.log(cache);
      _forward(cache);
      return;
    }
    // backward
    if (cache.length > 1 && cache[cache.length - 1] <= cache[cache.length - 2]) {
      //console.log('backward');
      //console.log(cache);
      _notForward(cache);
      return;
    }
    //default
    if (typeof _default === 'function') _default(input_length, cache);
  }
  function onBackspace (current_input, next_input) {

    current_input.bind('keydown', function (e) {
      var backspace = e.which || e.keyCode;

      if (backspace == 8) {
        e.preventDefault();

        next_input.on('focus', function (e) {
          setInputCursor(e, 'end');
          next_input.unbind('focus');
        });

        next_input.focus();
        current_input.unbind('keydown');

      }

    });

  }
  function onLeftArrow (current_input, next_input) {

    current_input.bind('keydown', function (e) {
      var leftArrow = e.which || e.keyCode;

      if (leftArrow == 37) {
        e.preventDefault();

        next_input.on('focus', function (e) {
          setInputCursor(e, 'all');
          next_input.unbind('focus');
        });

        next_input.focus();
        current_input.unbind('keydown');

      }

    });

  }
  function onRightArrow (current_input, next_input) {

    current_input.bind('keydown', function (e) {
      var rightArrow = e.which || e.keyCode;

      if (rightArrow == 39) {
        e.preventDefault();

        next_input.on('focus', function (e) {
          setInputCursor(e, 'all');
          next_input.unbind('focus');
        });

        next_input.focus();
        current_input.unbind('keydown');

      }

    });

  }
  function destroyBackspace (input) {

    input.unbind('keydown');

  }
  function destroyFocus (input) {

    input.unbind('focus');

  }
  function setInputCursor (event, state) {

    //  set cursor on end of input
    if (state === 'end') {
      event.target.selectionEnd = event.target.selectionStart = event.target.value.length;
    } else if (state === 'all') { //  select all in input
      event.target.selectionEnd = event.target.value.length;
      event.target.selectionStart = 0;
    }

  }

})(window, angular, jQuery);
