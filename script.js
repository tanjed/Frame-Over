let video = document.querySelector("#video");
let capture = document.querySelector("#capture");
let canvas = document.querySelector("#canvas");
let frameContainer = document.querySelector('#frame-container');

$(window).on('load',function(){ startCameraUpdated();})

$('#capture').click(function() { merge() });

// $('.frames').click(function(event){
// 	frameContainer.style.display = 'block';
// 	frameContainer.setAttribute('src',event.target.src)
// });

function setFrame(url)
{
	frameContainer.style.display = 'block';
	frameContainer.setAttribute('src',url)
}

$('#delete').click(function(){
	frameContainer.style.display = 'none';
	frameContainer.removeAttribute('src')
	$('#stream-section').show()
	$('#output-section').hide()
})

$('#save').click(function(){
	saveImage();
})

function startCameraUpdated()
{
	$(function () {
		// video = document.getElementById('vid');
		// video.style.width = document.width + 'px';
		// video.style.height = document.height + 'px';
		video.setAttribute('autoplay', '');
		video.setAttribute('muted', '');
		video.setAttribute('playsinline', '');
	
		var constraints = {
			 audio: false,
			 video: {
				facingMode: 'user',
			 }
		}
	
		navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
			video.srcObject = stream;
			let {width, height} = stream.getTracks()[0].getSettings();
			$('#canvas').attr('width',width) 
			$('#canvas').attr('height',height) 
			// STREAM_HEIGHT = height; 
			// STREAM_WIDTH = width;
			frameContainer.setAttribute('src','frames/frame1.png');
		});
	});
}


async function startCamera()
{
	video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
}

function loadFrames()
{
	$.ajax({ 
		type: "GET", 
		url: '/server/frames.php',
		dataType: 'json',
	}).then((response) => {
		if (response.status == 200) {
			$('.frames-container').append(response.frames)
		}
	});
	
}

function getMobileImage()
{
	var mobileImageCanvas = document.createElement("canvas");
	mobileImageCanvas.width = $(window).width();
	mobileImageCanvas.height = $(window).height();
	let mobileCanvasContext = mobileImageCanvas.getContext("2d");
	mobileCanvasContext.drawImage(video, 0, 0, mobileImageCanvas.width, mobileImageCanvas.height);
	let cameraImage = mobileImageCanvas.toDataURL('image/png');
	return cameraImage;
}

function getFrameImage()
{
	return frameContainer.src;
	// var frameImageCanvas = document.createElement("canvas");
	// frameImageCanvas.width = $(window).width();
	// frameImageCanvas.height = $(window).height();
	// let frameCanvasContext = frameImageCanvas.getContext("2d");
	// frameCanvasContext.drawImage(frameContainer, 0, 0, frameImageCanvas.width, frameImageCanvas.height);
	// let frameImage = frameImageCanvas.toDataURL('image/png');
	// return frameImage;
}

function merge() {
	
	var cameraImageObject = new Image();
	var frameImageObject = new Image();


	let canvasContext = canvas.getContext("2d");
	cameraImageObject.src = getMobileImage();
	cameraImageObject.onload = function() {
		canvasContext.drawImage(cameraImageObject, 0, 0, canvas.width, canvas.height);
		frameImageObject.src = getFrameImage();
		frameImageObject.onload = function() {
			canvasContext.drawImage(frameImageObject, 0, 0, canvas.width, canvas.height);
		}
	};

	$('#stream-section').hide()
	$('#output-section').show()
  }


function saveImage()
{        
	let image = canvas.toDataURL("image/png");
	var a = document.createElement("a"); //Create <a>
	a.href = image; //Image Base64 Goes here
	a.download = "Image"+Math.floor((Math.random() * 100) + 1);+".png"; //File name Here
	a.click(); //Downloaded file
	$.ajax({ 
		type: "POST", 
		url: '/server/store.php',
		dataType: 'json',
		data: {
			image : image 
		}
	}).then((response) => {
		if (response.status == 200) {
// 			alert('Saved Successfully!')
			frameContainer.style.display = 'none';
			frameContainer.removeAttribute('src')
			$('#stream-section').show()
			$('#output-section').hide()
		}
	});
}  
  

