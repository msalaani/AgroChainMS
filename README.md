# AgroChain

### Student
> Melek Salaani - CySeD 2021/2022

<br>

## Dependencies
NodJS

Truffle

Ganache

<br>

## Installation and Running
1. Download the project source code from GitHub repo:<br>
```git clone https://github.com/msalaani/AgroChainMS```

2. Enter the project folder and install all dependencies<br>
```
npm install
```
3. Deploy the contracts with <br>
```
truffle migrate
```
4. Then to run the frontend run<br>
```
npm run dev
```

<br>


## Project Tree

```
|   .gitignore
|   bs-config.json
|   package-lock.json
|   package.json
|	README.md
|   truffle-config.js
|   
|---contracts
|       AgroChain.sol // Agrochain smart contract
|       
|---migrations
|       2_deploy_contract.js
|       
|---node_modules
|
...
|
|         
|---src
|   |   customer.html
|   |   farmer.html
|   |   index.html
|   |   
|   |---css
|   |       app.css // Sigin page stylesheet
|   |       style.css // Customer and Farmer stylesheet
|   |       
|   |---images
|   |       bg.jpg
|   |       
|   |---js
|           AgroChain.json // Builed artifact: result of truffle migrate
|           app.js // Signin page code
|           bootstrap.min.js
|           customer.js // Customer page code
|           farmer.js // Farmer page code
|           jquery.min.js
|           jquery.qrcode.min.js
|           jsqr-1.0.2-min.js.map
|           jsqr.js
|           qrious.min.js
|           truffle-contract.js
|           web3.min.js
|           
|---test
        .gitkeep
```


