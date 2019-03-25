let mongoose = require('mongoose');

// list item schema 
let listitem_schema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
});
let list_item = module.exports= mongoose.model('list_item',listitem_schema);