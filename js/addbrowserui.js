// draws image window area and adds drop-shadow
function setWindowArea(x,y,w,h,r){
	// draws rounded rectangle
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();

	// adds drop shadow
	for (var i = 5; i >= 0; i--) {
		ctx.strokeStyle = 'rgba(0,0,0,.0' + (6 - i) + ')';
		ctx.lineWidth = i;
		ctx.stroke();
	};
}

// image preloader
function preloadImages(arr){
    var newimages=[],
    	loadedimages=0,
    	postaction=function(){},
    	arr=(typeof arr!="object")? [arr] : arr;

    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages) //call postaction and pass in newimages array as parameter
        }
    }

    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }

    return { //return blank object with done() method
        done:function(f){
            postaction=f || postaction //remember user defined callback functions to be called when images load
        }
    }
}

// load image files
function addBrowserUI(sourceImage){
	preloadImages([sourceImage, './img/chrome-top.png', './img/chrome-top-left.png', './img/chrome-top-right.png']).done(function(images){
		
		// set friendly names for images
		var img = images[0],
			imgTop = images[1],
			imgTopLeft = images[2],
			imgTopRight = images[3],
		// set general variables
			canvasPadding = 50,
			browserHeaderHeight = imgTopLeft.height,
			browserWindowRadius = 5,
			browserImgRight = 65,
			browserRadius = 5,
			browserTabText = "Nearsoft",
			browserURL = "nearsoft.com",
			resultImg = document.getElementById('result');
		// set canvas
			can = document.createElement('canvas'),
			ctx = can.getContext('2d');


		// set canvas size
		can.width = img.width + canvasPadding * 2;
		can.height = img.height + browserHeaderHeight + canvasPadding * 2;

		// set window area for image
	    setWindowArea(canvasPadding, canvasPadding, img.width, img.height + browserHeaderHeight, browserRadius);
	    ctx.save();
	    ctx.clip();

	    // draw images into canvas
	    ctx.drawImage(img, canvasPadding, canvasPadding + browserHeaderHeight, img.width, img.height);
		ctx.drawImage(imgTop, canvasPadding, canvasPadding, img.width, imgTop.height);
		ctx.drawImage(imgTopLeft, canvasPadding, canvasPadding, imgTopLeft.width, imgTopLeft.height);
		ctx.drawImage(imgTopRight, img.width + canvasPadding - browserImgRight, canvasPadding, imgTopRight.width, imgTopRight.height);
		
		// draws tab title and url into canvas
		ctx.font = 'normal 10pt Helvetica'; ctx.fillText(browserTabText, 196, 109);
		ctx.font = 'normal 8pt Helvetica'; ctx.fillText(browserTabText, 159, 79);

		// exports canvas to result img
		resultImg = document.createElement('img');
		resultImg.src = can.toDataURL('image/png');
		document.getElementById('results').appendChild(resultImg);
	});
}