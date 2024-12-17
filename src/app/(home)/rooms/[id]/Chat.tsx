"use client"
import { useMutation,useStorage } from '@liveblocks/react'
import React, { useState } from 'react'
import { LiveObject } from '@liveblocks/client'
import { v4 } from 'uuid'
import Modal from './components/Modal'
export default function Chat({...props}:React.HTMLAttributes<HTMLDivElement>) {
    const [message, setMessage] = useState('');
    const messages = useStorage((root)=> {return [...root.chatMessages.entries()]});

    const addMessage = useMutation(({storage, self})=>{
        if(!message) return;
        const id = v4()
        const newMessage = {
            text:message,
            createdAt: new Date().toLocaleDateString(),
            userName: self.presence.name,
            userId: self.connectionId.toString()
        };
        storage.get('chatMessages').set(id, new LiveObject(newMessage));
    }, [message]);
    const verifyIfMessageEntered= (e:React.KeyboardEvent<HTMLInputElement>)=>{
        console.log(e.key)
        if(e.key != "Enter") return;
        else addMessage();
    };
  return (
    <Modal type='chat' {...props}>
            <div className='flex flex-col p-[30px] w-full max-h-[70%] overflow-y-scroll gap-2'>
                {
                    messages && messages.length > 0 ? messages.map(([key, value])=> (
                        <li key={key}>enviado por {value.userName}: {value.text}</li>
                    )) : <p>no hay msjs</p>
                }
            </div>
            <div className=' flex absolute bottom-0 w-[99%] mb-3'>
                <input value={message} className='w-full pl-2 border-[1px] border-solid border-black'  type='text' onChange={(e)=> setMessage(e.target.value)} onKeyDown={(e)=> verifyIfMessageEntered(e)}/>
                <button className='btn' onClick={()=>addMessage()}>send</button>
            </div>
    </Modal>
  )
}
