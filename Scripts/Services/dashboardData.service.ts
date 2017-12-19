module PDigitalSignage {
    export class DashboardDataService {
        eventList: any = [];
        rawEventData:any = [];
        topFourThisWeek:any = [];
        topFiveToday:any = [];
        thisWeeksEvents:any = [];
        todaysEvents:any = [];
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
            var won = (response) => {
                this.rawEventData = [];
                this.eventList = [];
                this.topFourThisWeek = [];
                this.topFiveToday = [];
                this.thisWeeksEvents = [];
                this.todaysEvents = [];
                this.rawEventData = response.data;
                var today = new Date();
                for(var event of this.rawEventData){
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var hours = c.diff(b, 'hours');
                    console.log(hours);
                    if((this.eventList.indexOf(event)) == -1){
                        if(days > -1 && hours > -1){
                            this.eventList.push(event);
                        }
                    }
                    this.eventList.sort(function(a, b) {
                        const firstEvent = a.startDateTimeUtc;
                        const secondEvent = b.startDateTimeUtc;
                      
                        let comparison = 0;
                        if (firstEvent > secondEvent) {
                          comparison = 1;
                        } else if (firstEvent < secondEvent) {
                          comparison = -1;
                        }
                        return comparison;
                    });
                }
                for(var event of this.eventList){
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var now = b._d;
                    var start = c._d;
                    var days = a.diff(b, 'days');
                    var startHours = a.diff(b, 'hours');
                    var endHours = c.diff(b, 'hours');
                    console.log(event.eventName);
                        if(days < 1 && endHours > 1){
                            this.todaysEvents.push(event);
                        }
                        if(days > 1 && days <  7){
                            this.thisWeeksEvents.push(event);
                        }
                }
                
                var eventCount = this.thisWeeksEvents.length;
                for(var i = 0; i < 4 && i < this.thisWeeksEvents.length; i++){
                        this.topFourThisWeek[i] = this.thisWeeksEvents[i];
                }
                if(this.todaysEvents.length > 0){
                    for(var i = 0; i < this.todaysEvents.length && i < 5; i++){
                            this.topFiveToday.push(this.todaysEvents[i]);
                    }
                }
                console.log(this.topFiveToday);
                console.log(this.topFourThisWeek);
                console.log(this.thisWeeksEvents);
                console.log(this.eventList);
            }
            var lost = (response) => {
                if(response == null){
                    console.log("Nothing was retrieved from API")
                }
            }
            return this.$http.get(`https://api.presence.io/${domain}/v1/events`)
            .then(won)
        }
    }
    angular.module("app")
    .service('dashboardDataService', DashboardDataService) 
}