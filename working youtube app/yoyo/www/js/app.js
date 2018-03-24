
  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('yoyo', ['ionic' , 'ionic-ratings' ])

app.config(function($stateProvider , $urlRouterProvider){
  $stateProvider
    .state('query', {
      url: '/query',
      templateUrl: 'templates/query.html',
      controller:'queryController',
    })
    .state('list', {
      url: '/list/:query',
      templateUrl: 'templates/list.html',
      params:{
        query:null
      },
      controller:'listController',
    })
    .state('player', {
      url: '/player/:vidId',
      templateUrl: 'templates/player.html',
      params:{
        vidId:null,
        dataPacket:null
      },
      controller:'playerController',
    })
    .state('rating', {
      url: '/rating',
      params:{
        vidId:null,
        uuid:null,
        timestamp:null
      },
      templateUrl: 'templates/rating.html',
      controller:'ratingController',
    })
 $urlRouterProvider.otherwise('/query');
});


app.controller('ratingController' , ['$scope' , '$state' , '$http','$rootScope' , function($scope , $state , $http ,$rootScope){
  console.log($state.params);
  function sendData(url , data )
  {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    console.log("seeee -----------------====================---------------------- seeee");
    console.log(url);
    console.log(data);
    url = "http://localhost:1997/"+url;
    $http({
      url:url,
      method:'POST',
      data:data
    }).then(function(res){
        console.log("save succesfull");
    },function(err){
      console.log("save failed");
    });
  }


  var params = $state.params;
  var  credentials={
      vidId:params.vidId,
      uuid:params.uuid,
      timestamp:params.timestamp,
  }

  $scope.ratingsObject = {
       iconOn: 'ion-ios-star',    //Optional
       iconOff: 'ion-ios-star-outline',   //Optional
       iconOnColor: 'rgb(200, 200, 100)',  //Optional
       iconOffColor:  'rgb(200, 100, 100)',    //Optional
       minRating:0,    //Optional
       rating:  0, //Optional
       callback: function(rating, index) {    //Mandatory
         $scope.ratingsCallback(rating, index);
       }
     };
        $scope.ratingsCallback = function(rating, index) {
          console.log('Selected rating is : ', rating, ' and the index is : ', index);
          var data=$.param({
            rating:rating,
            credentials:credentials
          })
          $rootScope.par="babloo";
          sendData("rating" ,data);
        $state.go('query');
      };


}]);



app.controller('queryController', ['$scope' , '$state', function($scope , $state ) {
  console.log("controller working ??");

  $scope.sendQuery=function(event){
      var input = event.target.value;
      console.log(input);
      $state.go('list' ,{query:input});
      document.getElementById("txtholder").value = "";
  };
  $scope.cancelQuery=function(event){
      console.log(event);
      document.getElementById("txtholder").value = "";
  };

}]);



app.controller('listController' , function($scope , $state ){
  var query = $state.params.query;
  var  dataFinal=[];
  var dataMap={};
  var getData = function(query)
  {
    return new Promise(function(res, rej) {
      //if it is loaded ... set the api key
      //promis.then()
      //make sure that the script is loaded if not wait for that shit
       gapi.client.setApiKey('AIzaSyDNd1WaGrmjPyPRm_ArlpDnXRZnKMYnMXI');
       gapi.client.load('youtube' , 'v3').then(makeRequest)
       function makeRequest()
       {
          var req = gapi.client.youtube.search.list({
                 q: query,
                 part: 'snippet',
                 maxResults: 25
          });
          req.execute(function(response){
            res(response);
          });
       };
    });
  }
  getData(query).then(function(data){
    //$scope.listData=[];
    var dataItems=data.result.items;

    setTimeout(function () {
      $scope.$apply(function () {
        $scope.listData=dataItems;
      });
   }, 500);

  });
  $scope.sendtoPlayer=function(event , data){
    console.log(data);
    var id = data.id.videoId;
    $state.go( 'player' , {vidId:id , dataPacket:data});
  }
});


app.constant('YT_event', {
  STOP:            0,
  PLAY:            1,
  PAUSE:           2,
  UNSTARTED:       -1,
  BUFFERING:        3,
  STATUS_CHANGE:   10,
  BUFFER:          11,
  QUALITY_CHANGE:  12,
  TODIRECTIVE:      13,
  STOPBUFFER:       14
});



