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
            if (sessionStorage.domain) {
                this.credentials.domain = sessionStorage.domain;
            }
        };
        LoginComponent.prototype.getDomain = function (loginInfo) {
            this.credentials.domain = loginInfo.domain;
        };
        LoginComponent.prototype.hasDomain = function () {
            return !!this.credentials.domain;
        };
        return LoginComponent;
    }());
    LoginComponent.$inject = [
        '$http',
        '$scope'
    ];
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