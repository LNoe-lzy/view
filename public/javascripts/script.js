/**
 * Created by lizongyuan on 2016/11/16.
 */
$(document).ready(function () {
    var view = new View();
    var viewModule = view.module();
    viewModule.require(['sign', 'image'], function () {
        new SignModule();
        var imageModule = new ImageModule();

        var imgTopArr = document.getElementsByClassName('img-top');
        for (var i = 0, j = imgTopArr.length; i < j; i ++ ) {
            (function (k) {
                var path = imgTopArr[k].getAttribute('data-imgpath');
                imageModule.proxy(imgTopArr[k], path);
            })(i);
        }

        // imageModule.waterfull(document.getElementById('view-right'), document.getElementsByClassName('img-item'));
    });
});
