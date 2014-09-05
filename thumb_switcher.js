(function(){
	
	function init(el){
		var switchSpeed = el.getAttribute("data-thumb-switch-speed");
		if (!switchSpeed){
			switchSpeed = 1000;
		}

		var orgSrc = el.src;
		var currentImage = 0;
		var limit = null;
		var timerRef;
		
		var fileName = orgSrc;
		var fileExtension = "";
		
		//get correct filename and extension
		if (orgSrc.substr(orgSrc.length-4,orgSrc.length).indexOf('.') != -1){
			var fileName = orgSrc.substr(0,~-orgSrc.lastIndexOf(".")+1)
			var fileExtension = "."+orgSrc.substr((~-orgSrc.lastIndexOf(".") >>> 0) + 2);
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
					currentImage = 0;
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
					if (currentImage ==0){
						el.removeEventListener("mouseover",mouseoverEvent);
						el.removeEventListener("mouseout",mouseoutEvent);
					}
					else{
						limit = currentImage; //make sure next time we don't try to load the nonexisting image
					    currentImage = 0;
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
			currentImage =0;
		}
		
		el.addEventListener("mouseover", mouseoverEvent);	
		el.addEventListener("mouseout", mouseoutEvent);
	}

	ready = function(f){/in/.test(document.readyState) ? setTimeout(function(){ f()},9):f()}
	
	ready(function(){
		var imageList = document.getElementsByClassName("thumb_switcher");
		 
		var len=imageList.length;
		for (i=0; i < len; i++){
			init(imageList[i]);
		}
	});	
})();