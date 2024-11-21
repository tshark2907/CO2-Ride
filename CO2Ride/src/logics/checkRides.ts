import { supabase } from "./supabase";

export const checkPrevious = async (start:any, end:any, routeData:any) => {
    const {data,error} = await supabase.from("trips").select("*")
    if(error) return {ok:false, error:error}
    if(data){

    }
}

export const listen = async ()=> {
    supabase.channel("trips").on('postgres_changes',{event:"INSERT",schema:"public",table:"trips"},()=>{
        /*Lugar onde a rota encontrada e inserida no db deve ser avaliada*/
    }).subscribe()
}

const VerifyClosePoints = async ()=> {

}