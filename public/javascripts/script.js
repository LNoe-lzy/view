/**
 * Created by lizongyuan on 2016/11/16.
 */
$(document).ready(function () {
    var view = new View();
    var viewModule = view.module();
    viewModule.require(['sign'], function () {
        new Sign();
    });
});


var View = function () {
    this.init();
};

View.prototype = {
    init: function () {

    },
    module: function () {
        var moduleMap = [];
        var fileMap = [];
        var noop = function () {};

        var define = function (name, dep, fn) {
            var module;
            if (!moduleMap[name]) {
                module = {
                    name: name,
                    dependencies: dep,
                    fn: fn
                };
                moduleMap[name] = module;
            }
            return moduleMap[name];
        };

        var require = function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {
                var path = pathArr[i];

                if (!fileMap[path]) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = 'true';
                    script.src = '../javascripts/' + path + '.js';
                    script.onload = function () {
                        fileMap[path] = true;
                        head.removeChild(script);
                        checkAllFiles();
                    };
                    head.appendChild(script);
                }
            }

            function checkAllFiles () {
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }
                if (allLoaded) {
                    callback();
                }
            }
        };

        var use = function (name) {
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    } else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }
                module.entity = module.fn.apply(noop, args);
            }
            return module.entity;
        };

        return {
            require: require,
            use: use,
            define: define
        };
    }
};
