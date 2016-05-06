/**
 * core
 */
var result = undefined;
var operation = {};

var init = function () {
    operation = {
        var1: undefined,
        var2: undefined,
        operator: undefined
    }
}

/**
 * Set number.
 * @param aNumber number
 */
var setNumber = function (aNumber) {
    if (checkInt(aNumber)) {
        if (operation.var1 === undefined) {
            operation.var1 = new Number(aNumber);
        } else {
            operation.var2 = new Number(aNumber);
        }
    } else {
        throw "invalid number";
    }
}

/**
 * @returns {undefined|Number} var1
 */
var getNumber = function () {
    return operation.var1;
}

/**
 * Set operator
 * @param anOperator operator
 */
var setOperator = function (anOperator) {
    if (checkOperator(anOperator)) {
        operation.operator = anOperator;
    } else {
        throw "invalid operator";
    }
}

/**
 * @returns {undefined|*} operator
 */
var getOperator = function () {
    return operation.operator;
}

/**
 * Calculates the result based on the input values.
 * @returns {number} result
 */
var calculate = function () {
    result = eval(operation.var1 + operation.operator + operation.var2);
    init();
    operation.var1 = result;

    return result;
}

/**
 * Check if a parameter is a valid integer.
 * @param aNumber input number
 * @returns {boolean} true, valid integer
 */
var checkInt = function (aNumber) {
    return !isNaN(aNumber) && parseInt(Number(aNumber)) == aNumber && !isNaN(parseInt(aNumber, 10));
}

/**
 * Check if a parameter is a valid operator.
 * Valid operators are "+", "-", "/", "*"
 * @param anOperator input operator
 * @returns {boolean} true, valid operator
 */
var checkOperator = function (anOperator) {
    return $.inArray(anOperator, ["+", "-", "/", "*"]) !== -1;
}

init();

/**
 * UI
 */
$(function(){
    var welcomeMsg = 'Welcome';

    var clearWelcomeMsg = function () {
        $("#output:contains(" + welcomeMsg + ")").empty();
    }

    var handleError = function (anErrorMsg) {
        $("#output").val(anErrorMsg);
        init();
    }

    var handleCalculation = function () {
        var result = calculate();

        $("#output").empty();
        $("#input").val(result);
    }

    $(".number").on( "click", function() {
        clearWelcomeMsg();
        var number = $(this).val();

        //ignore special case 0 at the beginning
        if (this.id !== "key-0" ||
            (this.id === "key-0" && $("#input").val().trim() || getOperator() !== undefined)) {
            $("#input").append(number);
        }
    });

    $(".operator").on( "click", function () {
        var operator = $(this).val();
        var number = $("#input").val();

        try {
            if (getOperator() !== undefined && operator !== getOperator()) {
                //switch operator
                $("#output").val(getNumber() + ' ' + operator);
            } else {
                $("#output").append(number + ' ' + operator);
                $("#input").empty();
            }

            setNumber(number);
            setOperator(operator);
        } catch (error) {
            console.log(error);
            handleError(error)
        }
    });

    $("#key-\\=").on( "click", function () {
        var number = $("#input").val();

        setNumber(number);
        handleCalculation();
    });

    $("#key-c").on( "click", function() {
        $("#output").val(welcomeMsg);
        $("#input").empty();

        init();
    });
});