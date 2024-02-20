import React from "react";

/** @jsx Web_pilot.createElement */
export function App (Element) {

    return (
     
          <Element/>  
        
    )
}

//WebPilot Render the App
let appendHere = document.getElementsById("root");
const showItem = Web_pilot.createElement(App);
Web_pilot.render(showItem, appendHere);

