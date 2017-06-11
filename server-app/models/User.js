require('dotenv').load();
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@ds121171.mlab.com:21171/mladenlosandbox');
var Schema = mongoose.Schema;

var PollUser = new Schema({
  username: { type: String, required: true },
  email : { type : String, required: true, unique: true },
  password : { type : String, required: true },
  polls : [{
      pollID : Schema.Types.ObjectId,
      voteIP : [{
        _id : false,
        userIp : { type : String }
      }],
      title : { type : String, required: true },
      options : [{
          _id:false,
          optionName : { type: String, required: true },
          optionVote : { type: Number, default : 0 }
      }]
  }]
});

module.exports = mongoose.model('PollUser', PollUser);