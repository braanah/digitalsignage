module PDigitalSignage {
    export class LoginComponent {
        parent: any;
        credentials = {
            domain: '',
            ready: false
        };

        static $inject = [
            '$http',
            '$scope'
        ];

        constructor(
            private $http,
        ) {}

        
        $onInit() {
            if(localStorage.domain){
                this.credentials.domain = localStorage.domain;
            }
            if(localStorage.ready){
                this.credentials.ready = localStorage.ready;
            }
        }

        getDomain(loginInfo){
            this.credentials.domain = loginInfo.domain;
        }

        knowsDomain(){
            this.credentials.ready = true;
        }
  
    }
    angular.module("app")
    .component('login', {
        controllerAs: 'vm',
        controller: LoginComponent,
        templateUrl: '/home/login'
        })
};