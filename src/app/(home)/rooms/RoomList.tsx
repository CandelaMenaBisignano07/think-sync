import { Room } from '@/types/rooms.types';
import RoomItemList from './RoomItemList';

async function RoomList({rooms, type}: {rooms:Room[], type:"invited"|"owner"}){
  return (
    <div className='flex flex-col overflow-y-auto max-h-[150px] gap-3'>
      {
        rooms.length > 0 ? rooms.map((room)=><RoomItemList type={type} key={room.roomId} room={room}/>) : <p className='text-center'>no rooms yet.</p>
      }
    </div>
  )
}

export default RoomList
