var PDigitalSignage;
(function (PDigitalSignage) {
    var LoginComponent = (function () {
        function LoginComponent($http) {
            this.$http = $http;
            this.credentials = {
                domain: '',
                ready: false
            };
        }
        LoginComponent.prototype.$onInit = function () {
            if (localStorage.domain) {
                this.credentials.domain = localStorage.domain;
            }
            if (localStorage.ready) {
                this.credentials.ready = localStorage.ready;
            }
        };
        LoginComponent.prototype.getDomain = function (loginInfo) {
            this.credentials.domain = loginInfo.domain;
        };
        LoginComponent.prototype.knowsDomain = function () {
            this.credentials.ready = true;
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