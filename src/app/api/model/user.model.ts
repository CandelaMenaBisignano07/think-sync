import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    image:String || null,
    name: String || null,
    email: {type: String, required:true},
    provider: {required:true, type:String}
});

export const userModel = mongoose.models.users || mongoose.model( usersCollection, userSchema)