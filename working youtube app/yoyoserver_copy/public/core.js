
var dashBoard = angular.module('dashBoard', ['ui.router' ,'zingchart-angularjs']);

dashBoard.config(function($stateProvider , $urlRouterProvider ) {
    $stateProvider.state('list', {
          url: '/list',
          templateUrl: 'templates/list.html',
          controller:'listController',
        })
    .state('graph', {
        url: '/graph/:_id',
        templateUrl: 'graph.html',
        params:{
          _id:null,
        },
        controller:'graphController',
      });
    $urlRouterProvider.otherwise('/list');
});

dashBoard.controller('listController',function($state , $scope , $http , $timeout){
  $http.get('/listData')
    .success(function(data){
        console.log(data);
        console.log("have a look ");
        $timeout(function(){
          $scope.listData = data.usefull;
        });
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

  $scope.sendtoGraph = function(event ,index){
    var data = $scope.listData[index];
    $state.go('graph' , {_id:data._id});
  }
});
dashBoard.controller('graphController' , function( $state, $scope , $http , $timeout){
  var id = $state.params._id
  console.log(id);
  $http({
      url: '/graphData',
      method: "GET",
      params: {id: id}
   }).then(function(res){
     console.log(res);
     console.log(res.data.buff);
     console.log(res.data.quality);
     console.log(res.data.rebuff);
     console.log(res.data.strength);
     var rebuffCont =res.data.rebuff.content.slice();

     rebuffCont.sort();
     var buffCont =res.data.buff.content.slice();
     var lenBuff = buffCont.length;
     var startBuff= 10000000;
     var endBuff= -10000000;
     console.log("rebuff");
     console.log(rebuffCont);
     console.log("buff");
     console.log(buffCont);
    for(var alle = 0 ; alle  < lenBuff ; alle++){
        var curr = buffCont[alle];
        if(Number.isInteger(curr) ==false){
          curr = parseInt(curr);
        }
        if(curr< startBuff ){
          startBuff = buffCont[alle];
        }
        if(curr>endBuff){
          endBuff = buffCont[alle];
        }
    }
     console.log(startBuff);
     console.log(endBuff);

     $timeout(function(){
       //we need to go thorug
       $scope.myQualityJson = {
          "type" : 'line' ,
          "scale-x": {
            "label":{
              "text":"Player Time"
            },
            "labels":res.data.quality.time,
          },
          "scale-y": {
            "label":{
              "text":"Video Quality"
            },
          },
          "series" : [
            {"values":res.data.quality.content}
          ]
        };
        $scope.myBuffJson = {
           "type" : 'line' ,
           "scale-x": {
             "label":{
               "text":"Actual Time"
             },
             "labels":res.data.buff.time,
           },
           "scale-y": {
             "label":{
               "text":"Time Buffered"
              },
             },
           "series" : [
             {"values":res.data.buff.content}
           ]
         };
         $scope.myRebuffJson = {
            "type" : 'line' ,
            "scale-x": {
              "label":{
                "text":"Player Time"
              },
              "labels":res.data.rebuff.time,
            },
            "scale-y": {
              "label":{
                "text":"Rebuffer Time"
              },
              "values":rebuffCont,
            },
            "series" : [
              {"values":res.data.rebuff.content}
            ]
          };
          $scope.myStrengthJson = {
             "type" : 'line' ,
             "scale-x": {
               "label":{
                 "text":"Player Time"
               },
               "labels":res.data.strength.time,
             },
             "scale-y": {
               "label":{
                 "text":"Signal Strength"
               },
             },
             "series" : [
               {"values":res.data.strength.content}
             ]
           };
     });
   },function(err){

   });
});
