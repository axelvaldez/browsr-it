// custom addEventHandler
function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}


// make area droppable
if(window.FileReader) { 
 	addEventHandler(window, 'load', function() {
	    var drop   = document.getElementById('drop');
	  	
	    function cancel(e) {
	      if (e.preventDefault) { e.preventDefault(); }
	      return false;
	    }
	  
	    // Tells the browser that we *can* drop on this target
	    addEventHandler(drop, 'dragover', cancel);
	    addEventHandler(drop, 'dragenter', cancel);
  	});
}
else{ 
  // no support, sorry
}

// process dropped image
addEventHandler(drop, 'drop', function (e) {
e = e || window.event; // get window.event if e argument missing (in IE)   
if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

var dt    = e.dataTransfer;
var files = dt.files;
for (var i=0; i<files.length; i++) {
var file = files[i];
var reader = new FileReader();
  
addEventHandler(reader, 'loadend', function(e, file) {
    addBrowserUI(this.result);
}.bindToEventHandler(file));


reader.readAsDataURL(file);
}
return false;
});

Function.prototype.bindToEventHandler = function bindToEventHandler() {
  var handler = this;
  var boundParameters = Array.prototype.slice.call(arguments);
  //create closure
  return function(e) {
      e = e || window.event; // get window.event if e argument missing (in IE)   
      boundParameters.unshift(e);
      handler.apply(this, boundParameters);
  }
};