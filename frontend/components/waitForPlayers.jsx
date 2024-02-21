import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Explosion from "../static/explosion.gif"
import AngelHeart from "../static/Angel_Heart.png"



/** @jsx Web_pilot.createElement */
export function WaitForPlayers(props) {

    return (
        <div id="waitForPlayers">
            <div>
                <h1 style={{ "font-size": 25 + "px", "font": "x-large" }}>Bomberman</h1>
            </div>
            <center>
                <div>
                    <span class="info">
                        <h2 class="score" style="color: white;">Score:</h2>
                    </span>
                    <span class="info">
                        <h2 id="time" style="color: white;"> Time 00: 00</h2>
                    </span>
                    <span class="info">
                        <div id="lives">
                            <img class="angel" id="heart1" src={AngelHeart} alt="angel_heart" />
                            <img class="explosion" id="explosion1" src={Explosion} alt="explosion" />
                            <img class="angel" id="heart2" src={AngelHeart} alt="angel_heart" />
                            <img class="explosion" id="explosion2" src={Explosion} alt="explosion" />
                            <img class="angel" id="heart3" src={AngelHeart} alt="angel_heart" />
                            <img class="explosion" id="explosion3" src={Explosion} alt="explosion" />
                        </div>
                    </span>
                </div>

                <div class="game-container">
                    <span class="game">
                        <div class="container">
                            <div class="grid"></div>
                        </div>
                    </span>
                    <div class="menu">
                        <h3>'p' to play</h3>
                        <h3>'s' to stop</h3>
                        <h3>'r' to re-start</h3>
                        <h3>'c' to continue</h3>
                        <h3>'space bar' to shoot</h3>
                        <h3><strong>&#8678 &#8680</strong> move shooter left / right</h3>
                    </div>


                </div>
            </center>


        </div>

    )


}