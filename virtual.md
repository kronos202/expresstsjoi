## Virtual

### Tạo URL tùy chỉnh

Bạn có thể sử dụng virtuals để tạo URL tùy chỉnh dựa trên các trường hiện có trong tài liệu. Ví dụ, bạn có một mô hình Product và muốn tạo một URL
SEO-friendly cho mỗi sản phẩm dựa trên tên sản phẩm.

```
import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    url: string; // Đây là trường ảo
}

const productSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Định nghĩa virtual
productSchema.virtual('url').get(function (this: IProduct) {
    return `/products/${this._id}/${this.name.replace(/\s+/g, '-').toLowerCase()}`;
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
```

### Tính toán thuộc tính phức tạp

Nếu bạn cần tính toán thuộc tính phức tạp dựa trên nhiều trường khác nhau, virtuals là cách tuyệt vời để làm điều đó mà không làm phức tạp dữ liệu cơ
sở.

```
import mongoose, { Schema, Document } from 'mongoose';

interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    salary: number;
    bonus: number;
    totalCompensation: number; // Đây là trường ảo
}

const employeeSchema: Schema<IEmployee> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        salary: { type: Number, required: true },
        bonus: { type: Number, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Định nghĩa virtual để tính toán tổng bồi thường
employeeSchema.virtual('totalCompensation').get(function (this: IEmployee) {
    return this.salary + this.bonus;
});

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
```

### Chuyển đổi dữ liệu

Nếu bạn cần chuyển đổi hoặc định dạng lại dữ liệu trước khi gửi về phía client, virtuals là công cụ hữu ích.

```
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    dateOfBirth: Date;
    age: number; // Đây là trường ảo
}

const userSchema: Schema<IUser> = new Schema(
    {
        dateOfBirth: { type: Date, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Định nghĩa virtual để tính toán tuổi
userSchema.virtual('age').get(function (this: IUser) {
    const ageDifMs = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
```

### Định dạng ngày tháng

Nếu bạn có các trường ngày tháng trong tài liệu và muốn định dạng lại chúng theo định dạng cụ thể trước khi hiển thị cho người dùng, bạn có thể sử
dụng virtuals.

```
import mongoose, { Schema, Document } from 'mongoose';
import moment from 'moment';

interface IEvent extends Document {
    startDate: Date;
    endDate: Date;
    formattedStartDate: string; // Đây là trường ảo
    formattedEndDate: string; // Đây là trường ảo
}

const eventSchema: Schema<IEvent> = new Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Định nghĩa virtual để định dạng lại ngày tháng
eventSchema.virtual('formattedStartDate').get(function (this: IEvent) {
    return moment(this.startDate).format('YYYY-MM-DD');
});

eventSchema.virtual('formattedEndDate').get(function (this: IEvent) {
    return moment(this.endDate).format('YYYY-MM-DD');
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;

```

### Tính toán thời gian chênh lệch

Nếu bạn cần tính toán khoảng thời gian giữa hai ngày tháng, bạn có thể sử dụng virtuals để tính toán và hiển thị khoảng thời gian đó mà không cần lưu
trữ dữ liệu thêm.

```
import mongoose, { Schema, Document } from 'mongoose';
import moment from 'moment';

interface ITask extends Document {
    startDate: Date;
    endDate: Date;
    duration: number; // Đây là trường ảo, tính bằng giờ
}

const taskSchema: Schema<ITask> = new Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Định nghĩa virtual để tính toán thời gian chênh lệch
taskSchema.virtual('duration').get(function (this: ITask) {
    const start = moment(this.startDate);
    const end = moment(this.endDate);
    return end.diff(start, 'hours'); // Tính số giờ chênh lệch
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;

```
