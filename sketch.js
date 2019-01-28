var numOfWordsToFind = 10;
var cellSize = 30;
var numOfCells = 15;
var wordsOnTheSide = true;
var backgroundColor = [255, 255, 255];
var hideRandomLetters = false;
var saveImage = false;

var grid;
var wordsList = [];
var textFieldSize = 7;
var c;

function setup()
{	
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1), numOfCells * cellSize + 1);
	grid = makeBoard(numOfCells);
	
	createAndPositionElements();
	
	pixelDensity(2);
}

var boardSizeInput;
var cellSizeInput;
var wordsToFindInput;
var saveFileCheckbox;
var hideLettersCheckbox;
var showWordsCheckbox;
var generateButton;
var saveButton;
var fileInput;
var labels;
var additionalNotes;
var failedWords;
var title;
var startX = 240;
var startY = numOfCells * cellSize + 78;
var fieldSize = 50;
var offset = 23;

function createAndPositionElements()
{
	title = createElement('h2', 'Generator wykreślanek');
	title.attribute('class', 'title');
	title.position(0, 0);
	
	labels = createElement('p', 'Rozmiar planszy:<br>Rozmiar komórki:<br>Liczba wyrazów do znalezienia:<br>Ukryj losowe litery:<br>Pokaż listę wyrazów:<br>Plik z danymi:');
	labels.attribute('class', 'labels');
	labels.position(0, numOfCells * cellSize + 60);
	
	additionalNotes = createElement('ul', '<b>Uwagi:</b><li>bez dostarczenia pliku z danymi wyrazy losowane są z domyślnej listy 100 angielskich wyrazów</li><li>w celu wyświetlania polskich znaków należy ustawić kodowanie ładowanego pliku na UTF-8</li><li>format danych wejściowych: w pliku tekstowym każdy wyraz w nowej linii</li><li>jeśli poszukiwanie miejsca dla wyrazu trwa zbyt długo, zostaje on odrzucony i wyświetlony na czerwonej liście (w przypadku, gdy po kilku próbach wyrazy nadal są odrzucane, należy zwiększyć rozmiar planszy lub zmniejszyć ilość słów)</li>');
	additionalNotes.attribute('class', 'notes');
	additionalNotes.position(0, startY + 20 * 8);
	
	failedWords = createElement('p', '<b>Niezapisane słowa:</b><br>');
	failedWords.attribute('class', 'failed');
	failedWords.hide();
	
	boardSizeInput = createInput(numOfCells);
	boardSizeInput.size(fieldSize);
	boardSizeInput.position(startX, startY);
	boardSizeInput.attribute('min', '1');
	boardSizeInput.attribute('max', '50');
	boardSizeInput.attribute('type', 'number');
	
	cellSizeInput = createInput(cellSize);
	cellSizeInput.size(fieldSize);
	cellSizeInput.position(startX, startY + offset);
	cellSizeInput.attribute('min', '1');
	cellSizeInput.attribute('max', '100');
	cellSizeInput.attribute('type', 'number');
	
	wordsToFindInput = createInput(numOfWordsToFind);
	wordsToFindInput.size(fieldSize);
	wordsToFindInput.position(startX, startY + offset * 2);
	wordsToFindInput.attribute('min', '1');
	wordsToFindInput.attribute('max', '100');
	wordsToFindInput.attribute('type', 'number');
	
	hideLettersCheckbox = createCheckbox('', hideRandomLetters);
	hideLettersCheckbox.position(startX + 0.37 * fieldSize, startY + offset * 3 + 4);
	hideLettersCheckbox.changed(hideShowLetters);
	
	showWordsCheckbox = createCheckbox('', wordsOnTheSide);
	showWordsCheckbox.position(startX + 0.37 * fieldSize, startY + offset * 4 + 5);
	showWordsCheckbox.changed(hideShowWords);
	
	generateButton = createButton('Generuj');
	generateButton.attribute('class', 'gen_button');
	generateButton.position(startX + 170, startY + offset * 2 + 10);
	generateButton.mousePressed(generate);
	
	saveButton = createButton('Zapisz');
	saveButton.attribute('class', 'gen_button');
	saveButton.position(generateButton.x + generateButton.width + 30, generateButton.y);
	saveButton.mousePressed(saveGeneratedImage);
	
	fileInput = createFileInput(handleFile);
	fileInput.position(startX, startY + offset * 5 + 6);
}


