import { configs } from "@/app/lib/config";
import { isError } from "@/app/lib/utils/utils";
import mongoose from "mongoose";
export async function connect(){
    try {
        await mongoose.connect(configs.mongoDevUrl as string)
        console.log('connected')
    } catch (error) {
        isError(error)
    }
}