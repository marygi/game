var CommonGameObj = {
    loadHomePage: function () {
        var _self = this,
            options = {
                body : 'home-page-body',
                game: 'CommonGameObj',
                init: 'initGameSelection'
            };

        _self.fetchData('pages/home.html', options, _self.initLoadedPage);
    },

    initLoadedPage: function(data, options) {

        if(data) {
            document.body.innerHTML = data;
            document.body.className = options.body;

            if(options.game && options.init) {
                window[options.game][options.init]();
            }
        }
    },

    initGameSelection: function() {
        var _self = this;

        document.querySelector('.js-game-selection').addEventListener('click', function(e) {
            var target = e.target,
                path = 'pages/' + target.getAttribute('data-path') + '.html',
                options = {
                    body: target.getAttribute('data-body'),
                    game: target.getAttribute('data-game'),
                    init: target.getAttribute('data-init')
                };

            _self.fetchData(path, options, _self.initLoadedPage);
        });
    },

    getRandomNum: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    fetchData: function (path, options, callback) {
        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = httpRequest.responseText;

                    if (callback) {
                        callback(data, options);
                    }
                }
            }
        };

        httpRequest.open('GET', path, true);
        httpRequest.send();
    }
};