function generate()
{
	numOfCells = boardSizeInput.value() ? parseInt(boardSizeInput.value()) : numOfCells;
	numOfCells = numOfCells > 50 ? 50 : numOfCells;
	numOfCells = numOfCells < 5 ? 5 : numOfCells;
	
	cellSize = cellSizeInput.value() ? parseInt(cellSizeInput.value()) : cellSize;
	cellSize = cellSize > 100 ? 100 : cellSize;
	cellSize = cellSize < 1 ? 1 : cellSize;
	
	numOfWordsToFind = wordsToFindInput.value() ? parseInt(wordsToFindInput.value()) : numOfWordsToFind;
	numOfWordsToFind = numOfWordsToFind > 100 ? 100 : numOfWordsToFind;
	numOfWordsToFind = numOfWordsToFind < 1 ? 1 : numOfWordsToFind;
	
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1), numOfCells * cellSize + 1);
	grid = makeBoard(numOfCells);
	
	startY = numOfCells * cellSize + 78;
	
	labels.position(0, numOfCells * cellSize + 60);
	boardSizeInput.position(startX, startY);
	cellSizeInput.position(startX, startY + offset);
	wordsToFindInput.position(startX, startY + offset * 2);
	hideLettersCheckbox.position(startX + 0.37 * fieldSize, startY + offset * 3 + 4);
	showWordsCheckbox.position(startX + 0.37 * fieldSize, startY + offset * 4 + 5);
	generateButton.position(startX + 170, startY + offset * 2 + 10);
	saveButton.position(generateButton.x + generateButton.width + 30, generateButton.y);
	fileInput.position(startX, startY + offset * 5 + 6);
	
	loadWordsToGrid();
	generateLetters();
	
	if (rejectedWords.length > 0)
	{
		failedWords.html('<b>Niezapisane słowa:</b><br>' + rejectedWords.join(', '));
		failedWords.position(0, startY + 20 * 8);
		failedWords.show();
		additionalNotes.position(0, startY + 20 * 8 + failedWords.size().height + 20);
	}
	else
	{
		additionalNotes.position(0, startY + 20 * 8);
		failedWords.hide();
	}
	
	draw();
}


function hideShowWords()
{
	if (wordsOnTheSide)
	{
		wordsOnTheSide = false;
	}
	else
	{
		wordsOnTheSide = true;
	}
	
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1), numOfCells * cellSize + 1);

	draw();
}


function hideShowLetters()
{
	if (hideRandomLetters)
	{
		hideRandomLetters = false;
	}
	else
	{
		hideRandomLetters = true;
	}
	
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1), numOfCells * cellSize + 1);
	
	draw();
}


function saveGeneratedImage()
{
	save('wykreslanka.png');
}


var customWords;
var externalFile = false;

// handling a file provided by the user
function handleFile(file)
{
	if (file.type != 'text')
	{
		alert('Nieprawidłowy format pliku.');
		externalFile = false;
		return;
	}
	
	externalFile = true;
	customWords = [];
	let tempArray = [];
	
	for (let i = 0; i < file.data.length; ++i)
	{
		tempArray.push(file.data[i]);
	}
	
	var s = tempArray.join('');
	s = s.split('\n');
	
	for (let i = 0; i < s.length; ++i)
	{
		var word = String(s[i]);
		word = word.replace(/\s/g, '');
		customWords.push(word);
	}
}


// creating square grid of given size
function makeBoard(size)
{
	var arr = new Array(size);
	
	for (var i = 0; i < arr.length; ++i)
	{
		arr[i] = new Array(size);
	}
	
	return arr;
}


var data;


// preloading data from json file
function preload()
{
	data = loadJSON("words.json");
}


// filling words array with words from file
function loadFromFile()
{
	var wordData = data.words;
	
	for (var i = 0; i < wordData.length; ++i)
	{
		wordsList.push(wordData[i]);
	}
}


var xPos, yPos;
var rejectedWords = [];

