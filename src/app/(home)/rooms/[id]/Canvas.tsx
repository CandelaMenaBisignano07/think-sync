import { LiveObject} from '@liveblocks/client';
import { useHistory, useMutation, useMyPresence, useOthers, useSelf, useStorage} from '@liveblocks/react';
import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import html2canvas from 'html2canvas';
import { DownloadUrl} from '../../../../types/liveblocks.config';
import Chat from './Chat'
import Link from 'next/link';
import Social from './Social';
import UserComponent from './components/UserComponent';
import Image from 'next/image';
import { getUsers } from '@/app/actions/rooms';
import { Session } from 'next-auth';

const prettyColors = [
    { name: "lightPink", hexCode: "#ffb6c1", fontColor: "black" },
    { name: "navajoWhite", hexCode: "#ffdead", fontColor: "black" },
    { name: "gold", hexCode: "#ffd700", fontColor: "black" },
    { name: "powderBlue", hexCode: "#b0e0e6", fontColor: "black" },
    { name: "lightBlue", hexCode: "#add8e6", fontColor: "black" },
    { name: "paleGreen", hexCode: "#98fb98", fontColor: "black" },
    { name: "lightSalmon", hexCode: "#ffa07a", fontColor: "black" },
    { name: "salmon", hexCode: "#fa8072", fontColor: "black" },
    { name: "sandyBrown", hexCode: "#f4a460", fontColor: "black" },
    { name: "plum", hexCode: "#dda0dd", fontColor: "black" },
    { name: "mediumOrchid", hexCode: "#ba55d3", fontColor: "white" },
    { name: "mediumPurple", hexCode: "#9370db", fontColor: "white" },
    { name: "skyBlue", hexCode: "#87ceeb", fontColor: "black" },
    { name: "mediumSpringGreen", hexCode: "#00fa9a", fontColor: "black" },
    { name: "aquamarine", hexCode: "#7fffd4", fontColor: "black" },
    { name: "bisque", hexCode: "#ffe4c4", fontColor: "black" },
    { name: "hotPink", hexCode: "#ff69b4", fontColor: "black" },
    { name: "turquoise", hexCode: "#40e0d0", fontColor: "black" },
    { name: "darkTurquoise", hexCode: "#00ced1", fontColor: "white" },
    { name: "steelBlue", hexCode: "#4682b4", fontColor: "white" },
  ];
