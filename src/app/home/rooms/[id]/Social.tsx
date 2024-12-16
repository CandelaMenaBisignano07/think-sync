import React, { useEffect, useState } from 'react'
import Modal from './components/Modal'
import { getAllUsers, getRoomById, inviteUsers} from '@/app/actions/rooms';
import { Session } from 'next-auth';
import UserComponent from './components/UserComponent';
import { usePathname } from 'next/navigation';

interface SocialProps extends React.HTMLAttributes<HTMLDivElement>{
    user:Liveblocks['UserMeta'],
}
function Social({user, ...props}:SocialProps) {
    const [search, setSearch] = useState('');
    const[users, setUsers] = useState<Session['user'][]>([]);
    const[usersUpdate, setUsersUpdate] = useState<Session['user'][]>([]);
    const roomId = usePathname().split('/')[3];
    useEffect(()=>{
        const getUsers = async()=>{ //usar abort 
            try {
                let users = await getAllUsers();
                const room = await getRoomById(roomId);
                console.log(room)
                users = users.map((u)=> {
                    if(room.userId == u._id) return {...u, permission:['room:write'], isAdmin:true} 
                    if(room.invitedUsers.includes(u._id)) return {...u, permission: ["room:write"], isAdmin:false}
                    return {...u, permission:null, isAdmin:false};
                })
                setUsers(users )
                setUsersUpdate(users)
                console.log(users, 'acaaaaa')
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
    }, [])
    useEffect(()=>{
        const newUsers = [...users.filter((u)=> u.email?.includes(search) || u.name?.includes(search))];
        setUsersUpdate(newUsers)
    }, [search, users])

    const handleSelect = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const userValue = e.currentTarget.value;
        const userId = e.currentTarget.id;
        console.log(userValue, 'aquiii')
        setUsersUpdate((prev)=>{
            const i = prev.findIndex((u)=> u._id == userId)
            if(userValue === 'invited') prev[i] = {...prev[i], permission:['room:write']}
            else prev[i] = {...prev[i], permission:null}
            console.log(prev, 'el nuevo')
            return [...prev]
        })
    }
    
    const handleInvitation = async(users:Session["user"][])=>{
        if(users.length === 0) return;
        if(!user) return;
        await inviteUsers(users, roomId, user);
    }
  return (
    <Modal type='social' {...props}>
        <section className='pt-3'>
            <input className='w-full pl-2 border-[1px] border-solid border-black' value={search} onChange={(e)=> setSearch(e.currentTarget.value)} />
        </section>
        <section>
            <ul className='max-h-[50%] justify-center items-center flex flex-col overflow-scroll'>
                {
                    usersUpdate.length > 0 ? usersUpdate.map((u)=>(
                    u._id !== user.id &&
                    <div key={u.id} className='flex pl-[100px] items-center gap-2'>
                        <UserComponent className='flex gap-2 items-center' user={{email:u.email as string, image:u.image as string}} key={u._id}/>
                        {
                            u.isAdmin ? <p>(room admin)</p> :
                            <select id={u._id} onChange={(e)=>handleSelect(e)}>
                                <option value={'no access'}>no access</option>
                                <option value={'invited'}>invited</option>
                            </select>
                        }
                    </div>
                    )) : <p>no hay</p>
                }
            </ul>
        </section>
        <div>
            <button className='btn' onClick={()=>handleInvitation(usersUpdate.filter((u)=> u._id !== user.id))}>apply</button>
        </div>
    </Modal>
  )
}

export default Social
