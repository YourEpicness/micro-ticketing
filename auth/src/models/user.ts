import mongoose from 'mongoose';
import {Password} from '../services/password'

// An interface that describes the properties required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties that a user Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // extra properties go here
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

}, );

userSchema.set('toJSON', {
    transform(doc:any, ret:any) {
        // remap the _id to id
        ret.id = ret._id;
        delete ret._id;

        // remove password from returned JSON
        delete ret.password; 
        delete ret.__v;
    }
})

// mongoose: before saving to database, do something
userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

// custom built in model for statics
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}


// creates out user and User object
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

const user = User.build({
    email: 'test@test.com',
    password: 'asfasf'
})


export { User };