app.controller('playerController' , function($state , $scope, $window , YT_event , $interval , $http , $rootScope ){
  var viewPortWidth = $window.innerWidth;
  var viewPortHeight=(viewPortWidth)*9/16;
  var bufferstart=0 , playerBufferStart=0;
  var unstarted = 0 , playerUnstarted=0;
  var currentSec , currentBuff;
  var prevState , currentState;
  var credentials;
  var par;
  function callDirective(){
    var message = {
      event: YT_event.TODIRECTIVE,
      data: {
        data:"todirective"
      }
    };
    $scope.$broadcast(message.event, message.data);
  }
    $scope.yt = {
      width: viewPortWidth,
      height: viewPortHeight,
      videoid: $state.params.vidId,
      playerStatus: "NOT PLAYING",
    };
    //register the player and video here
    ionic.Platform.ready(function(){
      console.log("abbacha");
    //  console.log( window.device.uuid );
      credentials={
        uuid:"testitshit",
        vidId:$state.params.vidId,
        timestamp:(new Date).getTime()

      };
      //credentials = JSON.stringify(credentials);
      sendData("register" ,$.param(credentials)) ;
    });

    //console.log( window.device.uuid );
    $scope.YT_event = YT_event;
    $scope.sendControlEvent = function (ctrlEvent) {
      this.$broadcast(ctrlEvent);
    }

    $scope.$on(YT_event.STATUS_CHANGE, function(event, data) {
        console.log("status changed");
        switch (data.state) {
          case "ENDED":
            $scope.$broadcast(YT_event.STOPBUFFER,"data");
            $state.go('rating' , {vidId:credentials.vidId, uuid:credentials.uuid,timestamp:credentials.timestamp});
            break;
          case "UNSTARTED":
            unstarted = data.time;
            playerUnstarted=0;
            callDirective();
            break;
          case "BUFFERING":
             bufferstart=data.time;
             playerBufferStart=data.playertime;
          //  console.log("unstarted");
          //  console.log(bufferstart);
            break;
          case "PLAYING":
            if(unstarted!= 0 && bufferstart!=0)
            {
              var timenow = data.time;
              var time = Math.abs(timenow - unstarted);
              var time1 = Math.abs(timenow-bufferstart);
              var send1 =$.param({
                eventDetail:"LOADINGTIME",
                start:unstarted,
                playertime:playerUnstarted,
                end:timenow,
                diff:time,
                credentials:credentials
              });
              var send2=$.param({
                eventDetail:"BUFFERTIME",
                start:bufferstart,
                playertime:playerBufferStart,
                end:timenow,
                diff:time1,
                credentials:credentials
              })
              sendData("loading" , send1 );
              sendData("rebuff" , send2 ) ;
              unstarted = 0;
              bufferstart=0;
            }
            else if(unstarted!=0)
            {
              var timenow = data.time;
              var time = Math.abs(timenow - unstarted);
              var send =$.param({
                eventDetail:"LOADINGTIME",
                start:unstarted,
                playertime:playerUnstarted,
                end:timenow,
                diff:time,
                credentials:credentials
              })
             sendData("loading" , send);
              unstarted = 0 ;
            }
            else if(bufferstart!=0){
              //buffer time ..with the stop of the player
              var timenow = data.time;
              var time = timenow - bufferstart;
              var send=$.param({
                eventDetail:"BUFFERTIME",
                start:bufferstart,
                playertime:playerBufferStart,
                end:timenow,
                diff:time,
                credentials:credentials
              })
              sendData("rebuff" , send);
            }
              bufferstart=0;
            break;
        }
    });

    $scope.$on(YT_event.QUALITY_CHANGE, function(event, data) {
        console.log(data);
      var send=$.param({
        quality:data.quality,
        timestamp:data.time,
        playertime:data.playertime,
        credentials:credentials
      });
        sendData("quality" , send);
    });


    $scope.$on(YT_event.BUFFER, function(event, data) {
        if(currentSec==undefined)
        {
          currentSec=data.current;
          currentBuff = data.fraction;

          var buffered = data.total * data.fraction;
          var send =$.param({
            timestamp:data.time,
            buffer:buffered,
            playertime:currentSec,
            credentials:credentials
          });
          sendData("buffer" , send);
        }
        else {
          if(currentSec != data.current && currentBuff!=data.fraction)
            {
              var buffered = data.total * data.fraction;
              var send =$.param({
                timestamp:data.time,
                buffer:buffered,
                playertime:data.current,
                credentials:credentials
              })
              sendData("buffer" , send);
              currentSec = data.current;
              currentBuff = data.fraction;
          }
        }
    });

    function sendData(url , data )
    {
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      console.log("seeee -----------------====================---------------------- seeee");
      console.log(url);
      console.log(data);
      url = "http://localhost:1997/"+url;
      $http({
        url:url,
        method:'POST',
        data:data
      }).then(function(res){
          console.log("save succesfull");
      },function(err){
        console.log("save failed");
      });
    }
});

