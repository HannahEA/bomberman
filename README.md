Bomberman
Objectives
For this project you have to create a bomberman alike game, where multiple players can join in and battle until one of them is the last man standing.

Instructions
In the beginning there was 4 players, and only one came out alive. Each player will have to start in the different corners of the map and only one will be victorious.

You will have to follow more a less the same principles has the make-your-game project. But we will refresh one of the concepts you will have to respect and deal with:

Performance, is one of the most important aspects while developing a game, so lets respect it.
Just like make-your-game you will have to respect the policy of:

Running the game at least at 60fps at all time
No frame drops
Proper use of requestAnimationFrame
Measuring performance to know if your code is fast
You must not use canvas, neither Web-GL nor another framework. For this project you will use the framework you did on the mini-framework project.

You will also have to make a chat that enables the different players to talk to each other. You will have to use WebSockets. This chat can be considered as a "Hello World" of the multiplayer feature for the bomberman-dom.

Game Mechanics
Players

Nº of players: 2 - 4
Each player must have 3 lives. Then you are out!!
Map

The map should be fixed so that every player sees the whole map.
There will be two types of blocks, the ones that can be destroyed (blocks) and the ones that can not (walls).
The walls will always be placed in the same place, while the blocks are meant to be generated randomly on the map. Tip: the optional project different maps can be useful for this part.
In the starting positions the players need to be able to survive. For example: if the players place a bomb, they will need to have space to avoid the bomb explosion.
The players should be placed in the corners as their starting positions.
Power ups (each time a player destroys a block, a random power up may or may not appear):

Bombs: Increases the amount of bombs dropped at a time by 1;
Flames: Increases explosion range from the bomb in four directions by 1 block;
Speed: Increases movement speed;
When the user opens the game, he/she should be presented to a page where he/she should enter a nickname to differentiate users. After selecting a nickname the user should be presented to a waiting page with a player counter that ends at 4. Once a user joins, the player counter will increment by 1.

If there are more than 2 players in the counter and it does not reach 4 players before 20 seconds, a 10 second timer starts, to players get ready to start the game.
If there are 4 players in the counter before 20 seconds, the 10 seconds timer starts and the game starts.

## Linking the front-end server to the back-end server

1. In the 'frontend' folder make an '.env' file that contains the *environment* variable: 
```js
WEB_PILOT_APP_API_URL=http://localhost:1234
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
2. Each jsx component file will include the *environment* variable:
``` jsx
const apiURL = process.env.WEB_PILOT_APP_API_URL;
```
The *environment* variable is included inside each 'fetch' js function like for instance:
``` js
let data = fetch(`${apiURL}/chat`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(getConversation),
    credentials: 'include',
})
   .then(response => response.json())
    .then((data) => {
        return data
    } )
```

# To install Parcel.js:
1. to generate the package.json file: 
   npm init

2. to install the Parcel bundler locally: 
   npm install --save-dev parcel

In the root directory:
1. to start the development server: 
   npx parcel static/index.html

2. add npm scripts to start and build mini-framework:
   Open the package.json file, and
   Change the 'main' field from "main": "index.js" to "source": "static"/index.html"
   Underneath "source", add 
   "scripts": {
       "start": "parcel",
       "build": "parcel build --dist-dir public"
     },
