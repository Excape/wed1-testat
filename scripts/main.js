$(function(){

    $('form#new-author input').focusout(function () {
        if (!this.checkValidity()) {
            $(this).addClass('input-error');
        } else {
            $(this).removeClass('input-error');
        }
    });

});