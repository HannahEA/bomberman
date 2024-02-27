import { Web_pilot } from "./Webpilot/web_pilot.jsx";
import { Example } from "./example.jsx";
// const apiURL = process.env.BOMBERMAN_APP_API_URL;

/** @jsx Web_pilot.createElement */
export function App () {
    let Element
    const url = (window.location.href).split('/')[3]
    console.log("url", url)
    if (url === "game") {
       Element = Example
    }


    return (
     
          <Element/>  
        
    )
}

//WebPilot Render the App
let appendHere = document.getElementById("root");
const showItem = Web_pilot.createElement(App);
Web_pilot.render(showItem, appendHere);

