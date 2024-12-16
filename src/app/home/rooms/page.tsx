import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/lib/authOptionsConfig';
import Form from 'next/form'
import { addRoom, getInvitationRooms, getMyRooms } from '@/app/actions/rooms';
import RoomList from './RoomList';
import MyLayout from '../MyLayout';
import { redirect } from 'next/navigation';
export default async function page() {
  const user = await getServerSession(authOptions);
  console.log(user, 'el user')
  if(!user) return redirect('/')
  const rooms = await getMyRooms(user.user._id);
  const invitationRooms = await getInvitationRooms(user.user._id)
  const formAddRoom = async()=>{
    "use server"
    await addRoom(user?.user._id as string)
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
          <RoomList rooms={rooms}/>
        </section>
        <section className='flex flex-col '>
          <h2 className='text-2xl mb-10'>invitation rooms</h2>
          <RoomList rooms={invitationRooms}/>
        </section>
      </div>
    </MyLayout>
  )
}
