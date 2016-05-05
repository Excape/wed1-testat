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

var setNumber = function (aNumber) {
    if (operation.var1 === undefined) {
        operation.var1 = new Number(aNumber);
    } else {
        operation.var2 = new Number(aNumber);
    }
}

var setOperator = function (anOperator) {
    operation.operator = anOperator;
}

var getOperator = function () {
    return operation.operator;
}

var calculate = function () {
    validate();
    result = eval(operation.var1 + operation.operator + operation.var2);
    init();
    operation.var1 = result;

    return result;
}

var validate = function () {
    //TODO
    return true;
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

    var handleCalculation = function () {
        var result = calculate();
        $("#output").val(result);
    }

    $(".number").on( "click", function() {
        clearWelcomeMsg();
        var number = $(this).val();
        //handle special case 0
        $("#input").append(number);
    });

    $(".operator").on( "click", function () {
        var operator = $(this).val();
        var number = $("#input").val();

        setNumber(number);
        if (getOperator() !== undefined) {
            handleCalculation();
            $("#output").append(' ' +  operator);
        } else {
            $("#output").append(number + ' ' +  operator);
        }
        setOperator(operator);
        $("#input").empty();
    });

    $("#key-\\=").on( "click", function () {
        var number = $("#input").val();
        $("#input").empty();

        setNumber(number);
        handleCalculation();
    });

    $("#key-c").on( "click", function() {
        $("#output").val(welcomeMsg);
        $("#input").empty();

        init();
    });
});