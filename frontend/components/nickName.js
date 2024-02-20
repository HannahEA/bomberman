const apiURL = process.env.WEB_PILOT_APP_API_URL;

export function GrabNkNm(e){
    if(e.key.value === "Enter")
    console.log("the nickname is:", e.target.value)
}

