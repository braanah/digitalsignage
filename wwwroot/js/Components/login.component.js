var PDigitalSignage;
(function (PDigitalSignage) {
    var LoginComponent = (function () {
        function LoginComponent($http) {
            this.$http = $http;
            this.credentials = {
                domain: ''
            };
        }
        LoginComponent.prototype.$onInit = function () {
            if (localStorage.domain) {
                this.credentials.domain = localStorage.domain;
            }
        };
        LoginComponent.prototype.getDomain = function (loginInfo) {
            this.credentials.domain = loginInfo.domain;
        };
        LoginComponent.prototype.hasDomain = function () {
            return !!this.credentials.domain;
        };
        LoginComponent.$inject = [
            '$http',
            '$scope'
        ];
        return LoginComponent;
    }());
    PDigitalSignage.LoginComponent = LoginComponent;
    angular.module("app")
        .component('login', {
        controllerAs: 'vm',
        controller: LoginComponent,
        templateUrl: '/home/login'
    });
})(PDigitalSignage || (PDigitalSignage = {}));
;
//# sourceMappingURL=login.component.js.map