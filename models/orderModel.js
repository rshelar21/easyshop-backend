const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    paymentType : {
        type : String,
        default : 'card',
    },
    paymentStatus : {
        type : String,
        default : 'paid',
    },
    products : [
        {
            type : Object,
        }
    ],

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true,
})

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
