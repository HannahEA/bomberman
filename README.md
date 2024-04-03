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


## How to create your project using the **Web_pilot** framework

1. Add 'web_pilot/web_pilot.jsx' to the root of your repository.
2. Add other folders and files to the root e.g. *frontend-->components-->static* and *backend-->webSocket* etc.
3. in VSC terminal:
   (a) Generate the *node_modules* and corresponding *package.json* file by typing: `npm init`
   (b) Install the Parcel bundler locally by typing `npm install --save-dev parcel`. See instructions in below paragraphs.
4. In the *static* folder link the *index.html* file to the *app.jsx* file e.g.:
```jsx
<body>
  <script type="module" src="../components/app.jsx"></script>
</body>
```
5. Include the below comment above each **Web_pilot** component in the jsx files:
```jsx
/** @jsx Web_pilot.createElement */
```
6. Import and return your components in the *app.jsx* file and render the `App` component through **Web_pilot** functions:
```js
   let appendHere = document.getElementsByTagName("body")[0];
   let showNkNm = Web_pilot.createElement(App);
   Web_pilot.render(showNkNm, appendHere);
```

7. In the root folder, install Babel with VSC terminal command: 
```js
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react
```
8. To run your project from VSC, in a split terminal navigate to the *frontend* and the *backend/server* folders and type:
 ```js
 npm start
 ```
   Or, to start the development server (*frontend* folder only) type: 
```js
   npx parcel static/index.html
```
 When the *backend* and the *frontend* servers are running, in the browser type url:
  ```js
  localhost:1234
  ```


## How to implement a webSocket using the JavaScript *ws* library
*https://www.npmjs.com/package/ws?activeTab=readme*

### In the root folder make one *Backend* and one *Frontend* folder.
   In each *frontend* and *bakcend* folder type below VSC terminal commands:
   1. To create a node module:
   ```js
   npm init
   ```
   2. To install the Node.js WebSocket library: 
   ```js
   npm install --save ws
   ```

### In the *backend* folder only, install the Node.js timers module
   1. To install the Node.js timers module: 
   ```js
   npm install --save timers
   ```
   2. Inside the timers module, open the package.json file
   and change the "scripts" field as shown below:
   ``` js
     "scripts": {
    "test": "mocha test --reporter spec",
    "test-cov": "mocha test --require blanket --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js"
  }
  ```
   
### In the *frontend* folder only, install Parcel:
   1. To install the Parcel bundler in the *frontend* folder only: 
   ```js
      npm install --save-dev parcel
   ```
   2. To install Parcel bundler globally from the root folder:
   ```js
      npm install -g parcel-bundler
   ```
   3. In *frontend* folder's *package.json* file, add npm scripts to start and build Bomberman:

      Change the 'main' field from 
      ```js 
         "main": "index.js"
      ``` 
      to e.g. 
      ```js
         "source": "static/index.html"
      ```
      Underneath "source", add: 
      ```js
      "scripts": {
       "start": "parcel",
       "build": "parcel build --dist-dir public"
      },
      ```

## How to link the front-end React server to the back-end GO server 
## *(Not relevant here but useful to know)*

1. In the 'frontend' folder make an *.env* file that contains the *environment* variable: 
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


