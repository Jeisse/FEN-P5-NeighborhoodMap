
var allMarkers = [];

//Main function to create and place markers on google map
//takes marker variable as a parameter		
function addGoogleMapsMarkers(m){  

	//Display multiple markers on a map
	var infoWindow = new google.maps.InfoWindow();

	//Function to create Info window for the google map marker
	//Takes the marker data as a parameter    
	function makeInfoWindow(mk){

		//Create the DOM element for the marker window
		//Uses marker data to create Business name, phone number, reviewer's picture, and reviewer's review    
		var infoWindowContent =	vm.updateContent(mk);
		
		//Google Map V3 method to set the content of the marker window
		//Takes above infoWindowContent variable as a parameter    		
		infoWindow.setContent(String(infoWindowContent));

		//Google Map V3 method to set the content of the marker window
		//Takes map and marker data variable as a parameter    		
		infoWindow.open(map, mk);
	}

	//Function delete all markers on the map    
	function deleteAllMarkers(){
		//Loops over all the markers on the map and use the google map method .setMap(null) to remove it    
		for(var i = 0, max=allMarkers.length; i < max; i++ ) {
			allMarkers[i].setMap(null);
		}
		
		//clears the allMarkers variable    	  
		allMarkers = [];
  	}
  
	//if all Markers variable contains any markers object, call the deleteAllMarkers function to remove it.      
	if(allMarkers.length > 0){
		deleteAllMarkers();
	}

	//Loop through our array of markers & place each one on the map
	for(var i = 0, max=m.length; i < max; i++ ) {
		//Create the position object
		var position = new google.maps.LatLng(m[i][2], m[i][3]);
		//Create the mkr object from the marker param
		var mkr = new google.maps.Marker({
						position: position,
						map: map,
								animation: google.maps.Animation.DROP,
						title: m[i][0],
						ph: m[i][1],
						pic: m[i][4],
						blurb: m[i][5]
			});
		// update allMarkers array variable with mkr object
		allMarkers.push(mkr);

		//Apply google maps event method to bind a mouseover event to the marker
		//on event, create and show info window using the makeInfoWindow Method         
		google.maps.event
		.addListener(mkr, 'mouseover', (function(mk, i) {
			return function() {
				makeInfoWindow(mk);
			};
		})(mkr, i));

		//Apply google maps event method to bind a mouse click event to the marker
		//on event, create and show info window using the makeInfoWindow Method
		//and animate the marker        	        
		google.maps.event
		.addListener(mkr, 'click', (function(mk, i){
			return function(){
				makeInfoWindow(mk);
				vm.toggleBounce(mk, i);
			};
		})(mkr, i));
	}

	//Add click event to the fs-list ul li dom         			
	$('.results').find('li').click(function(){
		//Get index of clicked element
		var pos = $(this).index();
		//Iterate through allMarkers array
		for(var am in allMarkers){
			var isMoving = allMarkers[am].getAnimation();
			//If marker is animated, remove animation
			if(isMoving && am !== pos){
				allMarkers[am].setAnimation(null);
			}
		}
	});	

}

