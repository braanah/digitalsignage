var mod = angular.module('app',[])
.controller('cntrlr', ["$scope", "$interval", function($scope, $interval){
  $scope.items = [
    "Branding",
                 "Identity Design",
                  "Wob Development",
                  "Social Media Setup",
                  "Email Marketing",
                  "Brochure Development",
                  "Logo Design",
                  "jouil afa",
                  "poloihuhd",
                  " random number",
                  "Stochastic what?",
                  "Rieman number"
                 ];
  $scope.ConfigureList = function(){
    
    $interval(function(){
      $('ul.container li:nth-child(2n)').css({
      "background" : "linear-gradient(to bottom, #878ced 0%,#0072c6 49%,#007 51%,#878ced 100%)",
        "color": "#FFF"
    });
    }, 100, 1);                   
    
  };
  
  $scope.beginVertScroll = function(){
    
    $interval(
     function(){
        var firstElement = $('ul.container li:first');
       var hgt = firstElement.height() +
        
           parseInt(firstElement.css("paddingTop"), 10) + parseInt(firstElement.css("paddingBottom"), 10)+
           parseInt(firstElement.css("marginTop"), 10) + parseInt(firstElement.css("marginBottom"), 10);
       
       var cntnt = firstElement.html();
       
       $("ul.container").append("<li>" + cntnt + "</li>");
       
      ;        
       
       cntnt = "";
       firstElement.animate({
         "marginTop" : -hgt
       }, 600, function(){
         
         $scope.itemToremove = $(this) ;    
         
         
          $('ul.container li').last().css({
         "background" : $(this).css("background"),
            "color" : $(this).css("color")
       });        
         
        $(this).remove();
                   
       });
       //alert(hgt);
     },
       5000
     );
  };
}])
.directive('drctv', ["$interval",function($interval){
 return {
   
   link: function ($scope, $element, $attribute, $interval) {      
     
    $scope.ConfigureList();      
     
     $scope.beginVertScroll();      
   }
 };
 
}]);