module PDigitalSignage {
    export class DashboardComponent {
        rawEventData: any = []
        eventList: any = []
        topFourThisWeek: any = []
        topFiveToday: any = []
        thisWeeksEvents: any = []
        todaysEvents: any = []
        isLoading: boolean = this.dashboardData.isLoading;
        domainName = '';
        parent: any;
        designDetails: any = {};
        iqrurl: string;

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
            this.rawEventData = this.dashboardData.rawEventData;
            this.eventList = this.dashboardData.eventList;
            this.topFourThisWeek = this.dashboardData.topFourThisWeek;
            this.topFiveToday = this.dashboardData.topFiveToday;
            this.thisWeeksEvents = this.dashboardData.thisWeeksEvents;
            this.todaysEvents = this.dashboardData.todaysEvents;
            return this.dashboardData.getEvents(this.domainName);
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