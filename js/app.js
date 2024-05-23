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
const score = document.getElementById("score")

let prevFigure = null
let currentFigure = null

let scoreCounter = 0

let guessedCards = []
let hasCardsShuffled = true

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
				scoreCounter += 1
				guessedCards.push(currentFigure, prevFigure)
			} else {
				scoreCounter -= 1

				setTimeout((prevFigure, currentFigure) => {
					prevFigure.classList.remove("active")
					currentFigure.classList.remove("active")
				}, 750, prevFigure, currentFigure)
			}

			prevFigure = null
			currentFigure = null
		}

		score.innerText = scoreCounter.toString()

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

function reset() {
	scoreCounter = 0
	score.innerText = scoreCounter.toString()

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
}

function win() {
	confetti.start(10000000, 0, 450)
}