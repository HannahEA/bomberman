import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Explosion from "../static/explosion.gif"
import AngelHeart from "../static/Angel_Heart.png"



/** @jsx Web_pilot.createElement */
export function WaitForPlayers(props) {

//~~~~~~~~~~~~~~Timer variables start~~~~~~~~~~~~
    //Stop Watch from: https://codepen.io/madrine256/details/KKoRvBb
    const timerContainer = document.querySelector('#time');//get timer element
    let timeInterval = null,//time stamp at game start
    timeStatus = false,
    minutes = 0,
    seconds = 0,
    leadingMins = 0,
    leadingSecs = 0;
//~~~~~~~~~~~~~~Timer variables end~~~~~~~~~~~~

    //This is the timer function
    function startTimer() {
        seconds++;
        //if seconds dived by 60 = 1 set back the seconds to 0 and increment the minutes 
        if (seconds / 60 === 1) {
            seconds = 0;
            minutes++;
        }
        //add zero if seconds are less than 10
        if (seconds < 10) {
            leadingSecs = '0' + seconds.toString();
        } else {
            leadingSecs = seconds;
        };
        //add zero if minutes are less than 10
        if (minutes < 10) {
            leadingMins = '0' + minutes.toString();
        } else {
            leadingMins = minutes;
        };


        //Change timer text content to actaul stop watch
        //timerContainer.innerHTML = `Count down: ${leadingMins} : ${leadingSecs}`;
        timerContainer.innerHTML = `Count down: ${leadingSecs}`;
        // showLeadingSecs = `Count down: ${leadingSecs}`;
        // console.log("LeadingSeconds",showLeadingSecs);
    }

        //wait 200 milliseconds before start timer
        setTimeout(function(){
            timeStatus = true;
            timeInterval = setInterval(startTimer, 1000);
          }, 200);

    let numPlay = `Number of Players:  ${props.nr}`;
    //using window.onload so the id='numPlay' will be rendered before js refers to it 
    // window.onload = function() {
    //     let opponents = document.querySelector("#numPlay");
    //     opponents.innerHTML = `Number of Players:  ${props.nr}`;
    // }
    

    return (
        <div id="waitForPlayers">

            <center>
                <div>
                    <h1 >Bomberman</h1>
                </div>
                <div>
                    <span className="info">
                        <h2 id="numPlay" >{numPlay}</h2>
                    </span>
                    <span className="info">
                        <h2 id="lives" >Lives:</h2>
                    </span>
                    <span className="info">
                            <img className="angel" id="heart1" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion1" src={Explosion} alt="explosion" />
                            <img className="angel" id="heart2" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion2" src={Explosion} alt="explosion" />
                            <img className="angel" id="heart3" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion3" src={Explosion} alt="explosion" />
                    </span>
                </div>
                <div className="game-container">
                    <span className="game">
                        <div className="container">
                            <div className="grid"></div>
                        </div>
                    </span>
                    <div className="menu">

                    <span className="info">
                        <h2 id="time" >Count down: 00</h2>
                    </span>

                        {/* <h3>'p' to play</h3>
                        <h3>'s' to stop</h3>
                        <h3>'r' to re-start</h3>
                        <h3>'c' to continue</h3>
                        <h3>'space bar' to shoot</h3>
                        <h3><strong>⇦ ⇨</strong> move left right</h3> */}
                    </div>
                </div>
            </center>
        </div>
    )
}