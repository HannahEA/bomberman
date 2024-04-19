
import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Professor_Buggler from "../static/Professor_Buggler.png"
import titleScreen from "../static/sounds/01 Title Screen.ogg"

var nameChk = "";
var countdown = "";
var leadingSeconds = 0
var nickName = document.querySelector("#nickName");
let isPlaying = true;

//===============> Start Sound files variables <================

//These are all the audio files used in the game
var audio1 = new Audio(titleScreen);
var stageStart = new Audio("../static/sounds/02 Stage Start.mp3");
var mainBGM = new Audio("../static/sounds/03 Main BGM.mp3");
var powerUpGet = new Audio("../static/sounds/04 Power-Up Get.mp3");
var deadAngel = new Audio("../static/sounds/deadAngel.ogg");
var stageClear = new Audio("../static/sounds/05 Stage Clear.mp3");
var bonusStage = new Audio("../static/sounds/06 Bonus Stage.mp3");
var specialPowerUpGet = new Audio("../static/sounds/07 Special Power-Up Get.mp3");
var ending = new Audio("../static/sounds/08 Ending.mp3");
var miss = new Audio("../static/sounds/09 Miss.mp3");
var gameOver = new Audio("../static/sounds/10 Game Over.mp3");

//=================> End Sound files variables <================

/** @jsx Web_pilot.createElement */
export function NickNames(props) {

    titleScr();


    //play 'titleScreen' when user clicks on the input field
    function titleScr() {

        if (isPlaying) {
            audio1.currentTime = 0;
            audio1.play();
        } else {
            audio1.pause()
        }
    }



    //get server greeting and players array
    props.socket.addEventListener('message', function (event) {
        var msg = JSON.parse(event.data)

        switch (msg.type) {

            case "welcome":
                console.log("Server says: ", msg.data);
                break;

            case "clientsMap":
                console.log("The players array is: ", msg.data);
                //arr is used in the GrabNkNm function
                arr = msg.data;
                len = msg.data.length;

                break;

            case "nkNameChk":
                nameChk = msg.data;
                //display welcome message
                if (msg.data === 'Welcome Bomberman!') {

                    //display welcome message
                    if (document.getElementById("message1") !== null) {
                        document.getElementById("message1").innerHTML = msg.data;
                    }
                    //hide the nickName page after 0.015 seconds
                    added = setTimeout(() => {
                        document.getElementById('nickName').style.display = 'none';
                        //display the waitForPlayers page
                        document.getElementById('waitForPlayers').style.display = 'block';
                        document.getElementById('chat').style.display = 'block';
                        document.getElementById('message').style.display = 'block';
                        document.getElementById('send').style.display = 'block';
                        //end title soundtrack
                        isPlaying = false;
                        titleScr()
                        //background color: #1f3956
                        //clear the timeout
                        clearTimeout(added);
                    }, 150);
                    return;
                } else if (msg.data === 'Nickname exists, try again') {
                    //display message
                    if (document.getElementById("message1") !== null) {
                        document.getElementById("message1").innerHTML = msg.data;

                        //clear the input field after 0.015 second
                        added = setTimeout(() => {

                            document.getElementById("nickNm").value = "";
                            document.getElementById("message1").innerHTML = "choose another name";
                            clearTimeout(added);
                        }, 150)
                    }
                    return

                } else if (msg.data === 'Game full. Try later') {

                    //display message
                    if (document.getElementById("message1") !== null) {
                        document.getElementById("message1").innerHTML = msg.data;
                        //clear the input field after 1 second
                        added = setTimeout(() => {
                            document.getElementById("nickNm").value = "";
                            clearTimeout(added);
                        }, 1000)
                        return

                    }
                }

                break;

            case 'countdownMsg':
                countdown = msg.data;

            case "seconds":

                leadingSeconds = msg.data;


        }// end of switch
    })



    //to collect new player's nickname
    function GrabNkNm(e) {

        console.log("leadingSeconds inside GrabNkNm:", leadingSeconds)
        console.log("countdownMsg inside GrabNkNm:", countdown);

        //titleScr();

        if (e.key === 'Enter' && e.target.value !== "") {



            //if there are less than 4 players
            if (len < 4 && countdown !== 'Game starting in 10 seconds' && countdown !== 'gameOn') {
                //get player's nick name
                let nkNm = e.target.value;
                //make a shallow copy of the 'arr' array

                let names = [...arr];
                //append the new player
                names.push(nkNm);
                let howMany = names.length;
                console.log("Inside GrabNkNm the 'names' array and its length===:", names, howMany)
                e.target.value = "";
                //4 players maximum
                if (howMany > 0 && howMany <= 4) {
                    //send nickname to WS
                    props.socket.send(JSON.stringify({
                        type: "nickName",
                        nickname: nkNm,
                        join: true
                    }));

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
    }


    return (
        <div id="nickName">
            <section id="professor">
                <img src={Professor_Buggler} />
            </section>
            <div className="box" >
                <label id="message1">Type your name</label>
                <span><input type="text" id="nickNm" name="nickNm" onClick={() => titleScr()} onKeyUp={(e) => (GrabNkNm(e))} /></span>
            </div>
        </div>
    )

}

