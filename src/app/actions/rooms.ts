//el usuario toca crear un room
//el room a traves de un cliente se crea con un random id y se agrega a la lista de rooms del user
"use server"
import {ResponseType } from "@/types/response.types";
import { isError, isFailed } from "../lib/utils/utils";
import { Room } from "@/types/rooms.types";
import { v4 } from "uuid";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";
export const addRoom = async(userId:string)=>{
    const roomId = v4()
    try {
        const postRoomFetch = await fetch("http://localhost:3000/api/rooms",{
            method:"POST",
            body:JSON.stringify({userId, roomId}),
            headers:{
                "Content-Type": "application/json"
            }
        });
        const toJson:ResponseType  = await postRoomFetch.json()
        if(isFailed(toJson)) throw new Error(toJson.error);
        revalidatePath('/home/rooms')
    } catch (error) {
        isError(error)
    }
};
export const getMyRooms = async(userId:string)=>{
    try {
        const roomsFetch = await fetch(`http://localhost:3000/api/rooms?userId=${userId}`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const toJson:ResponseType  = await roomsFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return toJson.payload as Room[]
    } catch (error) {
        return isError(error)
    }
};

export const getRoomById = async(roomId:string)=>{
    try {
        const roomsFetch = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const toJson:ResponseType  = await roomsFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return (toJson.payload as Room[])[0]
    } catch (error) {
        isError(error)
    }
}

export const getAllUsers = async()=>{
    try {
        const usersFetch = await fetch('http://localhost:3000/api/sessions');
        const toJson:ResponseType = await usersFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        const userArray= toJson.payload as Session['user'][];
        return userArray
    } catch (error) {
        isError(error)
    }
};

export const inviteUsers = async(users:Session['user'][], roomId:string, currentUser:Liveblocks['UserMeta'])=>{
    console.log(users, currentUser)
    try {
        const roomUpdateFetch = await fetch(`http://localhost:3000/api/rooms/invitations/${roomId}`, {
            method:'PUT',
            body:JSON.stringify({usersPermissions:users, currentUser})
        })
        const toJson:ResponseType = await roomUpdateFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
    } catch (error) {
        isError(error)
    }
};

export const getInvitationRooms = async(id:string)=>{
    try {
        const getUserInvitationsFetch = await fetch(`http://localhost:3000/api/rooms/invitations/${id}`);
        const toJson:ResponseType = await getUserInvitationsFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return toJson.payload as Room[]
    } catch (error) {
        isError(error)
    }
}