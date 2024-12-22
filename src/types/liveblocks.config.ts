// Define Liveblocks types for your application
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { LiveMap, LiveObject} from "@liveblocks/client";
export type Shape=LiveObject<{
  fill: { name: string, hexCode: string, fontColor: "black" | "white" };
  hasActivatedText: boolean;
  text:null|string;
  x:number;
  y:number;
  type: 'circle' | 'rectangle';
  ownerAvatar:string;
}> 
export type DownloadUrl = {
  href:string,
  download:string
};

export type Pointer={
  x:number,
  y:number
}

export type Message = LiveObject<{
  text: string;
  createdAt:string;
  userName:string;
}>;

export type Modal = {
    x:number|null;
    y:number|null;
    isOpened:boolean;
    isFullyOpened: boolean;
    type: null |'social' | 'chat';
}


// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      selectedShape: null | string;
      myColor :string;
      name:string;
      avatar:string;
      modal:Modal;
      cursor:{
        x:number|null;
        y:number|null;
      };
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      shapes: LiveMap<string, Shape>; //le decimos que va a ser un map que tenga como clave un string y como valor un liveObject con propiedades x, y y fill
      chatMessages:LiveMap<string,Message>; 
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id:string,
      name: string;
      email: string;
      avatar: string;
    }

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
      // Example has two events, using a union
      // | { type: "PLAY" } 
      // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
/* eslint-disable @typescript-eslint/no-empty-object-type */