//import { Block } from "@material-ui/icons";
//import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Professor_Buggler from "../static/Professor_Buggler.png"

//const apiURL = process.env.WEB_PILOT_APP_API_URL;


/** @jsx Web_pilot.createElement */
export function NickNames(props) {
    let check = document.getElementById("message1");
    //get server greeting and players array
    props.socket.addEventListener('message', function (event) {
        var msg = JSON.parse(event.data)
        // console.log("msg.data and msg.type", msg.data, msg.type);
        switch (msg.type) {
            case "welcome":
                console.log("Welcome message from server: ", msg.data);
                break;

            case "clientsMap":
                let x = msg.data;
                let y = msg.data.length;
                props.thePlayers = x;
                props.numPlayers = y;
                //update state variables
                props.setPlayers(() => x);
                props.setNr(() => props.y);
                break;

            case "nkNameChk":
                //display welcome message
                if (msg.data === 'Welcome Bomberman!') {
                    check.innerHTML = "";
                    //display welcome message
                    check.innerHTML = msg.data;
                    //hide the nickName page after 2 seconds
                    added = setTimeout(() => {
                        e.target.value = "";
                        document.getElementById('nickName').style.display = 'none';
                        //display the waitForPlayers page
                        document.getElementById('waitForPlayers').style.display = 'block';
                        document.getElementById('chat').style.display = 'block';
                        document.getElementById('message').style.display = 'block';
                        document.getElementById('send').style.display = 'block';
                        //background color: #1f3956
                        //clear the timeout
                        clearTimeout(added);
                    }, 2000);
                    return;
                } else if (msg.data === 'Nickname exists, try again') {
                    check.innerHTML = "";
                    //display message
                    check.innerHTML = msg.data;
                    //clear the input field after 2 seconds
                    added = setTimeout(() => {
                        e.target.value = "";
                        clearTimeout(added);
                    })
                    return
                } else if (msg.data === 'Game full. Try later') {
                    check.innerHTML = "";
                    //display message
                    check.innerHTML = msg.data;
                    //clear the input field after 2 seconds
                    added = setTimeout(() => {
                        e.target.value = "";
                        clearTimeout(added);
                    })
                    return
                }
                break;
        }
    })

    //to collect new player's nickname
    function GrabNkNm(e) {
        if (e.key === 'Enter' && e.target.value !== "") {
            
            console.log("inside GrabNkNm check props.thePlayers and its length:", props.thePlayers, props.numPlayers);

            if (props.numPlayers < 4) {
                //get player's nick name
                let nkNm = e.target.value;
                //make a shallow copy of the 'props.thePlayers' array
                let names = [...props.thePlayers];
                //append the new player
                names.push(nkNm);
                let howMany = names.length;
                console.log("Inside GrabNkNm the 'names' array and its length::::", names, howMany)
                //4 players maximum
                if (howMany <= 4) {
                    //send nickname to WS
                    //props.socket.onopen = () => props.socket.send(JSON.stringify({
                    props.socket.send(JSON.stringify({
                        type: "nickName",
                        nickname: nkNm,
                        join: true
                    }));
                    return;

                } else {
                    //4 players maximum

                    props.socket.send(JSON.stringify({
                        type: "nickName",
                        nickname: nkNm,
                        join: false
                    }));
                    return;
                }
                
            } else {
                //send nickname to WS
                props.socket.send(JSON.stringify({
                    type: "nickName",
                    nickname: nkNm,
                    join: false
                }));
                return;
            }
        }
        return; 
    }

    return (
        <div id="nickName">
            <section id="professor">
                <img src={Professor_Buggler} />
            </section>
            <div className="box" >
                <label id="message1">Type your name</label>
                <span><input type="text" id="nickNm" name="nickNm" onKeyUp={(e) => (GrabNkNm(e))} /></span>
            </div>
        </div>
    )

}

