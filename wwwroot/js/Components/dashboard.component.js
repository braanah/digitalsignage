var PDigitalSignage;
(function (PDigitalSignage) {
    var DashboardComponent = (function () {
        function DashboardComponent($http, $interval, dashboardData) {
            this.$http = $http;
            this.$interval = $interval;
            this.dashboardData = dashboardData;
            this.rawEventData = [];
            this.eventList = [];
            this.topFourThisWeek = [];
            this.topFiveToday = [];
            this.thisWeeksEvents = [];
            this.todaysEvents = [];
            this.domainName = '';
            this.designDetails = {};
        }
        DashboardComponent.prototype.$onInit = function () {
            var _this = this;
            localStorage.setItem('domain', this.parent.credentials.domain);
            console.log(localStorage.domain);
            this.domainName = this.parent.credentials.domain;
            this.getEventList();
            this.getPortalDesign(this.domainName);
            setTimeout(function () {
                var iqrcode = new QRCode("qrcode-ios");
                var aqrcode = new QRCode("qrcode-and");
                if (!!_this.designDetails.iosStorePageUrl) {
                    _this.makeCode(iqrcode, _this.designDetails.iosStorePageUrl);
                }
                if (!!_this.designDetails.androidStorePageUrl) {
                    _this.makeCode(aqrcode, _this.designDetails.androidStorePageUrl);
                }
                _this.getEventList();
                if (_this.topFiveToday.length >= 2) {
                    _this.initSliderLeft();
                }
                _this.refresh();
            }, 1000);
        };
        DashboardComponent.prototype.makeCode = function (item, url) {
            item.makeCode(url);
        };
        DashboardComponent.prototype.refresh = function () {
            var _this = this;
            setInterval(function () {
                _this.getEventList();
            }, this.seconds);
        };
        DashboardComponent.prototype.getPortalDesign = function (domain) {
            var _this = this;
            return this.$http.get("https://api.presence.io/" + domain + "/v1/app/portal")
                .then(function (response) {
                _this.designDetails = response.data;
            })
                .catch(function (response) {
                console.log('failed');
            });
        };
        DashboardComponent.prototype.getEventList = function () {
            this.rawEventData = this.dashboardData.rawEventData;
            this.eventList = this.dashboardData.eventList;
            this.topFourThisWeek = this.dashboardData.topFourThisWeek;
            this.topFiveToday = this.dashboardData.topFiveToday;
            this.thisWeeksEvents = this.dashboardData.thisWeeksEvents;
            this.todaysEvents = this.dashboardData.todaysEvents;
            this.seconds = this.dashboardData.eventList.length * 3000;
            if (this.eventList.length > 8) {
                this.initSliderUp();
            }
            console.log(this.dashboardData.eventList.length, this.seconds);
            return this.dashboardData.getEvents(this.domainName);
        };
        DashboardComponent.prototype.initSliderLeft = function () {
            setInterval(function () {
                var currentActive = $('#slider-left .slide.active');
                currentActive.addClass('exit');
                setTimeout(function () {
                    $('#slider-left .slide.exit').removeClass('exit');
                }, 500);
                currentActive.next().addClass('active');
                currentActive.removeClass('active');
                if (!currentActive.next().length) {
                    $('#slider-left .slide:first-child').addClass('active');
                }
            }, 5000);
        };
        DashboardComponent.prototype.initSliderUp = function () {
            setTimeout(function () {
                setInterval(function () {
                    var move = 135;
                    var firstActive = $('ul.list .slide.active:first');
                    var currentActive = $('ul.list .slide.active');
                    var lastActive = $('ul.list .slide.active:last');
                    setTimeout(function () {
                        $('ul.list .slide.exit').removeClass('exit');
                    }, 500);
                    if (!lastActive.next().length) {
                        $("ul.list .slide:not('.active'):first").addClass('active').css('top', move * 7 + 'px');
                        $("ul.list .slide:not('.active'):last").next().addClass('exit').removeClass('active').css('top', '1080px');
                    }
                    else {
                        lastActive.next().addClass('active').css('top', move * 7 + 'px');
                        $("ul.list .slide.active:first").removeClass('active').addClass('exit').css('top', '1080px');
                    }
                    $('ul.list .slide.active').each(function () {
                        var activeTop = parseInt($(this).css('top'));
                        $(this).css('top', activeTop + -move + 'px');
                    });
                }, 3000);
            }, 5000);
        };
        return DashboardComponent;
    }());
    DashboardComponent.$inject = [
        '$http',
        '$interval',
        'dashboardDataService'
    ];
    PDigitalSignage.DashboardComponent = DashboardComponent;
    angular.module("app")
        .component('dashboard', {
        controllerAs: 'vm',
        controller: DashboardComponent,
        templateUrl: '/home/dashboard',
        require: {
            parent: '^login'
        }
    });
})(PDigitalSignage || (PDigitalSignage = {}));
//# sourceMappingURL=dashboard.component.js.map