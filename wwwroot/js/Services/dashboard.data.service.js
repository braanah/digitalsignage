var PDigitalSignage;
(function (PDigitalSignage) {
    var DashboardServic = (function () {
        function DashboardServic() {
            this.count = 0;
        }
        return DashboardServic;
    }());
    PDigitalSignage.DashboardServic = DashboardServic;
    angular.module("app.services")
        .service('dashboardService', DashboardService);
})(PDigitalSignage || (PDigitalSignage = {}));
//# sourceMappingURL=dashboard.data.service.js.map