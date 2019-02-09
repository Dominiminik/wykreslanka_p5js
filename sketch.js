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
var spacing = 10;

function setup()
{	
	spacing = cellSize / 3;
	
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1) + 2 * spacing + (numOfCells - 1) * (spacing / 2), numOfCells * cellSize + 1 + 2 * spacing + (numOfCells - 1) * (spacing / 2));
	grid = makeBoard(numOfCells);
	
	createAndPositionElements();
	pixelDensity(2);
	styleConfiguration();
}

var boardSizeInput;
var cellSizeInput;
var wordsToFindInput;
var lettersReady = false;
var sidebarWordsReady = false;

function styleConfiguration()
{
	c.parent("canvas_section");
}

function createAndPositionElements()
{
	document.getElementById("info_p").innerHTML = `<li>bez dostarczenia pliku z danymi wyrazy losowane są z domyślnej listy 100 angielskich wyrazów</li>
												   <li>w celu wyświetlania polskich znaków należy ustawić kodowanie ładowanego pliku na UTF-8</li>
												   <li>format danych wejściowych: w pliku tekstowym każdy wyraz w nowej linii</li>
												   <li>aplikacja działa najlepiej w przeglądarkach Google Chrome, Opera i Microsoft Edge</li>
												   <li>w Mozilli Firefox występują rozmycia tekstu i spowolnione animacje</li>
												   <li>aplikacja nie działa w przeglądarce Internet Explorer</li>`;
		
	let table = createElement("table");
	
	let tableLeftColumn =
	[
		"Rozmiar planszy:",
		"Rozmiar komórki:",
		"Liczba wyrazów do znalezienia:",
		"Ukryj losowe litery:",
		"Pokaż listę wyrazów:",
		"Plik z danymi:",
	];
	
	let tableRightColumn =
	[
		"<input id=\"board_size_input\" type=\"number\" min=\"1\" max=\"50\" placeholder=\"1 - 50\">",
		"<input id=\"cell_size_input\" type=\"number\" min=\"1\" max=\"100\" placeholder=\"1 - 100\">",
		"<input id=\"num_of_words\" type=\"number\" min=\"1\" max=\"100\" placeholder=\"1 - 100\">",
		"<input type=\"checkbox\" onclick=\"hideShowLetters()\">",
		"<input type=\"checkbox\" checked=\"checked\" onclick=\"hideShowWords()\">",
		"<input type=\"file\" id=\"file_input\" style=\"display:none\" onchange=\"handleFiles()\" accept=\".txt\"><input id=\"file_button\" class=\"buttons\" type=\"button\" value=\"Wybierz plik\" onclick=\"document.getElementById('file_input').click();\">",
	];
	
	let tableData = "";
	
	let numberOfRows = tableLeftColumn.length == tableRightColumn.length ? tableLeftColumn.length : 0;
	
	for (let i = 0; i < numberOfRows; ++i)
	{
		tableData += "<tr><td class=\"left_column\">";
		tableData += tableLeftColumn[i];
		tableData += "</td><td class=\"right_column\">";
		tableData += tableRightColumn[i];
		tableData += "</td></tr>";
	}
	
	table.html(tableData);
	table.class("config_table");
	table.parent("table_section");
	
	let buttonsSection = "<button class=\"buttons\" type=\"button\" onclick=\"generate()\">Generuj</button><button class=\"buttons\" type=\"button\" onclick=\"saveGeneratedImage()\">Zapisz planszę</button>";
	let buttonsDiv = createElement("div");
	buttonsDiv.html(buttonsSection);
	buttonsDiv.class("buttons_section");
	buttonsDiv.parent("config_section");
}


