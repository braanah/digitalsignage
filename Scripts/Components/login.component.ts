module PDigitalSignage {
    export class LoginComponent {
        parent: any;
        credentials = {
            domain: ''
        };

        static $inject = [
            '$http',
            '$scope'
        ];

        constructor(
            private $http,
        ) {}

        
        $onInit() {
            if(sessionStorage.domain){
                this.credentials.domain = sessionStorage.domain;
            }
        }

        getDomain(loginInfo){
            this.credentials.domain = loginInfo.domain;
        }

        hasDomain(){
            return !!this.credentials.domain;
        }
  
    }
    angular.module("app")
    .component('login', {
        controllerAs: 'vm',
        controller: LoginComponent,
        templateUrl: '/home/login'
        })
};