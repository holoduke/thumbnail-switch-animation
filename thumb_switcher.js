(function(){
	
	var elEventListeners = [];
	
	function addEventListeners(el,mouseover,mouseout){
		console.log('add event ',el)
		elEventListeners.push({'el':el,'mouseover':mouseover,'mouseout':mouseout});
		el.addEventListener("mouseover", mouseover);	
		el.addEventListener("mouseout", mouseout);
	}
	
	function removeEventListeners(el){
		
		
		for(var i=elEventListeners.length-1; i >=0 ;i--){
			
			if (elEventListeners[i].el == el){
				el.removeEventListener("mouseover",elEventListeners[i].mouseover);
				el.removeEventListener("mouseout",elEventListeners[i].mouseout);
				
				elEventListeners.splice(i,1);
			}
		}	
	}
	
	function reset(){
		for(var i=elEventListeners.length-1; i >=0 ;i--){
			console.log(elEventListeners[i]);
			elEventListeners[i].el.removeEventListener("mouseover",elEventListeners[i].mouseover);
			elEventListeners[i].el.removeEventListener("mouseout",elEventListeners[i].mouseout);
			elEventListeners.splice(i,1);
		}		
	}
	
	function init(el){
		var switchSpeed = el.getAttribute("data-thumb-switch-speed");
		var alternativeHost = el.getAttribute("data-thumb-host");
		if (!switchSpeed){
			switchSpeed = 1000;
		}

		var orgSrc = el.src;
		var currentImage = 1;
		var limit = null;
		var timerRef;
		
		var fileName = orgSrc;
		var fileExtension = "";
		
		//get correct filename and extension
		if (orgSrc.substr(orgSrc.length-4,orgSrc.length).indexOf('.') != -1){
			var fileName = orgSrc.substr(0,~-orgSrc.lastIndexOf(".")+1)
			var fileExtension = "."+orgSrc.substr((~-orgSrc.lastIndexOf(".") >>> 0) + 2);
		}
		
		if (alternativeHost){
			var switchImageUrl = document.createElement('a');
			var orgImageUrl = document.createElement('a');
			switchImageUrl.href = alternativeHost;
			var orgFilename = fileName.split('/').pop();
			var path = switchImageUrl.protocol+"//"+switchImageUrl.hostname+switchImageUrl.pathname+"/";
			var fileName = path + orgFilename;
		}
		
		var mouseoverEvent = function(e){		
	
			function startRotating(){
		
				//rerun the rotating method after x ms
				var delayedRerun = function(){
					timerRef = setTimeout(function(){
						startRotating();
					},switchSpeed);
				}
				
				newFile = fileName+"-"+currentImage+fileExtension;
		
				//if we have a limit (known when try to load an non existant image) we reset to first image
				if (currentImage == limit){
					currentImage = 1;
				    el.src = orgSrc;
				    return delayedRerun();
				}
				//try to load the image file
				//if image can be loaded we attach it to the element and schedule next rotation
				//if image can not be found we either restart or stop depending if any images can be found
				var nImg = document.createElement('img');
				nImg.onload = function() {
				    el.src = newFile;
				    currentImage++;
				    delayedRerun(); 
				}
				nImg.onerror = function() {
					
					//no roting images found at all
					if (currentImage ==1){
						removeEventListeners(el);
						//el.removeEventListener("mouseover",mouseoverEvent);
						//el.removeEventListener("mouseout",mouseoutEvent);
					}
					else{
						limit = currentImage; //make sure next time we don't try to load the nonexisting image
					    currentImage = 1;
					    el.src = orgSrc;
					    delayedRerun();
					}
				}
				
				nImg.src = newFile;
			}
			clearTimeout(timerRef);
			startRotating();
		};
		
		var mouseoutEvent = function(){
			clearTimeout(timerRef);
			el.src = orgSrc;	
			currentImage = 1;
		}
		addEventListeners(el,mouseoverEvent,mouseoutEvent)
		//el.addEventListener("mouseover", mouseoverEvent);	
		//el.addEventListener("mouseout", mouseoutEvent);
	}
	
	window.ThumbSwitcher = {};
	window.ThumbSwitcher.init = function(){
		
		reset();
		var imageList = document.getElementsByClassName("thumb_switcher");

		var len=imageList.length;
		for (i=0; i < len; i++){
			init(imageList[i]);
		}		
	}
	
	window.ThumbSwitcher.reset = function(){
		reset();
	}
	
	var domReady = (function() {

	    var w3c = !!document.addEventListener,
	        loaded = false,
	        toplevel = false,
	        fns = [];
	    
	    if (w3c) {
	        document.addEventListener("DOMContentLoaded", contentLoaded, true);
	        window.addEventListener("load", ready, false);
	    }
	    else {
	        document.attachEvent("onreadystatechange", contentLoaded);
	        window.attachEvent("onload", ready);
	        
	        try {
	            toplevel = window.frameElement === null;
	        } catch(e) {}
	        if ( document.documentElement.doScroll && toplevel ) {
	            scrollCheck();
	        }
	    }
	
	    function contentLoaded() {
	        (w3c)?
	            document.removeEventListener("DOMContentLoaded", contentLoaded, true) :
	            document.readyState === "complete" && 
	            document.detachEvent("onreadystatechange", contentLoaded);
	        ready();
	    }
	    
	    // If IE is used, use the trick by Diego Perini
	    // http://javascript.nwbox.com/IEContentLoaded/
	    function scrollCheck() {
	        if (loaded) {
	            return;
	        }
	        
	        try {
	            document.documentElement.doScroll("left");
	        }
	        catch(e) {
	            window.setTimeout(arguments.callee, 15);
	            return;
	        }
	        ready();
	    }
	    
	    function ready() {
	        if (loaded) {
	            return;
	        }
	        loaded = true;
	        
	        var len = fns.length,
	            i = 0;
	            
	        for( ; i < len; i++) {
	            fns[i].call(document);
	        }
	    }
	    
	    return function(fn) {
	        // if the DOM is already ready,
	        // execute the function
	        return (loaded)? 
	            fn.call(document):      
	            fns.push(fn);
	    }
	})();

	domReady(function(){window.ThumbSwitcher.init();})
	
})();