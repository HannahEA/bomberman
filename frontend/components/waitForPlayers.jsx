import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Explosion from "../static/explosion.gif"
import AngelHeart from "../static/Angel_Heart.png"



/** @jsx Web_pilot.createElement */
export function WaitForPlayers(props) {

    let numPlay = "Number of Players: "+ props.nr

    return (
        <div id="waitForPlayers">

            <center>
            <div>
                <h1 style={{ "fontSize": 25+"px" }}>Bomberman</h1>
            </div>
                <div>
                    <span className="info">
                        <h2 className="numPlay" >{numPlay}</h2>
                    </span>
                    <span className="info">
                        <h2 id="time" > Count down: 00:00</h2>
                    </span>
                    <span className="info">
                        <div id="lives">
                            <img className="angel" id="heart1" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion1" src={Explosion} alt="explosion" />
                            <img className="angel" id="heart2" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion2" src={Explosion} alt="explosion" />
                            <img className="angel" id="heart3" src={AngelHeart} alt="angel_heart" />
                            <img className="explosion" id="explosion3" src={Explosion} alt="explosion" />
                        </div>
                    </span>
                </div>
                <div className="game-container">
                    <span className="game">
                        <div className="container">
                            <div className="grid"></div>
                        </div>
                    </span>
                    <div className="menu">
                        <h3>'p' to play</h3>
                        {/* <h3>'s' to stop</h3>
                        <h3>'r' to re-start</h3>
                        <h3>'c' to continue</h3>
                        <h3>'space bar' to shoot</h3> */}
                        <h3><strong>⇦ ⇨</strong> move left right</h3>
                    </div>
                </div>
            </center>
        </div>
    )
}