### 1.Tạo Interface cho các phương thức tĩnh (Static Methods) và phương thức Instance (Instance Methods) Nếu bạn cần thêm các phương thức tùy chỉnh cho model của mình, bạn có thể định nghĩa chúng trong interface.

```
import mongoose, { Schema, Document, Model } from 'mongoose';

// Định nghĩa interface cho sách interface IBook extends Document { title: string; author: string; // Phương thức instance findSimilarBooks: () =>
Promise<IBook[]>; }

// Định nghĩa interface cho model sách với phương thức tĩnh interface IBookModel extends Model<IBook> { findByAuthor: (author: string) =>
Promise<IBook[]>; }

// Tạo Schema cho sách với generics const bookSchema: Schema<IBook> = new Schema( { title: { type: String, required: true, unique: true }, author: {
type: String, required: true } }, { timestamps: true } );

// Phương thức instance bookSchema.methods.findSimilarBooks = function (): Promise<IBook[]> { return mongoose.model<IBook>('Book').find({ author:
this.author }).exec(); };

// Phương thức tĩnh bookSchema.statics.findByAuthor = function (author: string): Promise<IBook[]> { return this.find({ author }).exec(); };

// Tạo Model từ Schema và Interface const Book: IBookModel = mongoose.model<IBook, IBookModel>('Book', bookSchema);

export default Book;
```

#### 2. Sử dụng Lean Queries cho hiệu suất cao Khi bạn chỉ cần dữ liệu mà không cần tất cả các chức năng của Mongoose Document, sử dụng lean() sẽ tăng hiệu suất.

```
const books = await Book.find().lean().exec();
```

#### 3. Sử dụng Middleware cho các hoạt động trước và sau khi lưu (pre-save, post-save) Bạn có thể sử dụng middleware để thực hiện các hành động trước hoặc sau khi một tài liệu được lưu hoặc cập nhật.

```
bookSchema.pre<IBook>('save', function (next) { // Thực hiện hành động trước khi lưu console.log(`Saving book: ${this.title}`);
next(); });
```

### 4. Sử dụng Plugins để tái sử dụng logic Nếu bạn có logic tái sử dụng giữa các schema khác nhau, bạn có thể sử dụng plugins.

```
import { Schema } from 'mongoose';

const timestampPlugin = (schema: Schema) => { schema.add({ createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
}); schema.pre('save', function (next) { this.updatedAt = Date.now(); next(); }); };

bookSchema.plugin(timestampPlugin);
```

#### 5. Tạo các Interface cho các truy vấn tùy chỉnh Nếu bạn có các truy vấn phức tạp, bạn có thể định nghĩa chúng trong một interface để đảm bảo TypeScript kiểm tra kiểu.

```
interface BookQueryHelpers { byTitle(title: string): Query<any, IBook> & BookQueryHelpers; }

const bookSchema: Schema<IBook, Model<IBook>, {}, BookQueryHelpers> = new Schema( { title: { type: String, required: true, unique: true }, author: {
type: String, required: true } }, { timestamps: true } );

bookSchema.query.byTitle = function (title: string) { return this.find({ title: new RegExp(title, 'i') }); };

// Sử dụng truy vấn tùy chỉnh const books = await Book.find().byTitle('some title').exec();
```

#### 6. Sử dụng TypeScript type hoặc interface cho các thao tác phổ biến Để giảm thiểu lỗi và tăng cường khả năng tái sử dụng, bạn có thể định nghĩa các kiểu cho các thao tác phổ biến.

```
type CreateBookInput = { title: string; author: string; };

const createBook = async (input: CreateBookInput): Promise<IBook> => { const book = new Book(input); await book.save(); return book; };
```

#### 8

```
import mongoose, { Schema, Document, Model } from 'mongoose';

// Định nghĩa interface cho sách
interface IBook extends Document {
    title: string;
    author: string;
}

// Tạo Schema cho sách với generics
const bookSchema: Schema<IBook> = new Schema(
    {
        title: { type: String, required: true, unique: true },
        author: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

// Tạo Model từ Schema và Interface
const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);

export default Book;

```

#### 9. Enum

```
enum BookStatus {
    AVAILABLE = 'available',
    CHECKED_OUT = 'checked_out',
    LOST = 'lost'
}

interface IBook extends Document {
    title: string;
    author: string;
    status: BookStatus;
}

const bookSchema: Schema<IBook> = new Schema(
    {
        title: { type: String, required: true, unique: true },
        author: { type: String, required: true },
        status: { type: String, enum: Object.values(BookStatus), default: BookStatus.AVAILABLE }
    },
    {
        timestamps: true
    }
);

const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);

export default Book;

```
