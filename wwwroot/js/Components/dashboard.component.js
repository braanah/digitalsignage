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
            this.isLoading = this.dashboardData.isLoading;
            this.domainName = '';
            this.designDetails = {};
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
        DashboardComponent.prototype.getEventList = function () {
            this.rawEventData = this.dashboardData.rawEventData;
            this.eventList = this.dashboardData.eventList;
            this.topFourThisWeek = this.dashboardData.topFourThisWeek;
            this.topFiveToday = this.dashboardData.topFiveToday;
            this.thisWeeksEvents = this.dashboardData.thisWeeksEvents;
            this.todaysEvents = this.dashboardData.todaysEvents;
            return this.dashboardData.getEvents(this.domainName);
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