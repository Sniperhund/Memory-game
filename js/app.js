/*
  For at aktivere et kort, tilføj en css class med navnet active
  eks. object.classList.add("active"); . men husk også at fjerne class hvis 
  kortet ikke matcher. .classList.remove("active");
*/

// Step 1. Tilføj click event på alle kort holder elemente <figure>.
// Step 2. Tilføj check om 2 billeder som er aktive matcher.

// Ekstra opgaver.
// 1. Indbyg en score som give + point ved korret match, og - point ved forkert.
// 2. Indbyg en reset knap så spillet kan genstrate.
// 3. Udskriv billeder i tilfældig rækkefølge.
/*
eks ved at bruge en array:
const memoryPictureUrls = [
  "https://picsum.photos/seed/memory_1/300/300",
  "https://picsum.photos/seed/memory_2/300/300",
  "https://picsum.photos/seed/memory_3/300/300",
  "https://picsum.photos/seed/memory_4/300/300",
  "https://picsum.photos/seed/memory_5/300/300",
  "https://picsum.photos/seed/memory_6/300/300",
  "https://picsum.photos/seed/memory_1/300/300",
  "https://picsum.photos/seed/memory_2/300/300",
  "https://picsum.photos/seed/memory_3/300/300",
  "https://picsum.photos/seed/memory_4/300/300",
  "https://picsum.photos/seed/memory_5/300/300",
  "https://picsum.photos/seed/memory_6/300/300",
];
*/
// 4. Når spillet er forbi, brug confetti.js til at vise confetti på skærmen. Mere info her : https://github.com/abelmoricz/abelmoricz.github.io/tree/9eac02160de7bb57170441a441db96b36e8341d8/confetti.js-master

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const memoryPictureUrls = [
	"https://picsum.photos/seed/memory_1/300/300",
	"https://picsum.photos/seed/memory_2/300/300",
	"https://picsum.photos/seed/memory_3/300/300",
	"https://picsum.photos/seed/memory_4/300/300",
	"https://picsum.photos/seed/memory_5/300/300",
	"https://picsum.photos/seed/memory_6/300/300",
	"https://picsum.photos/seed/memory_1/300/300",
	"https://picsum.photos/seed/memory_2/300/300",
	"https://picsum.photos/seed/memory_3/300/300",
	"https://picsum.photos/seed/memory_4/300/300",
	"https://picsum.photos/seed/memory_5/300/300",
	"https://picsum.photos/seed/memory_6/300/300",
];

const figures = document.getElementsByClassName("card")
const p1Score = document.getElementById("score1")
const p2Score = document.getElementById("score2")

const player1 = document.getElementById("p1")
const player2 = document.getElementById("p2")

const winMessage = document.getElementById("win-message")

let prevFigure = null
let currentFigure = null

let p1ScoreCounter = 0
let p2ScoreCounter = 0

let guessedCards = []
let hasCardsShuffled = true

let isPlayer1 = false // <-- I use a function to switch this to be player 1 before the players get a chance to do anything :)

function setupCards() {
	shuffleArray(memoryPictureUrls)

	for (let i = 0; i < figures.length; i++) {
		const element = figures[i];

		element.children[0].src = memoryPictureUrls[i]
	}
}

setupCards()

for (let i = 0; i < figures.length; i++) {
	const element = figures[i];

	element.addEventListener("click", (event) => {
		if (!hasCardsShuffled){
				setupCards()
				hasCardsShuffled = true
			}

		if (guessedCards.includes(event.target))
			return

		event.target.classList.toggle("active")

		if (!prevFigure)
			prevFigure = event.target
		else {
			currentFigure = event.target

			if (currentFigure.children[0].src == prevFigure.children[0].src) {
				givePoint(1, false)
				guessedCards.push(currentFigure, prevFigure)
			} else {
				givePoint(-1)

				setTimeout((prevFigure, currentFigure) => {
					prevFigure.classList.remove("active")
					currentFigure.classList.remove("active")
				}, 750, prevFigure, currentFigure)
			}

			prevFigure = null
			currentFigure = null
		}

		p1Score.innerText = p1ScoreCounter.toString()
		p2Score.innerText = p2ScoreCounter.toString()

		let didWin = true

		for (let i = 0; i < figures.length; i++) {
			const element = figures[i];

			if (!element.classList.contains("done"))
				didWin = false
		}

		if (guessedCards.length == figures.length)
			win()
	})
}

givePoint(0) // <-- This makes player 1's text larger :)

function givePoint(amount, shouldSwitch = true) {
	if (isPlayer1) {
		p1ScoreCounter += amount

		if (shouldSwitch) {
			player2.classList.add("active")
			player1.classList.remove("active")
		}
	} else {
		p2ScoreCounter += amount

		if (shouldSwitch) {
			player2.classList.remove("active")
			player1.classList.add("active")
		}
	}

	if (shouldSwitch)
		isPlayer1 = !isPlayer1
}

function reset() {
	p1ScoreCounter = 0
	p2ScoreCounter = 0
	p1Score.innerText = p1ScoreCounter.toString()
	p2Score.innerText = p2ScoreCounter.toString()

	isPlayer1 = false
	givePoint(0)

	prevFigure = null
	currentFigure = null

	for (let i = 0; i < figures.length; i++) {
		const element = figures[i];

		element.classList.remove("active")
		element.classList.remove("done")
	}

	hasCardsShuffled = false

	confetti.remove()

	guessedCards = []

	winMessage.innerText = ""
}

function win() {
	confetti.start(10000000, 0, 450)

	if (p1ScoreCounter > p2ScoreCounter) {
		winMessage.innerText = "Player 1 won!"
	} else if (p1ScoreCounter < p2ScoreCounter) {
		winMessage.innerText = "Player 2 won!"
	} else {
		winMessage.innerText = "Tie!"
	}
}