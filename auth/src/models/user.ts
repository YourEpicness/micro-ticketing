import mongoose from 'mongoose';

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

})
// custom built in model for statics
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}



const User = mongoose.model<any,UserModel>('User', userSchema);

const user = User.build({
    email: 'test@test.com',
    password: 'asfasf'
})


export { User };