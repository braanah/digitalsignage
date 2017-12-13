var Presence;
(function (Presence) {
    var Student;
    (function (Student) {
        var Dashboard;
        (function (Dashboard) {
            var DashboardComponent = (function () {
                function DashboardComponent($http, orgsList, eventsList, organization, singleEvent) {
                    this.$http = $http;
                    this.orgsList = orgsList;
                    this.eventsList = eventsList;
                    this.organization = organization;
                    this.singleEvent = singleEvent;
                }
                DashboardComponent.prototype.getOrgsList = function () {
                    this.$http.get('https://api.presence.io/foobaru/v1/organizations')
                        .then(function (response) {
                        this.orgsList = response.data;
                    });
                    return this.orgsList;
                };
                DashboardComponent.prototype.getEventsList = function () {
                    this.$http.get('https://api.presence.io/foobaru/v1/events')
                        .then(function (response) {
                        this.eventsList = response.data;
                    });
                    return this.eventsList;
                };
                DashboardComponent.prototype.getSingleEvent = function () {
                    this.$http.get('https://api.presence.io/foobaru/v1/events')
                        .then(function (response) {
                        this.singleEvent = response.data;
                    });
                    return this.singleEvent;
                };
                DashboardComponent.prototype.getSingleOrganization = function (uri) {
                    this.$http.get('https://api.presence.io/foobaru/v1/organizations/%7B%7BorgUri%7D%7D')
                        .then(function (response) {
                        this.organization = response.data;
                    });
                    return this.organization;
                };
                return DashboardComponent;
            }());
            DashboardComponent.$inject = [
                "$http"
            ];
            Dashboard.DashboardComponent = DashboardComponent;
            angular.module("app.dashboard")
                .component('dashboard', {
                controllerAs: 'vm',
                controller: DashboardComponent,
                require: {
                    "parent": "^cihStudent"
                },
                templateUrl: ['appSettings', function (appSettings) { return ('ng/dashboard?v=' + appSettings.version); }]
            });
        })(Dashboard = Student.Dashboard || (Student.Dashboard = {}));
    })(Student = Presence.Student || (Presence.Student = {}));
})(Presence || (Presence = {}));
