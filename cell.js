function Cell(x, y, w, row, col)
{
	this.xPos = x;
	this.yPos = y;
	this.width = w;
	this.radius = w / 5;
	this.letterSize = floor(w / 2);
	this.letter = ' ';
	this.color = [255, 255, 255];
	
	this.yPos += col * (spacing / 2) + spacing;
	this.xPos += row * (spacing / 2) + spacing;
}

Cell.prototype.show = function()
{
	stroke(0);
	fill(this.color);
	rect(this.xPos, this.yPos, this.width, this.width, this.radius);
	fill(0);
	textSize(this.letterSize);
	textAlign(CENTER, CENTER);
	text(this.letter, this.xPos + this.width * 0.525, this.yPos + this.width * 0.525);
}