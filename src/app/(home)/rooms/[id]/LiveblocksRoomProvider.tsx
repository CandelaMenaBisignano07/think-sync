"use client"
import { LiveblocksProvider, ClientSideSuspense, RoomProvider } from "@liveblocks/react"
import React from "react"
import { Session } from "next-auth"
import Canvas from "./Canvas"
import { LiveMap } from "@liveblocks/client"
import {faker} from "@faker-js/faker"
function LiveblocksRoomProvider({user, roomId}:{children:React.ReactNode, user:Session, roomId:string}) {
  return (
    <>
    <LiveblocksProvider  throttle={16} authEndpoint={`/api/liveblocks-auth?userId=${user.user._id}&roomId=${roomId}`}>
      <RoomProvider id={roomId} initialStorage={{shapes:new LiveMap(), chatMessages:new LiveMap()}} initialPresence={{selectedShape:null, myColor:faker.color.human(), name:user.user.name as string, avatar:user.user.image as string, cursor:{x:null, y:null}, modal:{x:null, y:null, isFullyOpened:false, isOpened:false, type:null}}}>
        <ClientSideSuspense fallback={<div>cargando...</div>}>
            <Canvas/>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
    </>
  )
}

export default LiveblocksRoomProvider
