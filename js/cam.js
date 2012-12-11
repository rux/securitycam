
var score = 0;



window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
$(document).ready(init());


function init() {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({video: true, audio: false}, onSuccess, onError);
}

function onSuccess(stream) {
	var video = document.getElementById("video");
	// Opera test - opera does it direct
	if (undefined === window.URL) {
		video.src = stream
	} else {
		video.src = window.URL.createObjectURL(stream);
	}
	video.autoplay = true;
	setInterval(takeTheShot, 100);
}
function onError() {
	console.log("Failed to get a stream");
}


function takeTheShot() {
	var vid = document.getElementById("video");

	var snap1 = document.getElementById("snap1"),
		snap2 = document.getElementById("snap2"),
		diff = document.getElementById("diff");

	var ctx1 = snap1.getContext("2d"),
		ctx2 = snap2.getContext("2d"),
		ctxDiff = diff.getContext("2d");

	// First copy from the last sample to the 2nd place, then populate the first with a new image;
	ctx2.drawImage(snap1, 0, 0, snap2.width, snap2.height);
	ctx1.drawImage(vid,0,0, snap1.width, snap1.height);

	// diff those puppies, draw that nonsense there like a boss
	imageDiffData = imagediff.diff(snap1, snap2);
	ctxDiff.putImageData(imageDiffData, 0, 0);

	// do we gots to go crazy here, boy?
	var movement = !(imagediff.equal(snap1, snap2, 140));	//the equal test returns true if the images are similar.
															// but I like it to be true when there's movement
	soundTheAlarm(movement);
}

function soundTheAlarm(theresSomethingMovingOutThere) {
	if (theresSomethingMovingOutThere) {
		score +=30;
	} else {
		score -= 5;
	}

	if (score > 255) {score = 255;}
	if (score < 0) {score = 0;}

	var minThreshold = 50, maxThreshold = 140;
	var unfilteredCol = ( -minThreshold + score * 255/(maxThreshold) );

	col = Math.round( unfilteredCol );
	if (col > 255) {col = 255;}
	if (col < 0) {col = 0;}

	if (score > maxThreshold) {
		$("#score").html("DANGER!");
	} else {

		$("#score").html("");
	}

	$("body").css("background-color", "rgb(" + col + ", 0, 0)");
}

