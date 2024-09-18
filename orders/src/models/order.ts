import mongoose from "mongoose";
import { OrderStatus } from '@fayisorg/common';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDoc } from './ticket';


interface orderAttr {
    userId:string;
    ticket:TicketDoc;
    status:OrderStatus;
    expiresAt:Date
}
interface orderDoc extends mongoose.Document {
    userId:string;
    ticket:TicketDoc;
    status:OrderStatus;
    expiresAt:string,
    createdAt:string;
    updatedAt:string;
    version: number;
}
interface orderModel extends mongoose.Model<orderDoc> {
    build(attr:orderAttr):orderDoc
}


const orderSchema = new mongoose.Schema({
    userId: {
        required:true,
        type:String
    },
    ticket: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    },
    status:{
        required:true,
        type:String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt:{
        type: mongoose.Schema.Types.Date
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = function(attr:orderAttr) {
    return new Order(attr)
}

const Order = mongoose.model<orderDoc,orderModel>('Order',orderSchema);
export { Order }; 