function Cell(x, y, w)
{
	this.xPos = x;
	this.yPos = y;
	this.width = w;
	this.radius = w / 5;
	this.letterSize = floor(w / 2);
	this.letter = ' ';
	
	// kolor komorek
	this.color = [255, 255, 255];
}

Cell.prototype.show = function()
{
	stroke(0);
	fill(this.color);
	rect(this.xPos, this.yPos, this.width, this.width, this.radius);
	fill(0);
	textSize(this.letterSize);
	textAlign(CENTER, CENTER);
	text(this.letter, this.xPos + this.width * 0.5, this.yPos + this.width * 0.5);
}