/**
 * Created by lizongyuan on 2016/11/17.
 */
var Image = function () {
    this.init();
};

Image.prototype = {
    init: function () {
        this.imageProxy();
    },
    imageProxy: function () {
        var myImage = (function () {
            var imgNode = document.createElement('img');
            document.body.appendChild(imgNode);

            return {
                setSrc: function (src) {
                    imgNode.src = src;
                }
            }
        })();

        var proxyImage = (function () {
            var img = new Image();
            img.onload = function () {
                myImage.setSrc(this.src);
            };

            return {
                setSrc: function (src) {
                    myImage.setSrc('');
                    img.src = src;
                }
            }
        })();

        proxyImage.setSrc("");
    }
};