// loading words from file and writing them onto the grid
function loadWordsToGrid()
{
	for (var i = 0; i < numOfCells; ++i)
	{
		for (var j = 0; j < numOfCells; ++j)
		{
			grid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize);	
		}
	}
	
	loadFromFile();
	
	var availableWords = [];
	rejectedWords = [];
	
	getDistinctWords(availableWords);
	
	while (availableWords.length)
	{
		let index = floor(random() * availableWords.length);
		var availableDirections = [];
		var complete = false;
		var counter = 0;
		
		do
		{
			availableDirections = findLocationAndDirection(availableWords[index]);
			complete = writeWord(availableWords[index], availableDirections);
			
			++counter;
			
			if (counter > numOfCells * numOfCells * 4)
			{
				wordsCopy.splice(wordsCopy.indexOf(availableWords[index]), 1);
				rejectedWords.push(availableWords[index]);
				break;
			}
			
		} while (!complete);
		
		availableWords.splice(index, 1);
	}
}


var directions = {N: 1, NE: 2, E: 3, SE: 4, S: 5, SW: 6, W: 7, NW: 8};


// randomly choosing x, y coordinates on the grid
// and getting a list of available directions for the current word
function findLocationAndDirection(word)
{
	var validDirections = [];
	var done = false;
	
	var inf = 0;
	
	// finding available location
	while (!done)
	{	
		xPos = floor(random() * numOfCells);
		yPos = floor(random() * numOfCells);
		
		if (++inf > 1000)
		{
			alert('Błąd w generowaniu planszy (nieprawidłowe wartości lub błąd wewnętrzny)');
			return;
		}
		
		if (grid[xPos][yPos].letter == ' ' || grid[xPos][yPos].letter == word[0])
		{
			let horiz = true, vert = true, diag1 = true, diag2 = true, diag3 = true, diag4 = true;
			
			// check horizontally
			if (numOfCells - xPos < word.length && xPos + 1 < word.length)
			{
				horiz = false;
			}
			
			// check vertically
			if (numOfCells - yPos < word.length && yPos + 1 < word.length)
			{
				vert = false;
			}
			
			// check SE
			if (numOfCells - xPos < word.length || numOfCells - yPos < word.length)
			{
				diag1 = false;
			}
			
			// check NW
			if (xPos + 1 < word.length || yPos + 1 < word.length)
			{
				diag2 = false;
			}
			
			// check NE
			if (numOfCells - xPos < word.length || yPos + 1 < word.length)
			{
				diag3 = false;
			}
			
			// check SW
			if (xPos + 1 < word.length || numOfCells - yPos < word.length)
			{
				diag4 = false;
			}
			
			if (horiz || vert || diag1 || diag2 || diag3 || diag4)
			{
				done = true;
			}
		}
	}
	
	// adding available directions
	if (numOfCells - xPos >= word.length)
	{
		validDirections.push(directions.E);
	}
	
	if (xPos + 1 >= word.length)
	{
		validDirections.push(directions.W);
	}
	
	if (numOfCells - yPos >= word.length)
	{
		validDirections.push(directions.S);
	}
	
	if (yPos + 1 >= word.length)
	{
		validDirections.push(directions.N);
	}
	
	if (numOfCells - xPos >= word.length && numOfCells - yPos >= word.length)
	{
		validDirections.push(directions.SE);
	}
	
	if (xPos + 1 >= word.length && yPos + 1 >= word.length)
	{
		validDirections.push(directions.NW);
	}
	
	if (numOfCells - xPos >= word.length && yPos + 1 >= word.length)
	{
		validDirections.push(directions.NE);
	}
	
	if (xPos + 1 >= word.length && numOfCells - yPos >= word.length)
	{
		validDirections.push(directions.SW);
	}
	
	return validDirections;
}


