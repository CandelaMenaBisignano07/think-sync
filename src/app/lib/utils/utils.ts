import { ErrorType, ResponseType} from "@/types/response.types";

export function isFailed(response:ResponseType):response is ErrorType{
    return response.status === "error" 
};

export function isError(error:Error|unknown):never{
    if(error instanceof Error && error.message) throw new Error(error.message);
    else throw new Error('unknown error');
}