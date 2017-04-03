/**
 * Created by lizongyuan on 2017/2/6.
 */
$(document).ready(function () {
    $('.icon').click(function () {
        $('#select').fadeIn();
    });
    $('#hideSelect').click(function () {
        $('#select').fadeOut();
    });

    // 注册登录显示
    var windowWidth = $(window).width();
    var headerRight = $('.header-right').width();
    $('.register').css({
        left: windowWidth,
        right: -headerRight
    });
    $('.signup, .signin').click(function () {
        var that = $(this);
        var register = $('.register');
        register.find('button').html(that.html());
        $('.home-wrapper').animate({
            right: headerRight + 'px'
        });
        register.animate({
            left: windowWidth - headerRight,
            right: 0
        });
    });
    $('.right').click(function () {
        $('.home-wrapper').animate({
            right: 0
        });
        $('.register').animate({
            left: windowWidth,
            right: -headerRight
        });
    });

    // 处理表单数据
    $('.submit').click(function () {
        var action;
        if ($(this).html() === '注册') {
            action = '/signup';
        } else {
            action = '/signin';
        }
        var username = $('.username').val();
        var password = $('.password').val();
        $.ajax({
            url: action,
            type: 'POST',
            async: true,
            data: {
                username: username,
                password: password

            },
            dataType: 'json',
            complete: function () {
                window.location.reload();
            }
        });
    });

    $('#face').change(function () {
        $('#searchWord').val('face');
        $('.face').css('border-radius', '10%');
    });
    $('#image').change(function () {
        $('.image').css('border-radius', '10%');
    });
});