import { LiveObject} from '@liveblocks/client';
import { useHistory, useMutation, useMyPresence, useOthers, useSelf, useStorage} from '@liveblocks/react';
import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import html2canvas from 'html2canvas';
import { DownloadUrl } from '../../../../types/liveblocks.config';
import Chat from './Chat'
import Link from 'next/link';
import Social from './Social';
import { redirect } from 'next/navigation';
import UserComponent from './components/UserComponent';
const prettyColors = [
    "#FFB6C1",// Light Pink
    "#FFDEAD",// Navajo White
    "#FFD700",// Gold
    "#B0E0E6",// Powder Blue
    "#ADD8E6",// Light Blue
    "#98FB98",// Pale Green
    "#FFA07A",// Light Salmon
    "#FA8072",// Salmon
    "#F4A460",// Sandy Brown
    "#DDA0DD",// Plum
    "#BA55D3",// Medium Orchid
    "#9370DB",// Medium Purple
    "#87CEEB",// Sky Blue
    "#00FA9A",// Medium Spring Green
    "#7FFFD4",// Aquamarine
    "#FFE4C4",// Bisque
    "#FF69B4",// Hot Pink
    "#40E0D0",// Turquoise
    "#00CED1",// Dark Turquoise
    "#4682B4",// Steel Blue
  ];

function Canvas() {
    const [isDragging, setIsDragging] = useState(false); //cuando se empiece a mover o este en modo selected se actvia
    const[download, setDownload] = useState<DownloadUrl|null>(null);
    const canvasRef = useRef<HTMLDivElement|null>(null);
    const {redo, undo, canRedo, canUndo, resume, pause} = useHistory();
    const shapes = useStorage((root)=>{return [...root.shapes.entries()]});
    const [ presence, setPresence] = useMyPresence();
    const self = useSelf()
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
        handleDownloadBoard()
    }, [])
    //creacion del rectangulo
    //borrar el rectangulo
    //cuando apretamos el rectangulo
    //cuando movemos el rectangulo
    //cuando sacamos el puntero del rectangulo
    const createRectangle = useMutation(({storage, setMyPresence})=>{
        const id = v4();
        const x = Math.random() * (900);
        const y = Math.random() * (300);
        const color = prettyColors.at(Math.floor(Math.random()*prettyColors.length -(0+1))) as string
        storage.get('shapes').set(id, new LiveObject({x, y, fill:color, text:null, hasActivatedText:false}))
        setMyPresence({selectedShape:id}, {addToHistory:true})
        handleDownloadBoard()
    }, []);

    const selectRectangle = useMutation(({setMyPresence},e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        const id = e.currentTarget.id;
        console.log('hola', id)
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
        const currentColor = e.target.value;
        shape.update({fill: currentColor});
    }, [])

    const otherHasShapeSelected = (id:string)=>{
        const other = others.find((o)=> o.presence.selectedShape === id);
        if(!other) return
        return other.presence.myColor
    };
    if(!shapes) return<p>loading</p>
  return (
    <>
        {
            presence.modal.isOpened && presence.modal.isFullyOpened ? (presence.modal.type === 'chat' ?<Chat className='fullyOpenedModal'/>: <Social user={self.info as Liveblocks['UserMeta']} className='fullyOpenedModal'/>) :
        <>
            <header className='z-2 header-canvas'>
            <ul className='flex gap-1'>
                <li><button className='btn' onClick={()=> createRectangle()}>rectangle</button></li>
                <li><button className='btn' onClick={()=> undo()} disabled={!canUndo()}>undo</button></li>
                <li><button className='btn' onClick={()=>redo()} disabled={!canRedo()}>redo</button></li>
                <li><button className='btn' onClick={()=>deleteRectangle()}>delete</button></li>
                <li>
                    <div>
                        <select className='btn' onChange={(e)=>handleColorChange(e)}>
                            <option value="#87CEEB">Sky Blue</option>
                            <option value="#E6E6FA">Lavender</option>
                            <option value="#FFDAB9">Peach</option>
                            <option value="#98FF98">Mint</option>
                            <option value="#FF7F50">Coral</option>
                            <option value="#C8A2C8">Lilac</option>
                            <option value="#FFD700">Gold</option>
                            <option value="#40E0D0">Turquoise</option>
                        </select>
                        <input onChange={(e)=>handleColorChange(e)} type='color'/>
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
                            <Link className='btn' href='/home/rooms'>back</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <main>
                <div ref={canvasRef} id='canvas' className='w-screen h-screen overflow-hidden ' onPointerMove={(e)=>moveRectangle(e)} onPointerUp={()=>unfoucuseRectangleIfExistsFocus()}> 
                {
                    shapes? (shapes.length > 0 ? shapes.map((shape)=> <div 
                    style={{position:"absolute",width:'200px', height:"200px", backgroundColor:shape[1].fill, transform:`translate(${shape[1].x}px, ${shape[1].y}px)`,alignItems:'center', display:'flex', justifyContent:'center', border:presence.selectedShape === shape[0] ?
                    `${presence.myColor} 1px solid` : 
                    (others.some((o)=> o.presence.selectedShape === shape[0]) ? otherHasShapeSelected(shape[0]) :undefined) }} onPointerUp={()=> unfoucuseRectangleIfExistsFocus()} onPointerDown={(e)=>selectRectangle(e)} onDoubleClickCapture={(e)=> startWriting(e)} key={shape[0]} id={shape[0]} >
                        <textarea value={shape[1].text ? shape[1].text : ""} onChange={(e)=>handleWriting(e, shape[0])} rows={11} className={`${!shape[1].hasActivatedText ? "hidden": ''} resize-none h-full`}></textarea>
                    </div> 
                    ) :"") : "" 
                }
                <div>
                    {
                        presence.modal.isOpened && !presence.modal.isFullyOpened ?  (presence.modal.type === 'chat' ? (<Chat className='openedModal' id='chat' style={{position:'absolute',transform:presence.modal.x && presence.modal.y ? `translate(${presence.modal.x}px, ${presence.modal.y}px)` : undefined}} onPointerDown={(e)=> selectRectangle(e)}/>) : <Social user={self.info as Liveblocks['UserMeta']} id='social' className='openedModal' style={{position:'absolute',transform:presence.modal.x && presence.modal.y ? `translate(${presence.modal.x}px, ${presence.modal.y}px)` : undefined}} onPointerDown={(e)=> selectRectangle(e)}/>) :null
                    }
                </div>
            </div>
            <div className="fixed bottom-4 right-10" >
                <span
                    className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white text-lg rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                    onClick={()=> setPresence({modal:{x:presence.modal.x, y:presence.modal.y, isOpened:!presence.modal.isOpened, isFullyOpened:presence.modal.isFullyOpened, type:'chat'}})}
                >
                    💬
                </span>
            </div>
        </main>
        </>
    }
    </>
  )
}

export default Canvas
