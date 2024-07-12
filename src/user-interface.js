import {Bot, Coordinate, Player} from "./game-data";
import X from "./X.svg"
import dot from "./dot.svg"


let firstPLayerContainer = document.querySelector(".first-player")
let secondPlayerContainer = document.querySelector(".second-player")

const resetButton = document.querySelector(".reset")
const startButton = document.querySelector(".start")
const finalMessage = document.querySelector(".text")

let turn

let players = []

let isStarted = false

class PlayerUserInterface{
    player
    boardToElement
    elementToBoard
    container

    constructor(player,container){
        this.player = player
        this.boardToElement = new Map()
        this.elementToBoard = new Map()
        this.container = container
    }


}



function createGameBoard(playerUI){
    playerUI.container.innerHTML = ""
    playerUI.boardToElement = new Map()
    playerUI.elementToBoard = new Map()
    let gameBoard = playerUI.player.gameBoard
    for (const boardElement of gameBoard.board) {
        let div = document.createElement("div");
        let ship = boardElement.ship
        if(ship && playerUI.player.playerType === "Human"){
            let shipDiv = document.createElement("div")
            shipDiv.classList.add("ship")
            shipDiv.addEventListener("mouseenter", (e)=>{ shipHoverEventListener(e.target,ship,gameBoard,playerUI)})
            shipDiv.addEventListener("mouseout", (e)=>{ shipHoverEventListener(e.target,ship,gameBoard,playerUI)})
            shipDiv.addEventListener("mousedown", (e)=>{ moveShipEventListener(e,ship,gameBoard,playerUI)})
            div.appendChild(shipDiv)

        }

        div.addEventListener("click", (e)=>{ hitEventListener(e.target,gameBoard,boardElement,playerUI)})
        div.classList.add("board-element")
        playerUI.container.appendChild(div)
        playerUI.boardToElement.set(boardElement,div)
        playerUI.elementToBoard.set(div,boardElement)
    }

}

function moveShipEventListener(e,ship,gameBoard,playerUI){
    if(isStarted) return

    let elementArray = []
    let firstMoveCoordinate = {x:e.pageX,y:e.pageY}
    let isMoved = false


    for (const coordinate of ship.coordinates) {
        elementArray.push(playerUI.boardToElement.get(coordinate).firstElementChild)
    }

    for (const elementArrayElement of elementArray) {


        function moveAt(pageX, pageY) {
            let xMove = pageX-firstMoveCoordinate.x
            let yMove = pageY -firstMoveCoordinate.y
            elementArrayElement.style.transform = `translate(${xMove}px,${yMove}px)`
        }

        moveAt(e.pageX, e.pageY);

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        function onMouseUp(e){
            if(!isMoved){
                elementArrayElement.style.pointerEvents = "none"
                let rect = elementArrayElement.getBoundingClientRect();
                let newBeginningBoardElement = document.elementFromPoint(rect.left+40, rect.top+40)
                if(newBeginningBoardElement.classList.contains("board-element") &&
                    newBeginningBoardElement.parentElement.classList.contains("first-player")){
                    let newBeginningBoard = playerUI.elementToBoard.get(newBeginningBoardElement)
                    ship.set(gameBoard,newBeginningBoard,ship.direction)
                }
                createGameBoard(playerUI)
                isMoved = true
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }



        document.addEventListener("mouseup",onMouseUp)
    }



}

function shipHoverEventListener(target,ship,gameBoard,playerUI){
    for (const coordinate of ship.coordinates) {
        let getDiv = playerUI.boardToElement.get(gameBoard.getCoordinateFromCoordinateObj(coordinate))
        getDiv.firstElementChild.classList.toggle("hover")


    }

}


function startGame(){
    isStarted = true
    beginnerSelect(players[0],players[1])
    startButton.classList.add("hidden")
    firstPLayerContainer.style.pointerEvents = "none"
}


async function resetGame(){
    startButton.classList.remove("hidden")
    finalMessage.classList.add("hidden")
    resetButton.classList.add("hidden")
    firstPLayerContainer.style.pointerEvents = "auto"
    firstPLayerContainer.classList.remove("turn")
    secondPlayerContainer.classList.remove("turn")
    players = []
    await createGame()

}


function hitEventListener(target,gameBoard,coordinate,targetPlayerUI){

    if(!isStarted) return false;

    if(target === null || target === undefined) return false


    if(target.firstElementChild !== null && target.firstElementChild.classList.contains("ship")){
        target = target.firstElementChild
    }

    if(targetPlayerUI === turn)
        return false

    let result = gameBoard.receiveAttack(coordinate)
    if(result){
        target.classList.add("hit")
        let img = document.createElement("img")
        img.src = result.shipHit?X:dot
        if(result.length !== undefined){
            img.src = X
            finalMessage.textContent = turn.player.playerType + " won!"
            firstPLayerContainer.classList.add("turn")
            secondPlayerContainer.classList.add("turn")
            finalMessage.classList.remove("hidden")
            resetButton.classList.remove("hidden")
            isStarted = false
            turn = null
            target.appendChild(img)
            return true
        }
        target.appendChild(img)
        if(!result.shipHit){
            turnChange(turn,turn === players[0]?players[1]:players[0])
            return true
        }
        else
            return true
    }
    return false


}
function beginnerSelect(player1,player2){
    let randomNum = Math.random()
    if(randomNum < 0.5){
        turnChange(null,player1)
    }
    else{
        turnChange(null,player2)
    }
}

function turnChange(from,to){
    if(from !== null)
        from.container.classList.toggle("turn")
    to.container.classList.toggle("turn")
    turn = to
    if(to.player.playerType==="Computer"){
        botPlay(to)
    }
}

async function botPlay(bot){
    let humanGameBoard = players[0].player.gameBoard
    let humanUI = players[0]

    while(turn === bot){
        let coordinate = bot.player.makeRandomMove(humanGameBoard)
        let target = humanUI.boardToElement.get(coordinate)
        let isDone = hitEventListener(target,humanGameBoard,coordinate,humanUI)
        let direction = Math.random() < 0.5?"h":"v";
        let minusOrPlus = Math.random() < 0.5?1:-1
        if(isDone && turn === bot){
            await sleep(250)
            while (turn === bot && isDone){
                if(direction === "h")
                    coordinate =
                        humanGameBoard.getCoordinateFromCoordinateObj
                        (new Coordinate(coordinate.x + 1*minusOrPlus,coordinate.y))
                else
                    coordinate =
                        humanGameBoard.getCoordinateFromCoordinateObj
                        (new Coordinate(coordinate.x ,coordinate.y+ 1*minusOrPlus))
                target = humanUI.boardToElement.get(coordinate)
                isDone = hitEventListener(target,humanGameBoard,coordinate,humanUI)
                if(turn === bot) await sleep(250)
            }
        }
    }
}



resetButton.addEventListener("click",()=>resetGame())
startButton.addEventListener("click",()=>startGame())


async function createGame(){
    let player = new Player("Human")
    let playerUI = new PlayerUserInterface(player,firstPLayerContainer)

    let bot = new Bot("Computer",player)
    let botUI = new PlayerUserInterface(bot,secondPlayerContainer)

    createGameBoard(playerUI)
    createGameBoard(botUI)
    players.push(playerUI)
    players.push(botUI)
}

function sleep(ms) {
    return new Promise(x=>setTimeout(x,ms))
}


createGame()


