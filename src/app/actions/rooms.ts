//el usuario toca crear un room
//el room a traves de un cliente se crea con un random id y se agrega a la lista de rooms del user
"use server"
import {Payloads, ResponseType } from "@/types/response.types";
import { isError, isFailed } from "../lib/utils/utils";
import { Room } from "@/types/rooms.types";
import { v4 } from "uuid";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";
import { RoomData } from "@liveblocks/node";


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

export const deleteRoom = async(roomId:string)=>{
    try {
        const deleteRoomFetch = await fetch(`http://localhost:3000/api/rooms/${roomId}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json"
            }
        });
        const toJson:ResponseType =  await deleteRoomFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        revalidatePath('/home/rooms');
    } catch (error) {
        isError(error);
    }
}

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

export const inviteUsers = async(usersPermissions:Session['user'][], roomId:string, currentUser:Liveblocks['UserMeta'])=>{
    try {
        const roomUpdateFetch = await fetch(`http://localhost:3000/api/rooms/invitations/${roomId}`, {
            method:'PUT',
            body:JSON.stringify({usersPermissions, currentUser})
        })
        const toJson:ResponseType = await roomUpdateFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return toJson.payload as RoomData;
    } catch (error) {
        isError(error)
    }
};

export const getUserInvitationRooms = async(id:string)=>{
    try {
        const getUserInvitationsFetch = await fetch(`http://localhost:3000/api/rooms/invitations/${id}`);
        const toJson:ResponseType = await getUserInvitationsFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return toJson.payload as Room[]
    } catch (error) {
        isError(error)
    }
}
export const getUserById=async(id:string)=>{
    try {
        const userFetch = await fetch(`http://localhost:3000/api/sessions/${id}`)
        const toJson:ResponseType = await userFetch.json();
        if(isFailed(toJson)) throw new Error(toJson.error);
        return toJson.payload as Session['user']
    } catch (error) {
        isError(error)
    }
}

export const getUsersWithPermissions = async(roomId:string)=>{
    try {
        let users = await getAllUsers();
        const room = await getRoomById(roomId);
        users = users.map((u)=> {
            if(room.userId == u._id) return {...u, permission:['room:write'], isAdmin:true} 
            if(room.invitedUsers.includes(u._id)) return {...u, permission: ["room:write"], isAdmin:false}
            return {...u, permission:null, isAdmin:false};
        })
        return users
    } catch (error) {
        isError(error)
    }
}