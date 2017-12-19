module PDigitalSignage {
    export class DashboardComponent {
        rawEventData: any = [];
        eventList: any = [];
        thisWeekRandomized: any = [];
        todaysEventsRandomized: any = [];
        thisWeeksEvents: any = [];
        todaysEvents: any = [];
        counter: number = 0;
        domainName = '';
        parent: any;
        designDetails: any = {};
        iqrurl: string;
        isStarted: boolean = false;

        static $inject = [
            '$http',
            '$interval',
            'dashboardDataService'
        ];

        constructor(
            private $http,
            private $interval,
            private dashboardData
        ) { }

        $onInit() {
            sessionStorage.setItem('domain', this.parent.credentials.domain);
            console.log(sessionStorage.domain)
            this.domainName = this.parent.credentials.domain;
            this.getEventList();
            this.getPortalDesign(this.domainName);
            this.refresh();
            setTimeout(() => {
                var iqrcode = new QRCode("qrcode-ios");
                var aqrcode = new QRCode("qrcode-and");
                this.makeCode(iqrcode, this.designDetails.iosStorePageUrl);
                this.makeCode(aqrcode, this.designDetails.androidStorePageUrl);
            }, 5000);
        }

        makeCode(item:any, url:string){
            item.makeCode(url);
        }

        refresh(){
            setInterval(() => {
                this.getEventList();
            }, 5000)
        }

        getPortalDesign(domain) {
            return this.$http.get(`https://api.presence.io/${domain}/v1/app/portal`)
                .then((response) => {
                    this.designDetails = response.data;
                })
                .catch((response) => {
                    console.log('failed')
                })
        }  

        getEventList() { 
            var won = (response) => {
                this.rawEventData = [];
                this.eventList = [];

                this.thisWeekRandomized = [];
                this.todaysEventsRandomized = [];
                this.thisWeeksEvents = [];
                this.todaysEvents = [];
                this.rawEventData = response.data;
                var today = new Date();
                for(var event of this.rawEventData){
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                    console.log(hours);
                    if((this.eventList.indexOf(event)) == -1){
                        if(days > -1){
                            this.eventList.push(event);
                        }
                    }
                }

                this.eventList.sort(function(a, b){
                    return a.startDateTimeUtc - b.startDateTimeUtc;
                });
                console.log(this.eventList);
                for(var event of this.eventList){
                    var b = moment.utc(today);
                    var a = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                        if(days > -1 && days < 1 && hours < 5){
                            this.todaysEvents.push(event);
                        }
                        if(days > 1 && days <  7){
                            this.thisWeeksEvents.push(event);
                        }
                }
                
                var eventCount = this.thisWeeksEvents.length;
                for(var i = 0; i < 4 && i < this.thisWeeksEvents.length; i++){
                        this.thisWeekRandomized[i] = this.thisWeeksEvents[i];
                }
                if(this.todaysEvents.length > 0){
                    for(var i = 0; i < this.todaysEvents.length && i < 5; i++){
                            this.todaysEventsRandomized.push(this.todaysEvents[i]);
                    }
                }
                console.log(this.todaysEventsRandomized, "random");
                console.log(this.thisWeekRandomized);
                console.log(this.thisWeeksEvents);
                console.log(this.eventList);
            }
            var lost = (response) => {
                if(response == null){
                    console.log("Nothing was retrieved from API")
                }
            }
            return this.dashboardData.getEvents(this.domainName)
                .then(won)
        }
        
    }
    angular.module("app")
    .component('dashboard', {
        controllerAs: 'vm',
        controller: DashboardComponent,
        templateUrl: '/home/dashboard',
        require:{
            parent: '^login'
        }
    })
}