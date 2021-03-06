var PDigitalSignage;
(function (PDigitalSignage) {
    var DashboardDataService = (function () {
        function DashboardDataService($http, $interval, $sce) {
            this.$http = $http;
            this.$interval = $interval;
            this.$sce = $sce;
            this.eventList = [];
            this.rawEventData = [];
            this.topFourThisWeek = [];
            this.topFiveToday = [];
            this.thisWeeksEvents = [];
            this.todaysEvents = [];
        }
        DashboardDataService.prototype.getEvents = function (domain) {
            var _this = this;
            var won = function (response) {
                _this.rawEventData = [];
                _this.eventList = [];
                _this.topFourThisWeek = [];
                _this.topFiveToday = [];
                _this.thisWeeksEvents = [];
                _this.todaysEvents = [];
                _this.rawEventData = response.data;
                var today = new Date();
                for (var _i = 0, _a = _this.rawEventData; _i < _a.length; _i++) {
                    var event = _a[_i];
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var start = a.diff(b, 'hours');
                    var end = c.diff(b, 'hours');
                    if ((_this.eventList.indexOf(event)) == -1) {
                        if (end > -1 && days < 31) {
                            _this.eventList.push(event);
                        }
                    }
                }
                _this.eventList.sort(function (a, b) {
                    var firstEvent = a.startDateTimeUtc;
                    var secondEvent = b.startDateTimeUtc;
                    var comparison = 0;
                    if (firstEvent > secondEvent) {
                        comparison = 1;
                    }
                    else if (firstEvent < secondEvent) {
                        comparison = -1;
                    }
                    return comparison;
                });
                for (var _b = 0, _c = _this.eventList; _b < _c.length; _b++) {
                    var event = _c[_b];
                    if (!!event.description) {
                        event.description = _this.$sce.trustAsHtml(_this.truncateHtml(event.description, '<a><br><span><p>'));
                    }
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var startHours = a.diff(b, 'hours');
                    var endHours = c.diff(b, 'hours');
                    if (days < 1 && startHours < 10 && startHours > -5 || endHours < 5) {
                        _this.todaysEvents.push(event);
                    }
                    if (startHours > 12 && days <= 7) {
                        _this.thisWeeksEvents.push(event);
                    }
                }
                for (var i = 0; i < 4 && i < _this.thisWeeksEvents.length; i++) {
                    _this.topFourThisWeek[i] = _this.thisWeeksEvents[i];
                }
                if (_this.todaysEvents.length > 0) {
                    for (var i = 0; i < _this.todaysEvents.length && i < 5; i++) {
                        _this.topFiveToday.push(_this.todaysEvents[i]);
                    }
                }
            };
            var lost = function (response) {
                if (response == null) {
                    console.log("Nothing was retrieved from API");
                }
            };
            return this.$http.get("https://api.presence.io/" + domain + "/v1/events")
                .then(won);
        };
        DashboardDataService.prototype.truncateHtml = function (input, allowed) {
            allowed = (((allowed || '') + '')
                .toLowerCase()
                .match(/<[a-z][a-z0-9]*>/g) || [])
                .join('');
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
            return input.replace(commentsAndPhpTags, '')
                .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
        };
        return DashboardDataService;
    }());
    DashboardDataService.$inject = [
        '$http',
        '$interval',
        '$sce'
    ];
    PDigitalSignage.DashboardDataService = DashboardDataService;
    angular.module("app")
        .service('dashboardDataService', DashboardDataService);
})(PDigitalSignage || (PDigitalSignage = {}));
//# sourceMappingURL=dashboardData.service.js.map