function Canvas({roomId}:{roomId:string}) {
    const [isDragging, setIsDragging] = useState(false); //cuando se empiece a mover o este en modo selected se actvia
    const[download, setDownload] = useState<DownloadUrl|null>(null);
    const canvasRef = useRef<HTMLDivElement|null>(null);
    const {redo, undo, canRedo, canUndo, resume, pause} = useHistory();
    const shapes = useStorage((root)=>{return [...root.shapes.entries()]});
    const [ presence, setPresence] = useMyPresence();
    const [users, setUsers] = useState<Session["user"][]>([])
    const self = useSelf();
    const others = useOthers();
    
    const handleDownloadBoard = async()=>{
        try {
            if(!canvasRef.current) return
            const canvas = await html2canvas(canvasRef.current,{
                ignoreElements:((chatRef)=> ['chat', 'social'].includes(chatRef.id))
            })
            const url = {href:canvas.toDataURL(), download: `${v4()}.png`};
            setDownload(url)
        } catch (error) {
            if(error instanceof Error) return console.log(error.message);
            else return console.log(error)
        }
    }
    useEffect(()=>{
        handleDownloadBoard();
        getUsers(roomId).then((res)=>setUsers(res?.filter((u)=> u.permission?.[0] === "room:write"))).catch((e)=> console.log(e));
    }, [])
    //creacion del rectangulo
    //borrar el rectangulo
    //cuando apretamos el rectangulo
    //cuando movemos el rectangulo
    //cuando sacamos el puntero del rectangulo
    const createShape = useMutation(({storage, setMyPresence}, e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        const id = v4();
        const x = Math.random() * (900);
        const y = Math.random() * (300);
        const color = prettyColors.at(Math.floor(Math.random()*prettyColors.length -(0+1))) as { name: string,hexCode:string, fontColor: "black" | "white" }
        const shapeType = e.currentTarget.value as "circle" | "rectangle";
        storage.get('shapes').set(id, new LiveObject({x, y, fill:color, text:null, hasActivatedText:false,ownerAvatar:self.presence.avatar as string, type: shapeType}))
        setMyPresence({selectedShape:id}, {addToHistory:true})
        handleDownloadBoard()
    }, [self.presence.avatar]);

    const selectShape = useMutation(({setMyPresence},e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        const id = e.currentTarget.id;
        setMyPresence({selectedShape:id}, {addToHistory:true}); 
        setIsDragging(true);
        if(!['social', 'chat'].includes(id)) handleDownloadBoard()
    }, [])

    const moveRectangle = useMutation(({storage, self, setMyPresence}, e:React.PointerEvent<HTMLDivElement>)=>{ 
        if(!isDragging) return;
        const id = self.presence.selectedShape;
        if(!id) return
        if(['social', 'chat'].includes(id)){
            setMyPresence({modal:{...presence.modal, x:e.clientX-50, y:e.clientY-50, isOpened:true, isFullyOpened:false}});
        }else{
            const rectangle = storage.get("shapes").get(id);
            if(!rectangle) return
            pause() //hace que todos los cambios en la history se hagan en un solo cambio y no en cambios separados, si no hicieramos esto cuando hariamos un undo o redo el cuadrado se moveria cada 1 pixel y no la posicion completa.
            rectangle.update({x:e.clientX-50, y:e.clientY-50});
        }
    }, [isDragging]) //basicamente este array de dependencias hace que la funcion se vuelva a renderizar con los valores actualizados de las variables que cambian, como en este caso isDragging
    const unfoucuseRectangleIfExistsFocus = useMutation(async({setMyPresence})=>{
        if(!presence.selectedShape) return;
        if(!isDragging){
            setMyPresence({selectedShape:null}, {addToHistory:true});
            resume() //vuelve a hacer que en la history se guarden los cambios separados 
            handleDownloadBoard()
        }else{
            setIsDragging(false)
        } 
        //si se esta arrastrando(osea este evento se activaria desde el pointerUp del rectangle) entonces seteamos el arrastrar a falso, ya que asi aunque dejemos de arrastrarlo el elemento seguiria focused
        //si no se esta arrastrando(osea ya le habiamos activado el evento anterior) entonces significa que queremos sacarle el focus total
    }, [isDragging]);

    const deleteRectangle = useMutation(async({storage, setMyPresence, self})=>{
        const id = self.presence.selectedShape;
        if(!id) return;
        storage.get('shapes').delete(id);
        setMyPresence({selectedShape:null}, {addToHistory:true})
        handleDownloadBoard();
    }, []);

    const startWriting = useMutation(({storage},e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        const shape = storage.get('shapes').get(e.currentTarget.id);
        if(!shape) return;
        shape.update({hasActivatedText:true})
    }, []);

    const handleWriting = useMutation(async({storage}, e:React.ChangeEvent<HTMLTextAreaElement>, shapeId)=>{
        const shape = storage.get('shapes').get(shapeId);
        if(!shape) return;
        const currentText = e.currentTarget.value
        shape.update({text:currentText});
        handleDownloadBoard();
    }, [])


    const handleColorChange = useMutation(async({storage, self}, e:React.ChangeEvent<HTMLSelectElement|HTMLInputElement>)=>{
        const id = self.presence.selectedShape;
        if(!id) return;
        const shape = storage.get('shapes').get(id);
        if(!shape) return;
        const currentColor = prettyColors.find((c)=> c.hexCode === e.target.value)  as  { name: string, hexCode: string, fontColor: "black" | "white" }
        shape.update({fill: currentColor});
    }, [])
    if(!shapes || !self) return<p>loading</p>
  return (
    <>
    {
        presence.modal.isOpened && presence.modal.isFullyOpened ? (presence.modal.type === 'chat' ?<Chat className='fullyOpenedModal'/>: <Social setInvitationUsers={setUsers} user={self.info as Liveblocks['UserMeta']} className='fullyOpenedModal'/>) :
        <div className='grid grid-cols-canvas'>
        <aside className='w-auto h-screen flex justify-center'>
            <ul className='flex flex-col gap-4'>
                <li >
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        <Image width={200} height={200} className='object-cover w-full h-full' alt="user profile image" src={self.presence.avatar as string}/>
                        <span className={`w-[10px] h-[10px] absolute rounded-full left-16 bg-green-500 `}></span>
                    </div>
                </li>
            {
            users.length > 0 ? users?.map((user)=>
                !(user._id === self.id) &&
                <li>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        <Image width={200} height={200} className='object-cover w-full h-full' alt="user profile image" src={user.image as string}/>
                        <span className={`w-[10px] h-[10px] absolute rounded-full left-16 ${others.map((o)=> o.id).includes(user._id) ? "bg-green-500" : "bg-red-500"} `}></span>
                    </div>
                </li>
            ) : null
            }
            </ul>
        </aside>
        <>
            <header className='z-2 header-canvas'>
            <ul className='flex gap-1'>
                <li><button className='btn' value={"rectangle"} onClick={(e)=> createShape(e)}>rectangle</button></li>
                <li><button className='btn' value={"circle"} onClick={(e)=> createShape(e)}>circle</button></li>
                <li><button className='btn' onClick={()=> undo()} disabled={!canUndo()}>undo</button></li>
                <li><button className='btn' onClick={()=>redo()} disabled={!canRedo()}>redo</button></li>
                <li><button className='btn' onClick={()=>deleteRectangle()}>delete</button></li>
                <li>
                    <div>
                        <select className='btn' onChange={(e)=>handleColorChange(e)}>
                            {
                                prettyColors.map(({name, hexCode})=>(<option value={hexCode}>{name}</option>))
                            }
                        </select>
                    </div>
                </li>
            </ul>
            <ul className='flex gap-2 overflow-x-scroll max-w-[100px] pl-[100px]'>
                <UserComponent user={{email:presence.name, image:presence.avatar}}/>
                {
                    others.map((o)=> o.id !== self?.id && <UserComponent key={o.id} user={{email:o.presence.name, image:o.presence.avatar}}/>)
                }
            </ul>
            <div className='flex items-center gap-3'>
                <button onClick={()=> setPresence({modal:{x:presence.modal.x, y:presence.modal.y, isOpened:!presence.modal.isOpened, isFullyOpened:presence.modal.isFullyOpened, type:'social'}})} className='btn'>👥</button>
                <a className='btn' download={download ? download.download : undefined} href={download ? download.href : undefined}>download board</a>
                <nav>
                    <ul>
                        <li>
                            <Link className='btn' href='/rooms'>back</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <main>
            <section className='relative'>
                <div ref={canvasRef} id='canvas' className='w-[98%] h-screen overflow-hidden absolute bg-gray-100' onPointerMove={(e)=>moveRectangle(e)} onPointerUp={()=>unfoucuseRectangleIfExistsFocus()}> 
                    {
                        shapes? (shapes.length > 0 ? shapes.map((shape)=> <div 
                        style={{position:"absolute", padding:'30px',width:'250px', height:"250px",borderRadius:shape[1].type === "circle" ? "50%" : undefined, backgroundColor:shape[1].fill.hexCode, transform:`translate(${shape[1].x}px, ${shape[1].y}px)`,alignItems:'center', display:'flex', justifyContent:'center', border:presence.selectedShape === shape[0] ?
                        `${presence.myColor} 1px solid`:undefined}} onPointerUp={()=> unfoucuseRectangleIfExistsFocus()} onPointerDown={(e)=>selectShape(e)} onDoubleClickCapture={(e)=> startWriting(e)} key={shape[0]} id={shape[0]} >
                            <textarea  value={shape[1].text ? shape[1].text : ""} onChange={(e)=>handleWriting(e, shape[0])} rows={11} className={`${!shape[1].hasActivatedText ? "hidden": ''} ${shape[1].type === "circle" ? "rounded-full" : ""} outline-none scrollbar-none py-[30px] px-[30px] resize-none h-full`} style={{color:shape[1].fill.fontColor, backgroundColor:shape[1].fill.hexCode, fontWeight:500}}></textarea>
                            <div className='w-[40px] h-[40px] rounded-full overflow-hidden absolute bottom-2 right-2'>
                                <Image width={50} height={50} className='object-cover w-full h-full' alt="user profile image" src={shape[1].ownerAvatar as string}/>
                            </div>
                        </div> 
                        ) :"") : "" 
                    }
                    <div>
                        {
                            presence.modal.isOpened && !presence.modal.isFullyOpened ?  (presence.modal.type === 'chat' ? (<Chat className='openedModal' id='chat' style={{position:'absolute',transform:presence.modal.x && presence.modal.y ? `translate(${presence.modal.x}px, ${presence.modal.y}px)` : undefined}} onPointerDown={(e)=> selectShape(e)}/>) : <Social setInvitationUsers={setUsers} user={self.info as Liveblocks['UserMeta']} id='social' className='openedModal' style={{position:'absolute',transform:presence.modal.x && presence.modal.y ? `translate(${presence.modal.x}px, ${presence.modal.y}px)` : undefined}} onPointerDown={(e)=> selectShape(e)}/>) :null
                        }
                    </div>
                    <div className="fixed bottom-4 right-10" >
                    <span
                        className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white text-lg rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                        onClick={()=> setPresence({modal:{x:presence.modal.x, y:presence.modal.y, isOpened:!presence.modal.isOpened, isFullyOpened:presence.modal.isFullyOpened, type:'chat'}})}
                    >
                        💬
                    </span>
                </div>
                </div>
            </section>
        </main>
        </>   
        </div>
    }
    </>
  )
}

export default Canvas
