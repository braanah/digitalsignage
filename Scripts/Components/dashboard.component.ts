module PDigitalSignage {
    export class DashboardComponent {
        rawEventData: any = []
        eventList: any = []
        topFourThisWeek: any = []
        topFiveToday: any = []
        thisWeeksEvents: any = []
        todaysEvents: any = []
        domainName = '';
        parent: any;
        designDetails: any = {};
        iqrurl: string;
        seconds: any;

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
            localStorage.setItem('domain', this.parent.credentials.domain);
            console.log(localStorage.domain)
            this.domainName = this.parent.credentials.domain;
            this.getEventList();
            this.getPortalDesign(this.domainName);
            setTimeout(() => {
                var iqrcode = new QRCode("qrcode-ios");
                var aqrcode = new QRCode("qrcode-and");
                if(!!this.designDetails.iosStorePageUrl){
                    this.makeCode(iqrcode, this.designDetails.iosStorePageUrl);
                }
                if(!!this.designDetails.androidStorePageUrl){
                    this.makeCode(aqrcode, this.designDetails.androidStorePageUrl);
                }
                this.getEventList();
                if(this.topFiveToday.length >= 2){
                    this.initSliderLeft();
                }
                if(this.eventList.length > 8){
                    this.initSliderUp();
                }
                this.refresh();
            }, 1000);
        }

        makeCode(item:any, url:string){
            item.makeCode(url);
        }

        refresh(){
            setInterval(() => {
                this.getEventList();
            }, this.seconds)
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
            this.seconds = this.dashboardData.eventList.length * 3000;
            console.log(this.dashboardData.eventList.length, this.seconds);
            return this.dashboardData.getEvents(this.domainName);
        }

        initSliderLeft(){
        
            setInterval( function() {
        
                var currentActive = $('#slider-left .slide.active');
                    
                currentActive.addClass('exit');
                
                setTimeout( function() {
                    $('#slider-left .slide.exit').removeClass('exit');
                }, 500);
                
                currentActive.next().addClass('active');
                
                currentActive.removeClass('active');
                
                if ( !currentActive.next().length ){
                    $('#slider-left .slide:first-child').addClass('active');
                }
                
            }, 5000);
        }
        
        initSliderUp(){

            setTimeout( function() {
            
                setInterval( function() {
                    
                    var move = 135;
            
                    var firstActive = $('ul.list .slide.active:first');
                    var currentActive = $('ul.list .slide.active');
                    var lastActive = $('ul.list .slide.active:last');
                    
                    setTimeout( function() {
                        $('ul.list .slide.exit').removeClass('exit');
                    }, 500);
                    
                    if ( !lastActive.next().length ){
                        $("ul.list .slide:not('.active'):first").addClass('active').css('top', move * 7 + 'px');
                        $("ul.list .slide:not('.active'):last").next().addClass('exit').removeClass('active').css('top', '1080px');
                    } else{
                        lastActive.next().addClass('active').css('top', move * 7 + 'px');
                        $("ul.list .slide.active:first").removeClass('active').addClass('exit').css('top', '1080px');
                    }

                    $('ul.list .slide.active').each( function(){
                        var activeTop = parseInt( $(this).css('top'));
                        $(this).css('top', activeTop + -move + 'px');
                    });
                    
                }, 3000);

            }, 5000);
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