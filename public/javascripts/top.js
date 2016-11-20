/**
 * Created by lizongyuan on 2016/11/20.
 */
;(function () {
    var Top = function (elem) {
        this.elem = elem;
        this.init();
    };

    Top.prototype = {
        init: function () {
            var that = this.elem;
            var timer;
            var flag = true;
            window.onscroll = function () {
                if (!flag) {
                    clearInterval(timer);
                }
                flag = false;

                var clientH = document.documentElement.clientHeight;
                var clientT = document.body.scrollTop;
                if (clientT > clientH) {
                    that.style['display'] = 'block';
                } else {
                    that.style['display'] = 'none';
                }

            };
            this.elem.onclick = function () {
                timer = setInterval(function () {
                    var top = document.body.scrollTop;
                    var speed = Math.floor(- top / 15);
                    document.body.scrollTop = top + speed;
                    flag = true;
                    if (top === 0) {
                        clearInterval(timer);
                    }

                });
            };
        }
    };

    window['TopModule'] = Top;
})();