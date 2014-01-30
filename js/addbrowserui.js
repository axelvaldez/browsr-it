// Is ugly, but works a little better... At least passes JSLint test :)
;(function (window, document) {
    'use strict';

    var m,
        is_function = function (value) {
            return typeof value === 'function';
        },
        myObject = {
            // draws image window area and adds drop-shadow
            setWindowArea: function (ctx, x, y, w, h, r) {
                var i;
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
                for (i = 5; i >= 0; i -= 1) {
                    ctx.strokeStyle = 'rgba(0,0,0,.0' + (6 - i) + ')';
                    ctx.lineWidth = i;
                    ctx.stroke();
                }
            },
            // image preloader
            preloadImages: function (array) {
                var newimages = [],
                    loadedimages = 0,
                    postaction = function (v) { return v; },
                    arr = (typeof array !== 'object') ? [array] : array,
                    i;

                function imageloadpost() {
                    loadedimages += 1;
                    if (loadedimages === arr.length) {
                        postaction(newimages); //call postaction and pass in newimages array as parameter
                    }
                }

                function eventHandler() {
                    imageloadpost();
                }

                for (i = 0; i < arr.length; i += 1) {
                    newimages[i] = new Image();
                    newimages[i].src = arr[i];
                    newimages[i].onload = eventHandler;
                    newimages[i].onerror = eventHandler;
                }

                return { //return blank object with done() method
                    done: function (f) {
                        postaction = f || postaction; //remember user defined callback functions to be called when images load
                    }
                };
            },
            // load image files
            addBrowserUI: function (sourceImage) {
                var that = window;
                that.preloadImages([sourceImage, './img/chrome-top.png', './img/chrome-top-left.png', './img/chrome-top-right.png']).done(function (images) {
                    // set friendly names for images
                    var img = images[0],
                        imgTop = images[1],
                        imgTopLeft = images[2],
                        imgTopRight = images[3],
                        // set general variables
                        canvasPadding = 50,
                        browserHeaderHeight = imgTopLeft.height,
                        // browserWindowRadius = 5,
                        browserImgRight = imgTopRight.width,
                        browserRadius = 5,
                        browserTabText = "",
                        browserURL = "",
                        resultImg = document.getElementById('result'),
                        // set canvas
                        can = document.createElement('canvas'),
                        ctx = can.getContext('2d');


                    // set canvas size
                    can.width = img.width + canvasPadding * 2;
                    can.height = img.height + browserHeaderHeight + canvasPadding * 2;

                    // set window area for image
                    that.setWindowArea(ctx, canvasPadding, canvasPadding, img.width, img.height + browserHeaderHeight, browserRadius);
                    ctx.save();
                    ctx.clip();

                    // draw images into canvas
                    ctx.drawImage(img, canvasPadding, canvasPadding + browserHeaderHeight, img.width, img.height);
                    ctx.drawImage(imgTop, canvasPadding, canvasPadding, img.width, imgTop.height);
                    ctx.drawImage(imgTopLeft, canvasPadding, canvasPadding, imgTopLeft.width, imgTopLeft.height);
                    ctx.drawImage(imgTopRight, img.width + canvasPadding - browserImgRight, canvasPadding, imgTopRight.width, imgTopRight.height);

                    // draws tab title and url into canvas
                    ctx.font = 'normal 10pt Helvetica';
                    ctx.fillText(browserURL, 196, 109);

                    ctx.font = 'normal 8pt Helvetica';
                    ctx.fillText(browserTabText, 159, 79);

                    // exports canvas to result img
                    resultImg = document.createElement('img');
                    resultImg.src = can.toDataURL('image/png');
                    document.getElementById('results').appendChild(resultImg);
                });
            }
        };

    for (m in myObject) {
        if (myObject.hasOwnProperty(m)) {
            if (!is_function(window[m])) {
                window[m] = myObject[m];
            }
        }
    }
}(window, window.document));