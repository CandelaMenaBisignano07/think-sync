import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/lib/authOptionsConfig';
import Form from 'next/form'
import { addRoom, getUserInvitationRooms, getMyRooms } from '@/app/actions/rooms';
import RoomList from './RoomList';
import MyLayout from '../MyLayout';
export default async function page() {
  const user = await getServerSession(authOptions) as Session
  const rooms = await getMyRooms(user.user._id);
  const invitationRooms = await getUserInvitationRooms(user.user._id)
  const formAddRoom = async()=>{
    "use server"
    await addRoom(user.user._id)
  }
  return(
    <MyLayout>
      <div className="w-full max-w-4xl p-6 mt-[80px] bg-white rounded-lg shadow-md flex flex-col">
        <section className='flex items-center justify-between pr-[20px] mb-10'>
          <h2 className='text-2xl'>my rooms</h2>
          <Form  action={formAddRoom}>
            <button className='btn' type='submit'>create room</button>
          </Form>
        </section>
        <section className='flex flex-col mb-10'>
          <RoomList type='owner' rooms={rooms}/>
        </section>
        <section className='flex flex-col '>
          <h2 className='text-2xl mb-10'>invitation rooms</h2>
          <RoomList type='invited' rooms={invitationRooms}/>
        </section>
      </div>
    </MyLayout>
  )
}
