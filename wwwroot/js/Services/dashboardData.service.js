var PDigitalSignage;
(function (PDigitalSignage) {
    var DashboardDataService = (function () {
        function DashboardDataService($http, $interval) {
            this.$http = $http;
            this.$interval = $interval;
            this.eventList = [];
        }
        DashboardDataService.prototype.getEvents = function (domain) {
            return this.$http.get("https://api.presence.io/" + domain + "/v1/events");
        };
        return DashboardDataService;
    }());
    DashboardDataService.$inject = [
        '$http',
        '$interval'
    ];
    PDigitalSignage.DashboardDataService = DashboardDataService;
    angular.module("app")
        .service('dashboardDataService', DashboardDataService);
})(PDigitalSignage || (PDigitalSignage = {}));
//# sourceMappingURL=dashboardData.service.js.map