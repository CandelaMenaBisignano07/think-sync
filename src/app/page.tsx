"use client"

import { LiveblocksProvider} from "@liveblocks/react";
import MyRoom from "./MyRoom";
import { configs } from "./lib/config";

export default function Home() {
  return (
    <LiveblocksProvider throttle={16} publicApiKey={configs.publicApiKey as string}>
      <MyRoom/>
    </LiveblocksProvider>
  );
}
