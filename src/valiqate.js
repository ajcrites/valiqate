var _ = require("underscore"),

Valiqate = function () {
    this.conditionCount = 0;
    this.successCount = 0;
    this.failureCount = 0;

    this.namedConditions = {};
    this.unnamedConditions = [];

    this.failureMethod = function () {};
    this.successMethod = function () {};
};

Valiqate.prototype = {
    check: function () {
        var obj, condition, result, name,
            failureMessage = "",
            successMessage = "",
            ctx = null;

        this.conditionCount++;

        if (_.isObject(arguments[0])) {
            var obj = arguments[0];
            condition = obj.condition;
            if (obj.hasOwnProperty("name")) {
                name = obj.name;
            }
            if (obj.hasOwnProperty("failure")) {
                failureMessage = obj.failure;
            }
            if (obj.hasOwnProperty("success")) {
                successMessage = obj.success;
            }
            if (obj.hasOwnProperty("context")) {
                ctx = obj.context;
            }
        }
        else {
            condition = arguments[0];

            if (arguments.length > 1) {
                failureMessage = arguments[1];
            }
        }

        if (_.isFunction(condition)) {
            result = condition.call(ctx);
        }
        else {
            result = condition;
        }

        if (null !== result) {
            this.completeResult(result, name, successMessage, failureMessage);
        }
    },

    completeResult: function (result, name, successMessage, failureMessage) {
        var message;
        if (result) {
            this.successCount++;
            message = successMessage;
        }
        else {
            this.failureCount++;
            message = failureMessage;
        }

        if (name) {
            this.namedConditions[name] = message;
        }
        else {
            this.unnamedConditions.push(message);
        }
    },

    fail: function (cb) {
        this.failureMethod = cb;

        this.checkCompletion();
    },

    succeed: function (cb) {
        this.successMethod = cb;

        this.checkCompletion();
    },

    checkCompletion: function () {
        var cb = this.successMethod;
        if (this.conditionCount === this.successCount + this.failureCount) {
            if (this.failureCount > 0) {
                cb = this.failureMethod;
            }
        }

        cb(this.namedConditions, this.unnamedConditions);
    },
};

module.exports = function () {
    return new Valiqate;
};
