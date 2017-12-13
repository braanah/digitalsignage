var PDigitalSignage;
(function (PDigitalSignage) {
    var DashboardComponent = (function () {
        function DashboardComponent($http, $interval, dashboardData) {
            this.$http = $http;
            this.$interval = $interval;
            this.dashboardData = dashboardData;
            this.rawEventData = [];
            this.eventList = [];
            this.thisWeekRandomized = [];
            this.todaysEventsRandomized = [];
            this.thisWeeksEvents = [];
            this.todaysEvents = [];
            this.counter = 0;
            this.domainName = '';
            this.designDetails = {};
            this.isStarted = false;
        }
        DashboardComponent.prototype.$onInit = function () {
            var _this = this;
            sessionStorage.setItem('domain', this.parent.credentials.domain);
            console.log(sessionStorage.domain);
            this.domainName = this.parent.credentials.domain;
            this.getEventList();
            this.getPortalDesign(this.domainName);
            this.refresh();
            setTimeout(function () {
                var iqrcode = new QRCode("qrcode-ios");
                var aqrcode = new QRCode("qrcode-and");
                _this.makeCode(iqrcode, _this.designDetails.iosStorePageUrl);
                _this.makeCode(aqrcode, _this.designDetails.androidStorePageUrl);
            }, 5000);
        };
        DashboardComponent.prototype.makeCode = function (item, url) {
            item.makeCode(url);
        };
        DashboardComponent.prototype.refresh = function () {
            var _this = this;
            setInterval(function () {
                _this.getEventList();
            }, 5000);
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
        DashboardComponent.prototype.containsObject = function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i] === obj) {
                    return true;
                }
            }
            return false;
        };
        DashboardComponent.prototype.getEventList = function () {
            var _this = this;
            var won = function (response) {
                _this.rawEventData = [];
                _this.eventList = [];
                _this.thisWeekRandomized = [];
                _this.todaysEventsRandomized = [];
                _this.thisWeeksEvents = [];
                _this.todaysEvents = [];
                _this.rawEventData = response.data;
                var today = new Date();
                for (var _i = 0, _a = _this.rawEventData; _i < _a.length; _i++) {
                    var event = _a[_i];
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                    if ((_this.eventList.indexOf(event)) == -1) {
                        if (days > -1 && hours > -10) {
                            _this.eventList.push(event);
                        }
                    }
                }
                for (var _b = 0, _c = _this.eventList; _b < _c.length; _b++) {
                    var event = _c[_b];
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                    if (days > -1 && days < 1) {
                        _this.todaysEvents.push(event);
                    }
                    if (days > 1 && days < 7) {
                        _this.thisWeeksEvents.push(event);
                    }
                }
                var eventCount = _this.thisWeeksEvents.length;
                for (var i = 0; i < 4 && i < _this.thisWeeksEvents.length; i++) {
                    _this.thisWeekRandomized[i] = _this.thisWeeksEvents[i];
                }
                if (_this.todaysEvents.length > 0) {
                    for (var i = 0; i < _this.todaysEvents.length && i < 5; i++) {
                        _this.todaysEventsRandomized.push(_this.todaysEvents[i]);
                    }
                }
                console.log(_this.todaysEventsRandomized, "random");
                console.log(_this.thisWeekRandomized);
                console.log(_this.thisWeeksEvents);
                console.log(_this.eventList);
            };
            var lost = function (response) {
                if (response == null) {
                    console.log("Nothing was retrieved from API");
                }
            };
            return this.dashboardData.getEvents(this.domainName)
                .then(won);
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