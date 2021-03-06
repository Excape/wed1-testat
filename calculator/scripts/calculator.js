"use strict";

/**
 * core
 */
var operation;

var errorMsgInvalidOperand = "invalid operand";
var errorMsgInvalidOperator = "invalid operator";
var errorMsgInvalidPrefix = "invalid prefix";

var init = function () {
    operation = {
        var1: undefined,
        var2: undefined,
        operator: undefined
    };
};

/**
 * Check if a parameter is a valid number.
 * @param aNumber input number
 * @returns {boolean} true, valid number
 */
var isNumeric = function (aNumber) {
    return !isNaN(parseFloat(aNumber)) && isFinite(aNumber);
};

/**
 * Check if a parameter is a valid operator.
 * Valid operators are "+", "-", "/", "*"
 * @param anOperator input operator
 * @returns {boolean} true, valid operator
 */
var checkOperator = function (anOperator) {
    return $.inArray(anOperator, ["+", "-", "/", "*"]) !== -1;
};

/**
 * Check if a parameter is a valid prefix.
 * Valid operators are "+", "-"
 * @param anOperator input operator
 * @returns {boolean} true, valid prefix
 */
var checkValidPrefix = function (anOperator) {
    return $.inArray(anOperator, ["+", "-"]) !== -1;
};

/**
 * Check if a parameter is empty.
 * @param anInput input
 * @returns {boolean} true, input is empty
 */
var isEmpty = function (anInput) {
    if (typeof anInput.trim === "function") {
        return !anInput.trim();
    }
    return false;
};

/**
 * Set number.
 * @param aNumber number
 */
var setNumber = function (aNumber) {
    if (isNumeric(aNumber)) {
        if (operation.var1 === undefined) {
            operation.var1 = Number(aNumber);
        } else {
            operation.var2 = Number(aNumber);
        }
    } else {
        throw errorMsgInvalidOperand;
    }
};

/**
 * @returns {undefined|Number} var1
 */
var getNumber = function () {
    return operation.var1;
};

/**
 * Set operator.
 * @param anOperator operator
 */
var setOperator = function (anOperator) {
    if (checkOperator(anOperator)) {
        operation.operator = anOperator;
    } else {
        throw errorMsgInvalidOperator;
    }
};

/**
 * @returns {undefined|*} operator
 */
var getOperator = function () {
    return operation.operator;
};

/**
 * Calculates the result based on the input values stored in the operation object.
 * @returns {*} result
 */
var calculate = function () {
    var tempResult;

    if (operation.var2 === undefined && checkValidPrefix(operation.operator)) {
        //prepare calculation with just one operand ex. -1 or +1
        operation.var2 = operation.var1;
        operation.var1 = Number(0);
    }

    if (!checkOperator(operation.operator)) {
        throw errorMsgInvalidOperator;
    }
    if (!isNumeric(operation.var1) || !isNumeric(operation.var2) || (operation.operator === '/' && operation.var2 === Number(0))) {
        throw errorMsgInvalidOperand;
    }
    switch (operation.operator) {
        case '+':
            tempResult = operation.var1 + operation.var2;
            break;
        case '-':
            tempResult = operation.var1 - operation.var2;
            break;
        case '*':
            tempResult = operation.var1 * operation.var2;
            break;
        case '/':
            tempResult = operation.var1 / operation.var2;
            break;
    }
    init(); //prepare data for next calculation
    operation.var1 = Number(tempResult);
    return tempResult;
};

init();

/**
 * UI
 */
$(function () {
    var welcomeMsg = 'Welcome';
    var resultAvailable = false;

    var clearWelcomeMsg = function () {
        $("#output:contains(" + welcomeMsg + ")").empty();
    };

    var clearErrorMsg = function () {
        if ($("#output").hasClass("error")) {
            $("#output").empty();
            $("#output").removeClass("error");
        }
    };

    var handleError = function (anErrorMsg) {
        $("#output").val(anErrorMsg);
        $("#output").addClass("error");
        $("#input").empty();
        init();
    };

    var handleCalculation = function () {
        var result = calculate();

        $("#output").empty();
        $("#input").val(result);
        resultAvailable = true;
    };

    var setupOutputString = function (anOperator, anOperand) {
        if (anOperand !== undefined && !isEmpty(anOperand)) {
            return anOperand + ' ' + anOperator;
        } else {
            return anOperator;
        }
    };

    $(".number").on("click", function () {
        clearWelcomeMsg();
        clearErrorMsg();

        var number = $(this).val();

        if (resultAvailable) {
            //previous result should be ignored in this case and the calculator will be reset
            $("#input").empty();
            resultAvailable = false;
            init();
        }

        //ignore 0 without any predecessor
        if (this.id !== "key-0" || (this.id === "key-0" && (!isEmpty($("#input").val()) || getOperator() !== undefined))) {
            $("#input").append(number);
        }
    });

    $(".operator").on("click", function () {
        clearWelcomeMsg();
        clearErrorMsg();

        if (resultAvailable) {
            //previous result should not be ignored and will be used as first operand
            //because after the result was shown a operator was selected
            resultAvailable = false;
        }

        var operator = $(this).val();
        var number = $("#input").val();

        try {
            if (getNumber() === undefined && isEmpty(number)) { //operator was selected without any numeric input
                //check valid prefix
                if (!checkValidPrefix(operator)) {
                    throw errorMsgInvalidPrefix;
                }
                $("#output").val(operator);
            } else if (getOperator() !== undefined) { //switch operator
                if (operation.var1 === undefined) {
                    //check valid prefix if first operand is not set
                    if (!checkValidPrefix(operator)) {
                        throw errorMsgInvalidPrefix;
                    }
                }
                $("#output").val(setupOutputString(operator, getNumber()));
            } else {
                $("#output").val(setupOutputString(operator, number));
                $("#input").empty();
                setNumber(number);
            }

            setOperator(operator);
        } catch (error) {
            handleError(error);
        }
    });

    $("#key-\\=").on("click", function () {
        var number = $("#input").val();

        try {
            setNumber(number);
            handleCalculation();
        } catch (error) {
            handleError(error);
        }
    });

    $("#key-c").on("click", function () {
        $("#output").val(welcomeMsg);
        $("#input").empty();

        resultAvailable = false;
        init();
    });
});