app.directive('youtube', function($window, YT_event , $interval , $rootScope) {
  return {
    restrict: "E",
    scope: {
      height: "@",
      width: "@",
      videoid: "@"
    },
    template: '<div></div>',
    link: function( scope, element, attrs, $interval) {
      console.log("---------------have a look ------------------");
      console.log(scope);
      var interval=null;
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      if(scope.$root.par === "babloo")
      {
          console.log("sucess second attempt");
          onYoutubePlayer();
      }
      var onYoutubePlayer = function(){
        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "red",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 2
          },
          height: scope.height,
          width: scope.width,
          videoId: scope.videoid,
          events: {
            'onStateChange': function(event) {
              var milliseconds = (new Date).getTime();
              var CurrentTime=player.getCurrentTime();

              var message = {
                event: YT_event.STATUS_CHANGE,
                data: {
                  state:"",
                  time:milliseconds,
                  playertime:CurrentTime
                }
              };
              console.log("-------====================------");
              console.log(event.data);
              switch(event.data) {
                case YT.PlayerState.BUFFERING:
                  message.data.state="BUFFERING";
                  break;
                case YT.PlayerState.PLAYING:
                  message.data.state = "PLAYING";
                  break;
                case YT.PlayerState.ENDED:
                  message.data.state = "ENDED";
                  break;
                case YT.PlayerState.PAUSED:
                  message.data.state = "PAUSED";
                  break;
                case YT.PlayerState.UNSTARTED:
                  message.data.state ="UNSTARTED";
                  player.setPlaybackQuality('highres');
                  break;
              }
              scope.$apply(function() {
                scope.$emit(message.event, message.data);
              });
            },
            'onPlaybackQualityChange': function(event) {
              var milliseconds = (new Date).getTime();
              var CurrentTime=player.getCurrentTime();
              var message = {
                event: YT_event.QUALITY_CHANGE,
                data: {
                  quality:"",
                  time:milliseconds,
                  playertime:CurrentTime
                }
              };

              console.log("have look on the data ");
              console.log(event.data);
              switch(event.data) {

                case "tiny":
                  message.data.quality = "144p";
                  break;
                case "small":
                  message.data.quality="240p";
                  break;
                case "medium":
                  message.data.quality = "360p";
                  break;
                case "large":
                  message.data.quality ="480p";
                  break;
                case "hd720":
                  message.data.quality="720p";
                  break;
                case "hd1080":
                  message.data.quality="1080p";
                  break;
                case "hd1440":
                  message.data.quality="1440p";
                  break;
                case "hd2180":
                  message.data.quality="2180p";
                  break;

              }
             scope.$apply(function() {
                scope.$emit(message.event, message.data);
              });
            }
          }
        });
      }
      $window.onYouTubeIframeAPIReady=function(){
        onYoutubePlayer();
      };
      scope.$watch('height + width', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }
        player.setSize(scope.width, scope.height);

      });
      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }
        player.cueVideoById(scope.videoid);
      });


      scope.$on(YT_event.TODIRECTIVE, function(eve, data) {
        interval=setInterval(function () {
          var datahere = {
            event: YT_event.BUFFER,
            data: ""
          };
          var milliseconds = (new Date).getTime();
          var fraction = player.getVideoLoadedFraction();
          var CurrentTime=player.getCurrentTime();
          var totalTime=player.getDuration();
          //var totalBytes=player.getVideoBytesTotal();
          datahere.data={
            "time":milliseconds,
            "fraction":fraction,
            "current":CurrentTime,
            "total":totalTime
          }
          scope.$apply(function() {
             scope.$emit(datahere.event, datahere.data);
           });
        }, 1000);
      });
      scope.$on(YT_event.STOPBUFFER, function(eve, data) {
          clearInterval(interval);
        });

      var callmeforchangeinquality=function()
      {
        //var qualArray  = player.getAvailableQualityLevels();
        //debugger;
      }
    }
  };
});

app.run(function($ionicPlatform , $rootScope ) {
  console.log($rootScope);
  console.log("chudu chudu");
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


//app.factory('dataService' , ['$q' , 'Loki' ,dataService]);


/*
function dataService($q , Loki){
  var _db;
  var _dataInfo;
  function initDB() {
    var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});
      _db = new Loki('dataDB',
      {
          autosave: true,
          autosaveInterval: 1000, // 1 second
          adapter: adapter
      });
    };
  function getcompleteData(){
    return new Promise(function(resolve, reject) {
      var options = {};
      _db.loadDatabase(options, function () {
          _dataInfo = _db.getCollection('data');

          if (!_birthdays) {
              _dataInfo = _db.addCollection('data');
          }
          resolve(_dataInfo.data);
        });
      });


    }
    function addData(data){
         _dataInfo.insert(data);
     }
     function updateNote(data){
         _dataInfo.update(data);
     }
     function deleteNote(data){
         _dataInfo.remove(data);
     }
    return {
            initDB: initDB,
            getcompleteData: getcompleteData,
            addData: addData,
            updateData: updateData,
            deleteData: deleteData
    };
}
*/
