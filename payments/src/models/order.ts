import { OrderStatus } from "@fayisorg/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
    id: string;
    userId: string;
    price: number;
    status: OrderStatus
    version: number;
}

interface OrderDoc extends mongoose.Document {
    id: string;
    userId: string;
    price: number;
    status: OrderStatus;
    version: number,
}

interface OrderModal extends mongoose.Model<OrderDoc> {
    build(attr:OrderAttr):OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
         type: Number,
         required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
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

orderSchema.statics.build = (attr:OrderAttr) => {
    return new Order({
        _id: attr.id,
        version: attr.version,
        status: attr.status,
        userId: attr.userId,
        price: attr.price
    })
}

const Order = mongoose.model<OrderDoc,OrderModal>('Order',orderSchema);
export { Order }