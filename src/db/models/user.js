import {model, Schema} from 'mongoose';
import { ROLES } from '../../constants';

const userSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {
            type: String,
             enum: [ROLES.ADMIN, ROLES.USER],
             default: ROLES.USER
            },

    },
    {
        timestamps: true, versionKey: false
    }
);
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const User = model('users', userSchema);
