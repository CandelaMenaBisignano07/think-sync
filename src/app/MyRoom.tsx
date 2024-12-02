import React from 'react'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react'
import { LiveMap} from '@liveblocks/client'
import Canvas from './Canvas';
import { fa, faker } from '@faker-js/faker';
function MyRoom() {
  return (
    <RoomProvider id="123" initialStorage={{shapes:new LiveMap(), chatMessages:new LiveMap()}} initialPresence={{selectedShape:null, myColor:faker.color.human(), name:faker.person.firstName(), avatar:faker.image.avatar(), chat:{x:null, y:null, isOpened:false, isFullyOpened:false}, cursor:{x:null, y:null}}}>
        <ClientSideSuspense fallback={<div>cargando...</div>}>
            <Canvas/>
        </ClientSideSuspense>
    </RoomProvider>
  )
}

export default MyRoom
