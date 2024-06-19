const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
        required : true,
    },
    orders : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Order'
        }
    ]
},
{
    timestamps : true,
});


const userModel = mongoose.model('User', userScheme);

module.exports = userModel;