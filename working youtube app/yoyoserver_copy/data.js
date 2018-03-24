var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/yoyostyle');
var qualitySchema = mongoose.Schema({
  timestamp:String,
  playerTime:Number,
  quality:String
});
var playerSchema = mongoose.Schema({
  time:String,
  playerTime:Number,
  value:String
});
var bufferSchema=mongoose.Schema({
  time:String,
  playerTime:Number,
  buffContent:String
});
var rebuffSchema=mongoose.Schema({
  playerTime:String,
  rebuffTime:String,
  startTime:String,
  endTime:String
})
var loadtimeSchema=mongoose.Schema({
  playerTime:String,
  rebuffTime:String,
  startTime:String,
  endTime:String
})

var DataSchema = mongoose.Schema({
  time:String,
  vidId:String,
  uuid:String,
  rating:Number,
  loadtime:loadtimeSchema,
  playerDetails:[qualitySchema],
  bufferDetails:[bufferSchema],
  rebufferDetails:[rebuffSchema],
  qualityDetails:[qualitySchema],
});

var data = mongoose.model('Data', DataSchema);
var quality = mongoose.model('Quality', qualitySchema);
var rebuffer = mongoose.model('Rebuffer', rebuffSchema);
var buffer = mongoose.model('Buffer', bufferSchema);
var quality = mongoose.model('Quality', qualitySchema);
var loadtime = mongoose.model('Loadtime' , loadtimeSchema);
module.exports={
  Data:data,
  Quality:quality,
  Rebuffer:rebuffer,
  Buffer:buffer,
  Quality:quality,
  Loadtime:loadtime
};
