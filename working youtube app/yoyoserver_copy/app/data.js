var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/yoyostyle');
var strengthSchema = mongoose.Schema({
  timestamp:String,
  playerTime:Number,
  strength:Number
});
var typeSchema = mongoose.Schema({
  timestamp:String,
  playerTime:Number,
  type:String
});

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
  quality:String,
  time:String,
  playerTime:Number,
  buffContent:String
});
var rebuffSchema=mongoose.Schema({
  quality : String,
  playerTime:String,
  rebuffTime:String,
  startTime:String,
  endTime:String
})
var loadtimeSchema=mongoose.Schema({
  quality:String,
  playerTime:String,
  rebuffTime:String,
  startTime:String,
  endTime:String
})

var DataSchema = mongoose.Schema({
  time:String,
  vidId:String,
  uuid:String,
  title:String,
  channelTitle:String,
  url:String,
  rating:Number,
  loadtime:loadtimeSchema,
  playerDetails:[qualitySchema],
  bufferDetails:[bufferSchema],
  rebufferDetails:[rebuffSchema],
  qualityDetails:[qualitySchema],
  strengthDetails:[strengthSchema],
  typeDetails:[typeSchema]
});

var data = mongoose.model('Data', DataSchema);
var quality = mongoose.model('Quality', qualitySchema);
var rebuffer = mongoose.model('Rebuffer', rebuffSchema);
var buffer = mongoose.model('Buffer', bufferSchema);
var quality = mongoose.model('Quality', qualitySchema);
var loadtime = mongoose.model('Loadtime' , loadtimeSchema);
var strength = mongoose.model('Strength', strengthSchema);
var type = mongoose.model('Type', typeSchema);

module.exports={
  Data:data,
  Quality:quality,
  Rebuffer:rebuffer,
  Buffer:buffer,
  Quality:quality,
  Loadtime:loadtime,
  Strength:strength,
  Type:type
};
