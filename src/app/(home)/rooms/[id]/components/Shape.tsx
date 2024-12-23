import React from "react";
import { useMutation} from "@liveblocks/react";
import Image from "next/image";
type ShapeType =[string, {
    readonly fill: {
        readonly name: string;
        readonly hexCode: string;
        readonly fontColor: "black" | "white";
    };
    readonly hasActivatedText: boolean;
    readonly text: null | string;
    readonly x: number;
    readonly y: number;
    readonly type: "circle" | "rectangle";
    readonly ownerAvatar: string;
}]


interface ShapeComponentType extends React.HTMLAttributes<HTMLDivElement>{
    shape:ShapeType,
    presence: Liveblocks["Presence"],
    handleDownloadBoard: ()=> Promise<void>
}

function Shape({ shape, presence, handleDownloadBoard, ...props}: ShapeComponentType) {
    const handleWriting = useMutation(async({storage}, e:React.ChangeEvent<HTMLTextAreaElement>, shapeId)=>{
        const shape = storage.get('shapes').get(shapeId);
        if(!shape) return;
        const currentText = e.currentTarget.value
        shape.update({text:currentText});
        handleDownloadBoard();
    }, [])

  return (
    <div
    className={`absolute p-[30px] w-[250px] h-[250px] ${shape[1].type === "circle" ? 'rounded-full' : ''} items-center flex justify-center `}
      style={{
        borderRadius: shape[1].type === "circle" ? "50%" : undefined,
        backgroundColor: shape[1].fill.hexCode,
        transform: `translate(${shape[1].x}px, ${shape[1].y}px)`,
        border: presence.selectedShape === shape[0] ? `${presence.myColor} 1px solid` : undefined
      }}
      {...props}
    >
      <textarea
        value={shape[1].text ? shape[1].text : ""}
        onChange={(e) => handleWriting(e, shape[0])}
        rows={11}
        className={`${!shape[1].hasActivatedText ? "hidden" : ""} ${
          shape[1].type === "circle" ? "rounded-full" : ""
        } outline-none scrollbar-none py-[30px] px-[30px] resize-none h-full`}
        style={{
          color: shape[1].fill.fontColor,
          backgroundColor: shape[1].fill.hexCode,
          fontWeight: 500,
        }}
      ></textarea>
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden absolute bottom-2 right-2">
        <Image
          width={50}
          height={50}
          className="object-cover w-full h-full"
          alt="user profile image"
          src={shape[1].ownerAvatar as string}
        />
      </div>
    </div>
  );
}

export default Shape;
