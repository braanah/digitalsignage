var PDigitalSignage;
(function (PDigitalSignage) {
    var LoginService = (function () {
        function LoginService($http) {
            this.$http = $http;
        }
        LoginService.prototype.getEvents = function () {
            return this.$http.get('https://api.presence.io/atlantis/v1/events');
        };
        return LoginService;
    }());
    LoginService.$inject = [
        '$http',
        '$scope',
        '$rootScope'
    ];
    PDigitalSignage.LoginService = LoginService;
})(PDigitalSignage || (PDigitalSignage = {}));
//# sourceMappingURL=login.service.js.map