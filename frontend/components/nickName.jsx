import { Block } from "@material-ui/icons";
import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Professor_Buggler from "../static/Professor_Buggler.png"

const apiURL = process.env.WEB_PILOT_APP_API_URL;


/** @jsx Web_pilot.createElement */
export function NickNames(props) {

    //to collect new player's nickname
    function GrabNkNm(e) {
        if (e.key === 'Enter' && e.target.value !== "") {
            //let numPlayers = props.players.length;
            //====> Check if I am missing one player from 'players' and 'nr' state variables: <=======
            console.log("Inside GrabNkNm: *** 'players' and 'nr' state vars ***: %n", props.players, props.nr)
            console.log("Inside GrabNkNm: *** 'thePlayers' and 'numPlayers' array vars ***: %n", props.thePlayers, props.numPlayers)
            //adding one player to account for delay in refreshing 'players' state variable
            if (props.numPlayers < 4) {
                //add the new player to the 'nr' state variable
                //props.setNr(() => numPlayers + 1);//

                //get player's nick name
                let nkNm = e.target.value;
                //make a shallow copy of the 'thePlayers' array
                let names = [...props.thePlayers];
                //append the new player
                names.push(nkNm);
                let howMany = names.length;
                console.log("The 'names' array and its length:", names, howMany)
                //4 players maximum
                if (howMany <= 4) {
                    /*if (howMany < 4) {
                        props.socket.send(JSON.stringify({
                            type: 'nickName',
                            data: 'Welcome!'
                        }
                        ))*/

                    //send nickname to WS
                    props.socket.send(JSON.stringify({
                        type: "nickName",
                        nickname: nkNm,
                        join: true
                    }));
                    //display welcome message
                    if (props.nNameChk === 'Welcome Bomberman!') {
                        //display welcome message
                        e.target.value = props.nNameChk;

                        //hide the nickName page after 1 second
                        added = setTimeout(() => {
                            document.getElementById('nickName').style.display = 'none';
                            console.log("the names array values are:", names);

                            //display the waitForPlayers page
                            document.getElementById('waitForPlayers').style.display = 'block';
                            document.getElementById('chat').style.display = 'block';
                            document.getElementById('message').style.display = 'block';
                            document.getElementById('send').style.display = 'block';
                            //background color: #1f3956
                        }, 1000);

                    } else if (props.nNameChk === 'Nickname exists, try again') {
                        //display message
                        e.target.value = props.nNameChk;

                    }
                } 
                /*else if (howMany > 4) {
                    //send nickname to WS
                    props.socket.send(JSON.stringify({
                        type: "nickName",
                        nickname: nkNm,
                        join: false
                    }));
                } else {
                    e.target.value = props.nNameChk;
                    props.socket.send(JSON.stringify({
                        type: 'nickName',
                        data: 'Game full'
                    }))
                }*/

                //update the 'players' state variable
                //props.setPlayers(() => names)
                //console.log("the names array, the players state var. array, the numPlayers and the names.length:", names, props.players, numPlayers, names.length)
                //e.target.value = "";


            } else {
                //4 players maximum
                e.target.value = "Game full. Try later";
            }
            //clear the timeout
            clearTimeout(added);
        }
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

