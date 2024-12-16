import { Room } from '@/types/rooms.types'
import Link from 'next/link'
async function RoomItemList({room}: {room: Room}) {
  return (
    <li key={room.roomId} className="flex gap-2 min-h-[50px] justify-around items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
    <div>
      <h4 className="text-lg font-semibold text-gray-700">{room.roomId}</h4>
      <p className="text-sm text-gray-600">enter room {room.roomId}</p>
    </div>
    <Link href={`/home/rooms/${room.roomId}`} className='btn'>Enter</Link>
  </li>
  )
}

export default RoomItemList
