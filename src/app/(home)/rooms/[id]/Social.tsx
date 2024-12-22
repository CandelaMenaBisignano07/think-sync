import React, { useEffect, useMemo, useState } from 'react'
import Modal from './components/Modal'
import { inviteUsers} from '@/app/actions/rooms';
import { Session } from 'next-auth';
import UserComponent from './components/UserComponent';
import { usePathname } from 'next/navigation';
import { getUsers } from '@/app/actions/rooms';
import { User } from 'next-auth';
interface SocialProps extends React.HTMLAttributes<HTMLDivElement>{
    user:Liveblocks['UserMeta'],
    setInvitationUsers:React.Dispatch<React.SetStateAction<(User & {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    })[]>>
}
function Social({user, setInvitationUsers, ...props}:SocialProps) {
    const [search, setSearch] = useState('');
    const[users, setUsers] = useState<Session['user'][]>([]);
    const roomId = usePathname().split("/")[2]

    const usersUpdate = useMemo(()=>{
        return users.filter(({name, email})=> name?.includes(search) || email?.includes(search))
    }, [search, users])
    useEffect(()=>{
        getUsers(roomId).then(setUsers).catch((e)=> console.log(e))
    }, [])

    const handleSelect = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const userValue = e.currentTarget.value;
        const userId = e.currentTarget.id;
        setUsers((prev)=>{
            const i = prev.findIndex((u)=> u._id == userId)
            if(userValue === 'invited') prev[i] = {...prev[i], permission:['room:write']}
            else prev[i] = {...prev[i], permission:null}
            return [...prev]
        })
    }
    
    const handleInvitation = async(users:Session["user"][])=>{
        if(users.length === 0) return;
        if(!user) return;
        const response = await inviteUsers(users, roomId, user);
        const authorizedUserIds = Object.keys(response.usersAccesses)
        getUsers(roomId).then((res)=> setInvitationUsers(res.filter((u)=> authorizedUserIds.includes(u._id)))).catch((e)=> console.log(e))
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
                                {
                                    u.permission?.[0] === "room:write" ? 
                                    <>
                                        <option value={'invited'}>invited</option>
                                        <option value={'no access'}>no access</option>
                                    </>
                                    :
                                    (
                                        <>
                                            <option value={'no access'}>no access</option>
                                            <option value={'invited'}>invited</option>
                                        </>
                                    )

                                }
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