function generate()
{
	boardSizeInput = document.getElementById("board_size_input");
	cellSizeInput = document.getElementById("cell_size_input");
	wordsToFindInput = document.getElementById("num_of_words");
	
	if (boardSizeInput.value == "")
	{
		boardSizeInput.value = "15";
	}
	else if (parseInt(boardSizeInput.value) > 50)
	{
		boardSizeInput.value = "50";	
	}
	else if (parseInt(boardSizeInput.value) < 5)
	{
		boardSizeInput.value = "5";	
	}
	
	if (cellSizeInput.value == "")
	{
		cellSizeInput.value = "30";
	}
	else if (parseInt(cellSizeInput.value) > 100)
	{
		cellSizeInput.value = "100";	
	}
	else if (parseInt(cellSizeInput.value) < 1)
	{
		cellSizeInput.value = "1";	
	}
	
	if (wordsToFindInput.value == "")
	{
		wordsToFindInput.value = "10";
	}
	else if (parseInt(wordsToFindInput.value) > 100)
	{
		wordsToFindInput.value = "100";	
	}
	else if (parseInt(wordsToFindInput.value) < 1)
	{
		wordsToFindInput.value = "1";	
	}
	
	numOfCells = parseInt(boardSizeInput.value) ? parseInt(boardSizeInput.value) : numOfCells;
	numOfCells = numOfCells > 50 ? 50 : numOfCells;
	numOfCells = numOfCells < 5 ? 5 : numOfCells;
	
	cellSize = parseInt(cellSizeInput.value) ? parseInt(cellSizeInput.value) : cellSize;
	cellSize = cellSize > 100 ? 100 : cellSize;
	cellSize = cellSize < 1 ? 1 : cellSize;
	
	numOfWordsToFind = parseInt(wordsToFindInput.value) ? parseInt(wordsToFindInput.value) : numOfWordsToFind;
	numOfWordsToFind = numOfWordsToFind > 100 ? 100 : numOfWordsToFind;
	numOfWordsToFind = numOfWordsToFind < 1 ? 1 : numOfWordsToFind;
	
	spacing = cellSize / 3;
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1) + 2 * spacing + (numOfCells - 1) * (spacing / 2), numOfCells * cellSize + 1 + 2 * spacing + (numOfCells - 1) * (spacing / 2));
	grid = makeBoard(numOfCells);
		
	loadWordsToGrid();
	generateLetters();
	
	lettersReady = true;
	
	if (rejectedWords.length > 0)
	{
		document.getElementById("rejected_words").innerHTML = rejectedWords.join(', ');
		document.getElementById("rejected").style.display = "inline";
		document.getElementById("rejected").classList.add("animatedButton");
	}
	else
	{
		document.getElementById("rejected").style.display = "none";
	}
	
	styleConfiguration();
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
	
	spacing = cellSize / 3;
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1) + 2 * spacing + (numOfCells - 1) * (spacing / 2), numOfCells * cellSize + 1 + 2 * spacing + (numOfCells - 1) * (spacing / 2));
	
	styleConfiguration();
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
	
	spacing = cellSize / 3;
	c = createCanvas(numOfCells * cellSize + (wordsOnTheSide ? textFieldSize * cellSize : 1) + 2 * spacing + (numOfCells - 1) * (spacing / 2), numOfCells * cellSize + 1 + 2 * spacing + (numOfCells - 1) * (spacing / 2));
	
	styleConfiguration();
	draw();
}


function saveGeneratedImage()
{
	save('wykreslanka.png');
}


var customWords;
var externalFile = false;

// handling a file provided by the user
function handleFiles()
{	
	var file = document.getElementById("file_input").files[0];
	var reader = new FileReader();
	
	reader.onload = function(e)
	{
		var text = reader.result;
		text = text.split('\n');
		getDataFromFile(text);
	}
	
	try
	{
		reader.readAsText(file, "ISO-8859-1");
	}
	catch (e) {  }
}

function getDataFromFile(text)
{
	externalFile = true;
	customWords = [];
	
	for (let i = 0; i < text.length; ++i)
	{
		customWords.push(String(text[i].trim()));
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
	spacing = cellSize / 3;
		
	for (var i = 0; i < numOfCells; ++i)
	{
		for (var j = 0; j < numOfCells; ++j)
		{
			grid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, i, j);	
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
			// alert('Błąd w generowaniu planszy (sprawdź wartości parametrów i poprawność danych w pliku)');
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
			// alert('Sprawdź poprawność danych w dołączonym pliku\n(każdy wyraz w osobnej linii)');
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
	
	sidebarWordsReady = true;
}


var randomLettersGrid;

// generating a random letter for empty cell
function generateLetters()
{
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	randomLettersGrid = makeBoard(numOfCells);
	
	spacing = cellSize / 3;
	
	for (let i = 0; i < numOfCells; ++i)
	{
		for (let j = 0; j < numOfCells; ++j)
		{
			randomLettersGrid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, i, j);
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
			try
			{
				if (lettersReady) hideRandomLetters ? grid[i][j].show() : randomLettersGrid[i][j].show();
			}
			catch (e)
			{
				console.log(e.message);	
			}
		}
	}
	
	if (wordsOnTheSide && sidebarWordsReady)
	{	
		textAlign(CENTER, TOP);
		text(getWordsForSidebar(), numOfCells * cellSize + 20 + 2 * spacing + (numOfCells - 1) * (spacing / 2), 20, cellSize * textFieldSize - 35, numOfCells * cellSize - 30);
	}
	
	noLoop();
}