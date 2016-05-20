"use strict";

$(function () {

    $('form#font-size-form > input').on('input', function () {
        $("output#font-size").val($(this).val());
        $("body").css("font-size", $(this).val() + "pt");
    });
});
