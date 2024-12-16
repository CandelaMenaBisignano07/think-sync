import { configs } from "@/app/lib/config";
import mongoose from "mongoose";
export async function connect(){
    try {
        await mongoose.connect(configs.mongoDevUrl as string)
        console.log('connected')
    } catch (error) {
        console.log(error)
    }
}