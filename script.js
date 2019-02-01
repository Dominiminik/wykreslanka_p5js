function showOverlay()
{
	document.getElementById("info").style.width = "100%";
	document.getElementById("info").style.opacity = "1.0";
	document.getElementById("info").style.left = "0";
}

function hideOverlay()
{
	document.getElementById("info").style.width = "0";
	document.getElementById("info").style.opacity = "0";
	document.getElementById("info").style.left = "-100px";
	document.getElementById("info_p").style.left = "0";
}

function showRejected()
{
	document.getElementById("rej_div").style.width = "30%";
	document.getElementById("rej_div").style.height = "auto";
	document.getElementById("rejected").classList.remove("animatedButton");
	document.getElementById("rej_div").style.left = "10%";
}

function hideRejected()
{
	document.getElementById("rej_div").style.left = "-100%";
}

window.onload = function()
{
	document.getElementById("about").addEventListener("click", function() { showOverlay(); }, false);
	document.getElementById("about_hide").addEventListener("click", function() { hideOverlay(); }, false);
	document.getElementById("rejected").addEventListener("click", function() { showRejected(); }, false);
	document.getElementById("rejected_hide").addEventListener("click", function() { hideRejected(); }, false);
}