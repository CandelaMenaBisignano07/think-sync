"use client"
import React from 'react'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react'
import { LiveMap} from '@liveblocks/client'
import Canvas from './Canvas';
import { faker } from '@faker-js/faker';
import { Session } from 'next-auth';
function MyRoom({id, user}: {id:string, user:Session}) {
  return (
    <RoomProvider id={id} initialStorage={{shapes:new LiveMap(), chatMessages:new LiveMap()}} initialPresence={{selectedShape:null, myColor:faker.color.human(), name:user.user.name as string, avatar:user.user.image as string, cursor:{x:null, y:null}, modal:{x:null, y:null, isFullyOpened:false, isOpened:false, type:null}}}>
        <ClientSideSuspense fallback={<div>cargando...</div>}>
            <Canvas/>
        </ClientSideSuspense>
    </RoomProvider>
  )
}

export default MyRoom
