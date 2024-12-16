import mongoose from 'mongoose';

const roomsCollection = 'rooms';

const roomSchema = new mongoose.Schema({
    roomId:{type:String, unique:true, required:true},
    created_at:String,
    userId:{type:String, required:true},
    invitedUsers:[{type:String}]
});

export const roomModel = mongoose.models.rooms || mongoose.model(roomsCollection, roomSchema)