import { Block } from "@material-ui/icons";
import {Web_pilot} from "../../web_pilot/web_pilot.jsx"
import Professor_Buggler from "../static/Professor_B.png"

//const apiURL = process.env.WEB_PILOT_APP_API_URL;


/** @jsx Web_pilot.createElement */
export function NickNames(props){

//to collect new player's nickname
function GrabNkNm(e){
    if(e.key === 'Enter' && e.target.value !== ""){
        let numPlayers = props.players.length;
        numPlayers++;
        props.setNr(() => numPlayers);
        //get player's nick name
        let nkNm = e.target.value;
        //make a shallow copy of the 'players' state variable array
        let names = [...props.players];
        //append the new player
        names.push(nkNm);
        //update the 'players' state variable
        props.setPlayers(() => names)
        console.log("the names array, the players state var. array, the numPlayers and the names.length:", names, props.players, numPlayers, names.length)
        e.target.value = "";

        if(names.length > 0){
            document.getElementById('nickName').style.display = 'none'; 
            //background color: #1f3956
            document.getElementById('waitForPlayers').style.display = 'block';

        }
    }

}

    return(
        <div id="nickName">
        <section id="professor">
            <img src={Professor_Buggler} />
        </section>
        <div className="box" >
        <label id="message1">Type your name</label>
        <span><input type="text" id="nickNm" name="nickNm" onKeyUp={(e) => (GrabNkNm(e))}/></span>
        </div>
        </div>
    )

}

