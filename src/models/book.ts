import mongoose, { Model, Query, Schema } from 'mongoose';

interface IBook extends Document {
    title: string;
    author: string;
    page: number;
}

const bookSchema: Schema<IBook> = new Schema(
    {
        title: { type: String, required: true, unique: true },
        author: { type: String, required: true },
        page: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

bookSchema.index({ title: 'text', author: 'text' });

export const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);
