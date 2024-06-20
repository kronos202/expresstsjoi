import { Schema } from 'mongoose';
import slugify from 'slugify';

// Interface cho các tài nguyên có trường title và slug
interface TitleAndSlug {
    title: string;
    slug: string;
}

// Plugin để tự động tạo và quản lý trường slug dựa trên title
function slugPlugin(schema: Schema<TitleAndSlug>) {
    schema.add({
        slug: { type: String, unique: true, required: true }
    });

    // Pre-save hook để tạo slug từ title trước khi lưu vào cơ sở dữ liệu
    schema.pre('save', function (this: any, next) {
        if (!this.isModified('title')) {
            return next();
        }

        // Tạo slug từ title sử dụng thư viện slugify
        this.slug = slugify(this.title, { lower: true });
        next();
    });
}

export { TitleAndSlug, slugPlugin };
