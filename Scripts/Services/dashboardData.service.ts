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
            '$interval',
            '$sce'
        ];

        constructor(
            private $http,
            private $interval,
            private $sce
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
                    var start = a.diff(b, 'hours');
                    var end = c.diff(b, 'hours');
                    if((this.eventList.indexOf(event)) == -1){
                        if(end > -1 && days < 31){
                            this.eventList.push(event);
                        }
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
                for(var event of this.eventList){
                    if(!!event.description){
                        event.description = this.$sce.trustAsHtml(this.truncateHtml(event.description, '<a><br><span><p>'));
                    }
                    var b = moment.utc(today);
                    var a = moment.utc(event.startDateTimeUtc);
                    var c = moment.utc(event.endDateTimeUtc);
                    var days = a.diff(b, 'days');
                    var startHours = a.diff(b, 'hours');
                    var endHours = c.diff(b, 'hours');
                        if(days < 1 && startHours < 10 && startHours > -5 || endHours < 5){
                            this.todaysEvents.push(event);
                        }
                        if(startHours > 12 && days <=  7){
                            this.thisWeeksEvents.push(event);
                        }
                }
                for(var i = 0; i < 4 && i < this.thisWeeksEvents.length; i++){
                        this.topFourThisWeek[i] = this.thisWeeksEvents[i];
                }
                if(this.todaysEvents.length > 0){
                    for(var i = 0; i < this.todaysEvents.length && i < 5; i++){
                            this.topFiveToday.push(this.todaysEvents[i]);
                    }
                }
            }
            var lost = (response) => {
                if(response == null){
                    console.log("Nothing was retrieved from API")
                }
            }
            return this.$http.get(`https://api.presence.io/${domain}/v1/events`)
            .then(won)
        }

        truncateHtml(input, allowed) {
            allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;


            return input.replace(commentsAndPhpTags, '')
                .replace(tags, function($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
        }
    }
    angular.module("app")
    .service('dashboardDataService', DashboardDataService) 
}