// checking if the word fits in the current position and direction,
// if it does - writing it
function writeWord(word, availableDirections)
{
	var dir;
	
	while (availableDirections.length)
	{	
		let ready = false;
		let index = floor(random() * availableDirections.length);
		
		dir = availableDirections[index];
		availableDirections.splice(index, 1);
		
		var currentX, currentY, state, xVal, yVal;
		
		currentX = xPos;
		currentY = yPos;
		state = true;
		
		switch (dir)
		{
			case directions.N:
			{
				xVal = 0;
				yVal = -1;
				
				break;
			}
				
			case directions.NE:
			{
				xVal = 1;
				yVal = -1;
				
				break;
			}
				
			case directions.E:
			{
				xVal = 1;
				yVal = 0;
				
				break;
			}
				
			case directions.SE:
			{
				xVal = 1;
				yVal = 1;
				
				break;
			}
				
			case directions.S:
			{
				xVal = 0;
				yVal = 1;
				
				break;
			}
				
			case directions.SW:
			{
				xVal = -1;
				yVal = 1;
				
				break;
			}
				
			case directions.W:
			{
				xVal = -1;
				yVal = 0;
				
				break;
			}
				
			case directions.NW:
			{
				xVal = -1;
				yVal = -1;
				
				break;
			}
		}
		
		for (let i = 0; i < word.length; ++i)
		{
			if (grid[currentX][currentY].letter != ' ' && grid[currentX][currentY].letter != word[i])
			{
				state = false;
				break;
			}
			else
			{
				currentX += xVal;
				currentY += yVal;
			}
		}
		
		if (state)
		{
			currentX = xPos;
			currentY = yPos;
			
			for (let i = 0; i < word.length; ++i)
			{
				grid[currentX][currentY].letter = word[i].toUpperCase();
				
				currentX += xVal;
				currentY += yVal;
			}
			
			ready = true;
		}
		
		if (ready)
		{
			return true;
		}
	}
	
	return false;
}


var wordsCopy;

// creating an array of distinct words for the grid
function getDistinctWords(availableWords)
{
	var count;
	
	customWords = Array.from(new Set(customWords));
	
	if (externalFile)
	{
		count = numOfWordsToFind < customWords.length ? numOfWordsToFind : customWords.length;
		
		if (count == customWords.length)
		{
			for (let i = 0; i < customWords.length; ++i)
			{
				if (customWords[i].length < 1)
				{
					--count;
				}
			}
		}
	}
	else
	{
		count = numOfWordsToFind < wordsList.length ? numOfWordsToFind : wordsList.length;
		
		if (count == wordsList.length)
		{
			for (let i = 0; i < wordsList.length; ++i)
			{
				if (wordsList[i].length < 1)
				{
					--count;
				}
			}
		}
	}
	
	wordsCopy = [];
	var inf = 0;
	
	while (availableWords.length < count)
	{		
		var word;
		
		if (externalFile)
		{
			word = customWords[floor(random() * customWords.length)];
		}
		else
		{
			word = wordsList[floor(random() * wordsList.length)];
		}
		
		if (++inf > 1000)
		{
			alert('Błąd w generowaniu planszy (nieprawidłowe wartości lub błąd wewnętrzny)');
			return;
		}
		
		if (word.length > numOfCells || availableWords.includes(word) || word.length < 1)
		{
			continue;
		}
		else
		{
			availableWords.push(word);
			wordsCopy.push(word);
		}
	}
}


var randomLettersGrid;

// generating a random letter for empty cell
function generateLetters()
{
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	randomLettersGrid = makeBoard(numOfCells);
	
	for (let i = 0; i < numOfCells; ++i)
	{
		for (let j = 0; j < numOfCells; ++j)
		{
			randomLettersGrid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize);
			randomLettersGrid[i][j].letter = grid[i][j].letter;
		}
	}
	
	for (var i = 0; i < numOfCells; ++i)
	{
		for (var j = 0; j < numOfCells; ++j)
		{
			if (grid[i][j].letter == ' ')
			{
				randomLettersGrid[i][j].letter = letters[floor(random() * letters.length)];
			}
		}
	}
}


// generating a list of words for the sidebar
function getWordsForSidebar()
{
	let out = "";
		
	for (let i = 0; i < wordsCopy.length - 1; ++i)
	{
		out += wordsCopy[i];
		out += ", ";
	}
			
	out += wordsCopy[wordsCopy.length - 1];
	
	return out;
}


// drawing the grid, showing words on the sidebar (if flag is set to true)
// and saving the image to file (if flag is set to true)
function draw()
{
	background(backgroundColor);
	
	for (let i = 0; i < grid.length; ++i)
	{
		for (let j = 0; j < grid[i].length; ++j)
		{
			if (hideRandomLetters)
			{
				grid[i][j].show();
			}
			else
			{
				randomLettersGrid[i][j].show();
			}
		}
	}
	
	if (wordsOnTheSide)
	{	
		textAlign(CENTER, TOP);
		text(getWordsForSidebar(), numOfCells * cellSize + 20, 20, cellSize * textFieldSize - 35, numOfCells * cellSize - 30);
	}
	
	noLoop();
}
