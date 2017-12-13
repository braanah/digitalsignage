module DigitalSignage {
    angular
        .module('app', dependsOn())
        //.value('$routerRootComponent')

    function dependsOn() {
        return [
            'ngTouch',
            'angular-carousel',
            'angularMoment'
        ];
    }
}