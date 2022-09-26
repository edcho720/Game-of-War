const url = "https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/"
const newDeckButton = document.getElementById("new-deck");
const drawButton = document.getElementById("draw-cards");
const card1 = document.getElementById("card-1")
const card2 = document.getElementById("card-2")
const header = document.getElementById("winner")
const compScoreText = document.getElementById("computer-score")
const myScoreText = document.getElementById("my-score")
const remainingText = document.getElementById("remaining-cards")

let deckId;
let compScore = 0
let myScore = 0

function getNewDeck(){
    fetch(url)
    .then(res => res.json())
    .then(data => {
        remainingText.textContent = `Remaining Cards: ${data.remaining}`
        deckId = data.deck_id
        drawButton.disabled = false;
        console.log(deckId, data.remaining);
    })
}

newDeckButton.addEventListener("click", getNewDeck)
drawButton.addEventListener("click", drawCards)

async function drawCards(){
    const res = await fetch( `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    remainingText.textContent = `Remaining Cards: ${data.remaining}`
    card1.innerHTML = `<img src=${data.cards[0].image} />`
    card2.innerHTML = `<img src=${data.cards[1].image} />`

    const winnerText = calcWin(data.cards[0], data.cards[1])
    header.textContent = winnerText

    if(data.remaining < 52) {
            newDeckButton.disabled = true;
    }
    
    if(data.remaining === 0) {
        drawButton.disabled = true;
        newDeckButton.disabled = false;
        if(compScore > myScore) {
            header.style.color = "red"
            header.textContent = "The Computer Won the Game!"
        } else if (compScore < myScore){
            header.style.color = "limegreen"
            header.textContent = "You Won the Game!"
        } else {
            header.textContent = "It's a tie game!"
        }
    }
}

function calcWin(card1, card2){
    const cardVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", 
    "JACK", "QUEEN", "KING", "ACE"];
    let card1Val = cardVals.indexOf(card1.value);
    let card2Val = cardVals.indexOf(card2.value);

        
    if(card1Val > card2Val) {
        compScore++;
        compScoreText.textContent = `Computer Score: ${compScore}`
        return "Computer Wins!"
    }
    else if(card1Val < card2Val) {
        myScore++
        myScoreText.textContent = `My Score: ${myScore}`
        return "You Win!"
    }
    else return "War!"
}