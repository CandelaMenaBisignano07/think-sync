"use client"
import { useMyPresence } from "@liveblocks/react";
interface ModalType extends React.HTMLAttributes<HTMLDivElement>{
    children: React.ReactNode,
    type:'social' | 'chat'
};
function Modal({type,children, ...props}: ModalType) {
    const [presence, setPresence] = useMyPresence();
  return (
        <div {...props}>
            <div className='bg-[#333] p-[10px] flex justify-around items-center'>
                <p className='text-white font-bold text-lg'>{type}</p>
                {<button className='btn' onClick={()=>setPresence({modal:{...presence.modal,isFullyOpened:!presence.modal.isFullyOpened}})}>resize</button>}
            </div>
            {children}
        </div>
  )
};

export default Modal;
