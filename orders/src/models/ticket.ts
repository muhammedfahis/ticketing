import mongoose, { version } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";
import { OrderStatus } from "@fayisorg/common";


interface TicketAttr {
    title:string;
    price:number;
    id:string;
}

interface TicketDoc extends mongoose.Document {
    title:string;
    price:number;
    updatedAt:string;
    createdAt:string;
    version:number;
    isReserved():Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attr:TicketAttr):TicketDoc
    findByEvent(event:{ id: string, version: number}):Promise<TicketDoc | null>
}



const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
},{
    toJSON:{
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attr:TicketAttr) => {
    return new Ticket({
        _id: attr.id,
        title: attr.title,
        price: attr.price
    });
}
ticketSchema.statics.findByEvent = (event:{id: string, version: number}) => {    
    return Ticket.findOne({ _id: event.id , version: event.version - 1 });
}

ticketSchema.methods.isReserved = async function() {
    const ticket = this;
    return true &&  await Order.findOne({ ticket , status:{
        $in:[
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete
        ]
    }})
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export { Ticket, TicketDoc };