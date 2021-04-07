(function (win, doc) {

    function $(str) {
        return doc.querySelector(str)
    }

    function EasyPicker(opt) {
        this.container = $(opt.container);
        this.startY = 0;
        this.lastOffset = 0;
        this.limit = 60;
        this.itemHeight = 0;
        this.hasScrollHeight = {};
        this.renderDoms();
        this.initEvent();
    }

    EasyPicker.prototype = {
        constructor: EasyPicker,
        renderDoms: function () {
            html = [
                '<div class="picker-modal">',
                '<div class="picker-wrap">',
                '<div class="picker-toolbar">',
                '<button id="cancel" style="border: 0;background: none;font-size: 0.3rem;">取消</button>',
                '<button id="confirm" style="border: 0;background: none;font-size: 0.3rem;">确定</button>',
                '</div>',
                '<div class="picker-column">',
                '<div class="up"></div>',
                '<div class="down"></div>',
                '<div class="line"></div>',
                '<ul id="scrollArea">',
                '</ul>',
                '</div>',
                '</div>',
                '</div>'
            ]
            this.container.innerHTML = html.join('')
        },
        showPopData: function (data, name, callBack) {
            var self = this;
            this.showPop();
            this.initData(data, name);
            this.callBack(name, function (i, item) {
                // console.log(item)
                self["hasScrollHeight"][name] = self.lastOffset;
                callBack(item);
            });

        },
        initData: function (data, name) {
            // console.log(this.hasScrollHeight[name]);
            if (this.hasScrollHeight[name] == undefined) {
                this.hasScrollHeight[name] = 0;
            }
            this.data = data;
            $('#scrollArea').innerHTML = "";
            var scrollDoms = '<li></li><li></li>'
            for (var i = 0; i < data.length; i++) {
                scrollDoms += '<li data-value="data[i].value">' + data[i].label + '</li>'
            }
            $('#scrollArea').innerHTML = scrollDoms;
            this.itemHeight = $('#scrollArea li').clientHeight;
            document.getElementById("scrollArea").style.transform = 'translate3d(0, ' + this.hasScrollHeight[name] + 'px, 0)';
        },
        showPop: function () {
            var bg = $('.picker-modal');
            var wrap = $('.picker-wrap');
            bg.classList.add('picker-modal-show');
            wrap.classList.add('picker-wrap-show');
        },
        callBack: function (name, callback) {
            if (this.hasScrollHeight[name] == undefined) {
                this.hasScrollHeight[name] = 0;
            }
            var self = this;
            var confirmBtn = $('#confirm');
            var bg = $('.picker-modal');
            var wrap = $('.picker-wrap');
            // console.log("aa");
            self.lastOffset = this.hasScrollHeight[name];

            function confirmFun() {
                confirmBtn.removeEventListener('touchstart', confirmFun, false);
                var index = Math.abs(self.lastOffset / self.itemHeight)
                /* console.log(self.lastOffset);
                 console.log(self.itemHeight);*/
                bg.classList.remove('picker-modal-show');
                wrap.classList.remove('picker-wrap-show');
                // console.log(index);
                callback(index, self.data[index]);

            }

            confirmBtn.addEventListener('touchstart', confirmFun, false);
        },
        initEvent: function () {
            var confirmBtn = $('#confirm');
            var self = this,
                bg = $('.picker-modal'),
                wrap = $('.picker-wrap'),
                scroll = $('#scrollArea'),
                cancelBtn = $('#cancel');

            wrap.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, false)

            cancelBtn.addEventListener('touchstart', function (e) {
                bg.classList.remove('picker-modal-show');
                wrap.classList.remove('picker-wrap-show');
            }, false)

            bg.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                bg.classList.remove('picker-modal-show');
                wrap.classList.remove('picker-wrap-show');
            }, false)

            scroll.addEventListener('touchstart', function (e) {

                self.startY = e.targetTouches[0].pageY;
            }, false);

            scroll.addEventListener('touchmove', function (e) {

                var offset = e.targetTouches[0].pageY - self.startY,
                    distance = offset + self.lastOffset;

                if (distance > self.limit) {
                    distance = self.limit
                }

                if (distance < -((self.data.length - 1) * self.itemHeight + self.limit)) {
                    distance = -((self.data.length - 1) * self.itemHeight + self.limit)
                }

                scrollArea.style.transform = 'translate3d(0, ' + distance + 'px, 0)'
            }, false);

            scroll.addEventListener('touchend', function (e) {
                self.lastOffset += e.changedTouches[0].clientY - self.startY

                if (self.lastOffset > 0) {
                    self.lastOffset = 0
                }

                if (Math.abs(self.lastOffset) % 36 !== 0) {
                    self.lastOffset = -(parseInt(Math.abs(self.lastOffset) / self.itemHeight) * self.itemHeight)
                }

                if (self.lastOffset < -((self.data.length - 1) * self.itemHeight)) {
                    self.lastOffset = -((self.data.length - 1) * self.itemHeight)
                }

                if (self.lastOffset > 0) return

                scrollArea.style.transform = 'translate3d(0, ' + self.lastOffset + 'px, 0)'
            }, false)
        }
    }

    win.EasyPicker = EasyPicker


})(window, document)