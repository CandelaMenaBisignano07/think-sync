import { deleteRoom, getUserById } from '@/app/actions/rooms';
import { Room } from '@/types/rooms.types';
import Link from 'next/link';
import Form from 'next/form';
async function RoomItemList({room, type}: {room: Room, type:"invited"|"owner"}) {
  const user = await getUserById(room.userId);

  const handleDeleteRoom =async()=>{
    "use server"
    await deleteRoom(room.roomId)
  }
  return (
    <li key={room.roomId} className="flex gap-2 min-h-[50px] justify-around items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
    <div>
      <h4 className="text-lg font-semibold text-gray-700">room de {user.name}</h4>
      <p className="text-sm text-gray-600">enter room {room.roomId}</p>
    </div>
    <div className='gap-2 flex'>
      <Link href={`/rooms/${room.roomId}`} className='btn'>Enter</Link>
      {
        type === "owner" &&
        <Form action={handleDeleteRoom}>
          <button type='submit' className='btn'>delete</button>
        </Form>
      }
    </div>
  </li>
  )
}

export default RoomItemList
