/**
 * Created by lizongyuan on 2017/2/8.
 */
$(document).ready(function () {
    // plus 表单遮罩层
    $('.plus').click(function () {
        $('.mask').fadeIn();
    });
    $('.close').click(function () {
        $('.mask').fadeOut();
    });
});