import { Schema } from 'mongoose';

interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}
function timestampsPlugin(schema: Schema<Timestamps>) {
    schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });

    schema.pre('save', function (this: any, next) {
        this.updatedAt = new Date();
        next();
    });
}

export { Timestamps, timestampsPlugin };
