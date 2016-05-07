/**
 * core
 */
var operation;

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
 * @returns {*} result
 */
var calculate = function () {
    if (operation.var2 === undefined && checkValidPrefix(operation.operator)) {
        operation.var2 = operation.var1;
        operation.var2 = Number(0);
    }
    var tempResult;
    if (!checkOperator(operation.operator)) {
        throw "invalid operator";
    }
    if (!checkInt(operation.var1) || !checkInt(operation.var2)) {
        throw "invalid number";
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
    init();
    operation.var1 = new Number(tempResult);
    return tempResult;
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

/**
 * Check if a parameter is a valid prefix.
 * Valid operators are "+", "-"
 * @param anOperator input operator
 * @returns {boolean} true, valid prefix
 */
var checkValidPrefix = function (anOperator) {
    return $.inArray(anOperator, ["+", "-"]) !== -1;
}

init();

/**
 * UI
 */
$(function(){
    var welcomeMsg = 'Welcome';
    var resultAvailable = false;

    var clearWelcomeMsg = function () {
        $("#output:contains(" + welcomeMsg + ")").empty();
    }
    
    var clearErrorMsg = function () {
        if ($("#output").hasClass("error")) {
            $("#output").empty();
            $("#output").removeClass("error");
        }
    }

    var handleError = function (anErrorMsg) {
        $("#output").val(anErrorMsg);
        $("#output").addClass("error");
        init();
    }

    var handleCalculation = function () {
        var result = calculate();

        $("#output").empty();
        $("#input").val(result);
        resultAvailable = true;
    }

    $(".number").on( "click", function() {
        clearWelcomeMsg();
        clearErrorMsg();

        var number = $(this).val();

        if (resultAvailable) {
            //previous result should be ignored in this case
            $("#input").empty();
            init();
            resultAvailable = false;
        }

        //ignore special case 0 at the beginning
        if (this.id !== "key-0" ||
            (this.id === "key-0" && $("#input").val().trim() || getOperator() !== undefined)) {
            $("#input").append(number);
        }
    });

    $(".operator").on( "click", function () {
        clearWelcomeMsg();
        clearErrorMsg();
        resultAvailable = false;

        var operator = $(this).val();
        var number = $("#input").val();

        try {

            if (getNumber() === undefined && !number.trim()) {
                //check valid prefix
                if (!checkValidPrefix(operator)) {
                    throw "invalid prefix";
                }
                $("#output").val(operator);
            } else if (getOperator() !== undefined && getNumber() !== undefined) {
                //switch operator
                $("#output").val(getNumber() + ' ' + operator);
            } else {
                $("#output").append(number + ' ' + operator);
                $("#input").empty();
            }

            if (number.trim()) {
                setNumber(number);
            }

            setOperator(operator);
        } catch (error) {
            console.log(error);
            handleError(error)
        }
    });

    $("#key-\\=").on( "click", function () {
        var number = $("#input").val();

        try {
            setNumber(number);
            handleCalculation();
        } catch (error) {
            console.log(error);
            handleError(error)
        }
    });

    $("#key-c").on( "click", function() {
        $("#output").val(welcomeMsg);
        $("#input").empty();
        resultAvailable = false;
        init();
    });
});