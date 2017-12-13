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
        
        containsObject(obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i] === obj) {
                    return true;
                }
            }
            return false;
        }

        getEventList() { 
            // if(this.isStarted == true){
            //     // $('.today-slider').slick('unslick'); /* ONLY remove the classes and handlers added on initialize */
            // }
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
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                    if((this.eventList.indexOf(event)) == -1){
                        if(days > -1 && hours > -10){
                            this.eventList.push(event);
                        }
                    }
                }
                for(var event of this.eventList){
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = a.diff(b, 'hours');
                    // if((this.todaysEvents.indexOf(event)) < 0){
                        if(days > -1 && days < 1){
                            this.todaysEvents.push(event);
                        }
                    // }
                    // if((this.thisWeeksEvents.indexOf(event)) < 0){
                        if(days > 1 && days <  7){
                            this.thisWeeksEvents.push(event);
                        }
                    // }
                }
                
                var eventCount = this.thisWeeksEvents.length;
                for(var i = 0; i < 4 && i < this.thisWeeksEvents.length; i++){
                    // if((this.thisWeekRandomized.indexOf(event)) < 0)
                        this.thisWeekRandomized[i] = this.thisWeeksEvents[i];
                }
                if(this.todaysEvents.length > 0){
                    for(var i = 0; i < this.todaysEvents.length && i < 5; i++){
                        // if((this.todaysEventsRandomized.indexOf(event)) < 0)
                            this.todaysEventsRandomized.push(this.todaysEvents[i]);
                    }
                }
                console.log(this.todaysEventsRandomized, "random");
                console.log(this.thisWeekRandomized);
                console.log(this.thisWeeksEvents);
                // if(this.isStarted == false){
                //     this.isStarted = true;
                //     this.startCarousel();
                // }
                // else{
                //     this.eventList.push({ eventName: "Test", location: "Test Location" });
                    // $('.today-slider').slick({
                    //     infinite: true,
                    //     dots: true,
                    //     autoplaySpeed: 5000,
                    //     autoplay: true,
                    //     arrows: false,
                    //     vertical: false
                    // });
                // }
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
        
        // startCarousel(){
        //     $(document).ready(function(){
        //         $('.today-slider').slick({
        //             infinite: true,
        //             dots: true,
        //             autoplaySpeed: 5000,
        //             autoplay: true,
        //             arrows: false,
        //             vertical: false
        //         });
        //         $('.list-slider').not('.slick-initialized').slick({
        //             infinite: true,
        //             dots: false,
        //             autoplaySpeed: 2500,
        //             autoplay: true,
        //             arrows: false,
        //             slidesToShow: 10,
        //             vertical: true
        //         });
        //     });
        // }
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