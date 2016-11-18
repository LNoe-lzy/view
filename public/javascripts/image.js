/**
 * Created by lizongyuan on 2016/11/17.
 */
;(function () {
    var ImageModule = function () {
        this.init();
    };

    ImageModule.prototype = {
        init: function () {
            // this.waterfull();
            // this.proxy();
        },
        waterfull: function (view, imgArray) {
            if (view) {
                var getMinIndex = function (arr, val) {
                    for (var i in arr) {
                        if (arr[i] === val) {
                            return i;
                        }
                    }
                };
                var heightArray = [];
                var viewW = view.offsetWidth;
                var imgW = imgArray[0].offsetWidth;
                var cols = Math.floor(viewW / imgW);
                for (var i = 0, j = imgArray.length; i < j; i++) {
                    if (i < cols) {
                        heightArray.push(imgArray[i].offsetHeight);
                    } else {
                        var minH = Math.min.apply(null, heightArray);
                        var minIndex = getMinIndex(heightArray, minH);
                        imgArray[i].style['position'] = 'absolute';
                        imgArray[i].style['top'] = minH + 20 + 'px';
                        imgArray[i].style['left'] = (imgW + 16) * minIndex + 'px';
                        heightArray[minIndex] += imgArray[i].offsetHeight + 20;
                    }
                }
            }
        },
        proxy: function (parent, path) {
            var myImage = (function () {
                var imgNode = document.createElement('img');
                parent.appendChild(imgNode);

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
                        // myImage.setSrc();
                        img.src = src;
                    }
                }
            })();

            proxyImage.setSrc(path);
        }
    };

    window['ImageModule'] = ImageModule;
})();