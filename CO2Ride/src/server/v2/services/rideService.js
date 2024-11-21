import { supabase } from "./client.js";
async function createRide(driver_trip_id, passenger_trip_id) {
  const {data,error} = await supabase.from("rides").insert({"driver_trip_id":driver_trip_id},{"passenger_trip_id":passenger_trip_id},{"status":'pending'})
  if(error){
    console.log("Error creating ride",error)
    return error
  }  
  return data
}

async function getRides(driver_trip_id) {
  const {data,error} = await supabase.from("rides").select("*").eq({'driver_trip_id':driver_trip_id})
  if(error){
    console.log("Error matching rides",error)
    return error
  }
  return data;
}

async function updateRideStatus(ride_id, status) {
    const { data, error } = await supabase
      .from('rides')
      .update({ status: status })
      .eq('id', ride_id); 
    if (error) {
      console.error("Error updating ride status:", error);
      return error;
    }
  
    return data;
  }


async function matchRides() {
  const { data, error } = await supabase.rpc('find_compatible_rides'); // Chama a função RPC find_compatible_rides

  if (error) {
    console.error("Error matching rides:", error);
    return error;
  }

  return data;
}


export { createRide, getRides, updateRideStatus, matchRides };
