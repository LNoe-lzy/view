/**
 * Created by lizongyuan on 2016/11/16.
 */
;(function () {
    var SignModule = function () {
        this.init();
    };

    SignModule.prototype = {
        init: function () {
            this.addEvent('signin');
            this.addEvent('signup');
        },
        addEvent: function (type) {
            var clientH = document.documentElement.clientHeight;
            var sign = document.getElementById(type);
            if (sign) {
                sign.addEventListener('click', function () {
                    document.getElementById('mask').style['display'] = 'block';
                    var signFrame = document.getElementById(type + 'Frame');
                    signFrame.style['display'] = 'block';
                    signFrame.style['top'] = (clientH - signFrame.clientHeight) / 2 + 'px';
                });
            }
            var closeNode = document.getElementsByClassName('sign-close');
            for (var i = 0, j = closeNode.length; i < j; i++ ) {
                (function (k) {
                    closeNode[k].addEventListener('click', function () {
                        document.getElementById('mask').style['display'] = 'none';
                        document.getElementById('signupFrame').style['display'] = 'none';
                        document.getElementById('signinFrame').style['display'] = 'none';
                    });
                })(i)
            }
        }
    };
    window['SignModule'] = SignModule;
})();