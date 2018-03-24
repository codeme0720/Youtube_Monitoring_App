var modals=require('./data.js');
var fs = require('fs');

module.exports =function(app){
  app.get('/', function(req, res){
      modals.Data.find({} , function(err , data){
        var length = data.length;
        for(var i = 0 ; i < length ; i++)
        {
          var datanow = data[i];
          var timestamp =datanow.time;
          var stringData="";
          console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
          console.log(datanow.vidId);
          stringData = stringData+" "+datanow.vidId+"\n"
          console.log(datanow.time+"\n\n");
          stringData = stringData+" "+datanow.time+"\n\n"

          var loadtime = datanow.loadtime;
          if(loadtime != undefined)
          {
            var ld = parseInt(loadtime.rebuffTime);
            ld = ld * (0.001);
            console.log("loadtime : " + ld.toFixed(3));
            stringData=stringData+"loadtime : "+ld.toFixed(3)+"\n";
          }
          //console.log(" initial loading time : " + loadtime.rebuffTime);
          var rebuff = datanow.rebufferDetails
          if(rebuff!=undefined)
          {
            var num_buffer = datanow.rebufferDetails.length
            console.log("<--------------------------------num of buffer : " +(num_buffer-1)+"-------------------------->");
            stringData=stringData+"<--------------------------------num of buffer : " +(num_buffer-1)+"-------------------------->\n";

            var sum=0;
            for(var j = 1 ; j < num_buffer ; j++)
            {
                var minibuff=rebuff[j];
                var st = parseInt(minibuff.playerTime);
                var ti = parseInt(minibuff.rebuffTime);
                ti  = ti*(0.001);
                ti = ti.toFixed(3);
                sum = parseInt(sum)+ parseInt(i);
                console.log(st.toFixed(3)+" s  :  "+ti+" s");
                stringData=stringData+st.toFixed(3)+" s  :  "+ti+" s"+"\n"
            }
          }
          var quality = datanow.qualityDetails;
          if(quality!=undefined)
          {
            var num_qual = datanow.qualityDetails.length
            console.log("<---------------------------num of quality changes : " +num_qual +"-------------------->");
            stringData = stringData+"<---------------------------num of quality changes : " +num_qual +"-------------------->\n";
            var sum=0;
            for(var j = 0 ; j < num_qual ; j++)
            {
              var miniqual=quality[j];
              var st = parseInt(miniqual.playerTime);
              var quali =miniqual.quality;
              console.log(st.toFixed(3)+" s  :  "+quali);
              stringData =stringData+st.toFixed(3)+" s  :  "+quali+"\n";
            }
          }
          var buffarray = datanow.bufferDetails;
          if(buffarray!=undefined)
          {
          //  console.log(datanow.bufferDetails);
            var num_buff =buffarray.length
            console.log("<--------------------------- buff watch ------------------>");
            stringData = stringData + "<--------------------------- buff watch ------------------>";
            var sum=0;
            for(var j = 0 ; j < num_buff ; j++)
            {
              /*time:String,
              playerTime:Number,
              buffContent:String*/
              var minibuffer=buffarray[j];
              var st = parseInt(minibuffer.playerTime);
              var ti = parseInt(minibuffer.buffContent);
              ti  = ti*(0.001);
              ti = ti.toFixed(3);
              //sum = parseInt(sum)+ parseInt(i);
                console.log(st.toFixed(3)+" s  :  "+ti+" s");
              stringData = stringData+st.toFixed(3)+" s  :  "+ti+" s"+"\n";
            }
          }

          console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
          stringData = stringData + "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-";
          console.log(stringData);
          fs.writeFile('data/'+i+'.txt',stringData, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
          });
        }
      });
  });
  app.post('/register' , function(req , res){
    console.log("--------------------")
    var data = req.body;
    var user = new modals.Data();
    user.time = data.timestamp;
    user.vidId =data.vidId ;
    user.uuid = data.uuid;
    user.save(function(err){
      if(err)
      {
        console.log("erro saving the /register");
      }
      else{
        console.log("successfully registered");
      }
    })
    res.send("data");
  });


  app.post('/quality' , function(req , res){
    console.log("-------============---------");
    console.log(req.body);
    var dataRecv=req.body;
    console.log("-=-=-==-=-=-==-");

    var time = dataRecv['credentials[timestamp]'];
    var vidId =dataRecv['credentials[vidId]'];
    var uuid = dataRecv['credentials[uuid]'];

    modals.Data.findOne({'time':time,'vidId':vidId , 'uuid':uuid}, function(err , dataHere){
      if(err)
      {
        console.log("cangt find anyone with the given credentials")
      }
      else{
        console.log("found wshit ??");
        console.log(dataHere);
        var quality = new modals.Quality();
        quality.timestamp=dataRecv.timestamp;
        quality.playerTime=dataRecv.playertime;
        quality.quality=dataRecv.quality;
        dataHere.qualityDetails.push(quality);
        dataHere.save(function(err) {
          if(err)
          {
            console.log(err);
            console.log("issue in saving the quality");
          }
          else{
            console.log("quality saved succesfully");
          }
        });

      }
    });
    res.send("data");
  });


  app.post('/rebuff' , function(req , res){
    var dataRecv=req.body;
    var time = dataRecv['credentials[timestamp]'];
    var vidId =dataRecv['credentials[vidId]'];
    var uuid = dataRecv['credentials[uuid]'];
    modals.Data.findOne({'time':time,'vidId':vidId , 'uuid':uuid}, function(err , dataHere){
      if(err)
      {
        console.log("cangt find anyone with the given credentials")
      }
      else{


        var rebufferTime = new modals.Rebuffer();
        rebufferTime.playerTime =dataRecv.playertime;
        rebufferTime.rebuffTime = dataRecv.diff;
        rebufferTime.startTime = dataRecv.start;
        rebufferTime.endTime = dataRecv.end;
        dataHere.rebufferDetails.push(rebufferTime);
        dataHere.save(function (err) {
            if(err)
            {
                console.log(err);
            }
            else{
              console.log("buffer time saved succesfully");
            }
        });
      }
    });
  });

  app.post('/loading' , function(req , res){
    console.log(req.body);
    var dataRecv=req.body;
    console.log("-=-=-==-=-=-==-");

    var time = dataRecv['credentials[timestamp]'];
    var vidId =dataRecv['credentials[vidId]'];
    var uuid = dataRecv['credentials[uuid]'];
    modals.Data.findOne({'time':time,'vidId':vidId , 'uuid':uuid}, function(err , dataHere){
      if(err)
      {
        console.log("cangt find anyone with the given credentials")
      }
      else{
        var loadtime = new modals.Loadtime();
        loadtime.playerTime =dataRecv.playertime;
        loadtime.rebuffTime = dataRecv.diff;
        loadtime.startTime = dataRecv.start;
        loadtime.endTime = dataRecv.end;

        dataHere.loadtime=loadtime;
        dataHere.save(function (err) {
            if(err)
            {
                console.log(err);
            }
            else{
              console.log("load time saved succesfully");
            }
        });
      }
    });
    res.send("data");
  });
  app.post('/player' , function(req , res){
    res.send("data");
  });
  app.post('/rating' , function(req , res){
    var dataRecv =req.body ;
    var time = dataRecv['credentials[timestamp]'];
    var vidId =dataRecv['credentials[vidId]'];
    var uuid = dataRecv['credentials[uuid]'];
   modals.Data.findOne({'time':time,'vidId':vidId , 'uuid':uuid}, function(err , dataHere){
      if(err)
      {
        console.log("cangt find anyone with the given credentials")
      }
      else{
        //playertime:data.current,
        dataHere.rating=dataRecv.rating;
        dataHere.save(function (err) {
            if(err)
            {
                console.log(err);
            }
            else{
              console.log("buffer time saved succesfully");
            }
        });
      }
    });
    res.send("data");
  });

  app.post('/buffer' , function(req , res){
    console.log(req.body);
    var dataRecv=req.body;
    var time = dataRecv['credentials[timestamp]'];
    var vidId =dataRecv['credentials[vidId]'];
    var uuid = dataRecv['credentials[uuid]'];
    modals.Data.findOne({'time':time,'vidId':vidId , 'uuid':uuid}, function(err , dataHere){
      if(err)
      {
        console.log("cangt find anyone with the given credentials")
      }
      else{
        //playertime:data.current,
        var bufferTime = new modals.Buffer();
        bufferTime.time =dataRecv.timestamp;
        bufferTime.playerTime = dataRecv.playertime;
        bufferTime.buffContent = dataRecv.buffer;
        dataHere.bufferDetails.push(bufferTime);
        dataHere.save(function (err) {
            if(err)
            {
                console.log(err);
            }
            else{
              console.log("buffer time saved succesfully");
            }
        });
      }
    });
    res.send("data");
  });
}
