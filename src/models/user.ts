import mongoose, { Query, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    photo?: string;
    role: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passswordResetExpires?: Date;
    active: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'fullname is required']
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password should be greater than 6 character'],
        select: false
    },

    photo: {
        type: String,
        default: 'https://res.cloudinary.com/queentech/image/upload/v1690010294/78695default-profile-picture1_dhkeeb.jpg'
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passswordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    // if password has not been modified
    if (!this.isModified('password')) return next();

    // hashing of password
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordChangedAt') || this.isNew) return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.pre<Query<any, IUser>>(/^find/, function (next) {
    this.find({ active: true });

    next();
});

// instance method to generateResetToken
userSchema.methods = {
    isCorrectPassword: async function (userPassword: string, dbPassword: string) {
        return await bcrypt.compare(userPassword, dbPassword);
    },
    generateResetToken: async function () {
        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedResetToken = crypto.createHash('SHA-256').update(resetToken).digest('hex');

        this.passwordResetToken = hashedResetToken;
        this.passswordResetExpires = Date.now() + 10 * 60 * 1000;

        return resetToken;
    },
    changedPasswordAfter: async function (jwtTimeSpan: number) {
        if (this.passwordChangedAt) {
            const changedTime = this.passwordChangedAt.getTime() / 1000;
            return jwtTimeSpan < changedTime;
        }
        return false;
    }
};

// instance method to check if password was change before the token issued
userSchema.methods.changedPasswordAfter = function (jwtTimeSpan: number) {
    if (this.passwordChangedAt) {
        const changedTime = parseInt(this.passwordChangedAt);
        return jwtTimeSpan < changedTime;
    }
    return false;
};
