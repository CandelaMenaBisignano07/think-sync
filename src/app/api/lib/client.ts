import { configs } from "@/app/lib/config";
import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
    secret: configs.liveblocksSecret as string
});