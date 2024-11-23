import { supabase } from "./supabase";

export const startRide = async (id_usuario: string, localInicio: { lat: number, lng: number }, localFim: { lat: number, lng: number }, polilinha: string, local_at: { lat: number, lng: number }, tipo_corrida: string) => {
    let tabela = tipo_corrida == 'driver' ? 'corridas_solicitadas' : 'corridas_propostas'
    const { data, error } = await supabase.from(tabela).insert({ id_usuario,polilinha,inicio: localInicio,fim: localFim,local_at })
    if (error) return { ok: false, error: error }
    if(data){
        return {
            ok:true,
            message:'Inserido com sucesso'
        }
    }
}

export const checkPrevious = async (polyline: string, rideMethod: string) => {
    let tabela = rideMethod == 'driver' ? 'corridas_solicitadas' : 'corridas_propostas'
    const { data, error } = await supabase.from(tabela).select("*")
    if (error) return { ok: false, error: error }
    if (data) {
        data.forEach(async (result) => {
            const verificacao = async () => {
                await VerifyClosePoints(polyline, result.polilinha).then((resultado) => {
                    if (!resultado || !resultado.ok || !resultado.match) {
                        return
                    }
                    return resultado
                })
            }
            return verificacao
        })
    }
}

export const listen = async (rideMethod: string, polilinha: string, callback: (resultado: any) => void) => {
    let tabela = rideMethod == 'driver' ? 'corridas_solicitadas' : 'corridas_propostas'
    supabase.channel(tabela).on('postgres_changes', { event: "INSERT", schema: "public", table: tabela }, async (payload) => {
        const verificacao = await VerifyClosePoints(polilinha, payload.new.polilinha)
        const resultado = await verificacao.json()
        if (!resultado || !resultado.ok || !resultado.match) {
            return
        }
        callback(resultado)
        /*Lugar onde a rota encontrada e inserida no db deve ser avaliada*/
    }).subscribe()
}

const VerifyClosePoints = async (polyline1: string, polyline2: string) => {
    const url = 'https://southamerica-east1-upxnewton.cloudfunctions.net/polyline_match'
    const request = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ polyline1, polyline2 })
    })
    const response = await request.json()
    return response
}