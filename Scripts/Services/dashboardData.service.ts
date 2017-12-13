module PDigitalSignage {
    export class DashboardDataService {
        eventList: any = [];
        singleEvent;
        orgsList;

        static $inject = [
            '$http',
            '$interval'
        ];

        constructor(
            private $http,
            private $interval
        ) { }
        
        getEvents(domain){
            return this.$http.get(`https://api.presence.io/${domain}/v1/events`)
        }
    }
    angular.module("app")
    .service('dashboardDataService', DashboardDataService) 
}