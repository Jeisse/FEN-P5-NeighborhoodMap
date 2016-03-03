
//Initializing global variables
var map;
var lat = 53.345615;
var lng = -6.264155;
allMarkers = [];

//Main function to create google map		
function initialize() {
	//Set the variable for the starting point
	var startPoint = new google.maps.LatLng(lat, lng);
	var startSearch = 'Temple Bar';
	
	//Set the variable for the google map option
	var mapOptions = {
		zoom: 16,
		center: startPoint,
		disableDefaultUI: true
	};

	//Create a new map object
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 

	//Call function to start showing a foursquare list
	getVenues(startSearch);
}

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
		var infoWindowContent = '<div class="info_content">';
		infoWindowContent += '<h4>' + mk.title + '</h4>';
		infoWindowContent += '<p>' + mk.ph + '</p>';
		infoWindowContent += '<p class="review"><img src="' + mk.pic + '">' + mk.blurb + '</p>';
		infoWindowContent += '</div>';
		
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
			}
		})(mkr, i));

		//Apply google maps event method to bind a mouse click event to the marker
		//on event, create and show info window using the makeInfoWindow Method
		//and animate the marker        	        
		google.maps.event
		.addListener(mkr, 'click', (function(mk, i){
			return function(){
				makeInfoWindow(mk);
				toggleBounce(mk, i);
			}
		})(mkr, i));
	}

	//Function to animate the marker          
	function toggleBounce(mk, i) {
		//Create the variable       		
		var fsMarkerDetailUl =  $('.fs-list').find('ul'),
			fsMarkerDetail = fsMarkerDetailUl.find('li'),
			fsMarkerDetailPos = 212 * i,
			activefsMarkerDetail = fsMarkerDetail.eq(i);

		//If the marker has animation attribute then remove the animation attribute
		//also remove the show className from the fs-list ul dom to slide left
		//also remove the active className from the active fs-list ul li dom         
		if (mk.getAnimation() != null) {
			mk.setAnimation(null);
			fsMarkerDetailUl.removeClass('show');
			activefsMarkerDetail.removeClass('active');

		//If marker does not have animation attribue
		//remove animation attribute from any other markers that are animated
		//then set the animation attribute to the clicked marker
		//add the show className from the fs-list ul dom to slide right
		//also add the active className to the fs-list ul li dom         
		} else {
			for(am in allMarkers){
				// iterate through all the markers and see if it has the animation attribute
				var isMoving = allMarkers[am].getAnimation();
				//if marker is animating and index is not self
				//then set the animated marker's animation attribute to null
				if(isMoving && am !== i){
					allMarkers[am].setAnimation(null);
				}
			}
			
			//Add the Bounce animation to the clicked marker using google map's animation method
			//also add the show className from the fs-list ul dom to slide right and animate the child dom to the top
			//also add the active className to the fs-list ul li dom         			
			mk.setAnimation(google.maps.Animation.BOUNCE);
			fsMarkerDetailUl.addClass('show').animate({
				scrollTop: fsMarkerDetailPos
			}, 300);
			fsMarkerDetailUl.find('.active').removeClass('active');
			activefsMarkerDetail.addClass('active');
		}
	}

	//Add click event to the fs-list ul li dom         			
	$('.results').find('li').click(function(){
		//Get index of clicked element
		var pos = $(this).index();
		//Iterate through allMarkers array
		for(am in allMarkers){
			var isMoving = allMarkers[am].getAnimation();
			//If marker is animated, remove animation
			if(isMoving && am !== pos){
				allMarkers[am].setAnimation(null);
			}
		}

		//Add the Bounce animation to the marker that corresponding to the clicked element index
		//using google map's animation method, create and show the info window
		//also remove the active className from the active fs-list ul li dom
		//then add the active className to the clicked element         					
		allMarkers[pos].setAnimation(google.maps.Animation.BOUNCE);
		makeInfoWindow(allMarkers[pos]);
		$('.results').find('.active').removeClass('active');
		$(this).addClass('active');
	});	
}

//Ajax  to get Foursquare's data	
function fAjax(url){
	//Set timeout in case of fail
	var fAjaxRequestTimeout = setTimeout(function(){
		$('.results').addClass('open').append('<li><h3>Oh no!</br> Seems that we can\'t find anything.</h3></li>');
	},8000);

	$.ajax({
		type: "GET",
		url : url,
		dataType : 'jsonp',
		global : true,
		jsonpCallback : 'cb',
		success : function(data){
			makefoursquareList(data);
			clearTimeout(fAjaxRequestTimeout);
		}
	});
}

//Function to create the list from Foursquare's API
//takes returned data from the ajax as a parameter
function makefoursquareList(d){
	//Create the variable 	
	var $foursquareList = $('.results');
		results = d.response.groups[0].items,
		el = '';
		
	//Clear the foursquareList to add new entries
	$foursquareList.empty();

	//Create the markers Array object	
	var markers = [];

	//If no data is returned				
	if(results.length > 0){	
		//Loop through the returned data
		//then create the variable for to use in populating the fs-list li Dom					
		for (result in results){
			var business = results[result],
				name = business.venue.name,
				img = business.venue.categories[0].icon.prefix+'64'+business.venue.categories[0].icon.suffix,
				ph = business.venue.contact.formattedPhone ? business.venue.contact.formattedPhone : '',
				url = business.venue.url ? business.venue.url : '#',
				rate = business.venue.rating ? business.venue.rating : '0.0',
				canonicalUrl = business.tips[0].canonicalUrl ? business.tips[0].canonicalUrl : '#',
				loc = {
					lat: business.venue.location.lat,
					lon: business.venue.location.lng,
					address: business.venue.location.formattedAddress + '<br>' 
				}
				review = {
					img: business.venue.categories[0].icon.prefix+'64'+business.venue.categories[0].icon.suffix,
					txt: business.tips[0].text
				};
					
			//Create the Dom object									
			var makeEl = '<li><div class="heading row"><p class="col-sm-3 img-container">';
			makeEl += '<img src="' + img + '" height=100 width=100 class="img-thumbnail">';
			makeEl += '<span> Rate: '+ rate +'</span>';
			makeEl += '</p><div class="col-sm-9">';
			makeEl += '<h3>' + name + '</h3><p>';
			makeEl += '<span>' + loc.address + '</span></p>';
			makeEl += '<p><strong>' + ph + '</strong></p>';
			makeEl += '<p><a class="btn btn-default btn-xs" href="' + canonicalUrl + '" target="_blank">See Foursquare</a></p>';
			makeEl += '<p><a class="" href="' + url + '" target="_blank">See WebSite</a></p>';
			makeEl += '</div></div></li>';
			
			//Add to the el variable										
			el += makeEl;

			//Create the marker array object
			//then add marker to the markers array object												
	    	var marker = [name, ph, loc.lat, loc.lon, review.img, review.txt];
	    	markers.push(marker);
		}

		//Add the el to the fs-list ul dom												
		$foursquareList.append(el);
		
		//Use google map api to create the markers to place on the map												
		google.maps.event.addDomListener(window, 'load', addGoogleMapsMarkers(markers));
		
	//If no data is returned,
	//then create a error message												
	} else {
		var searchedFor = $('input').val();
		$foursquareList.addClass('open').append('<li><h3>Oh no! Seems that we can\'t find anything on <span>' + searchedFor + '</span>.</h3><p>Trying searching something else.</p></li>');

		//Use google map api to clear the markers on the map													
		google.maps.event.addDomListener(window, 'load', addGoogleMapsMarkers(markers));
	}
}

//Ajax function to get places/Venues on Foursquare API
function getVenues(search) {
	var config = {
		client_id: '1LJNHGRXVKQUREYLERJFYKAOCBEBJCOTRN5W5CGH5YN3P1AB',
		client_secret: 'PM5IMHDOH2OJ1T3ODPQWMAO3LN2AD4ELC2NQ255QUANZIAA0',
		query: search
	};
	var url = "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id="+config.client_id+"&client_secret="+config.client_secret+"&v=20160302&query="+config.query+"";

	fAjax(url);
}

//Find current location, using HTML5 Geolocation
function geoFindMe(search) {
	if (navigator.geolocation) {
		var location_timeout = setTimeout("geolocFail()", 10000);

		navigator.geolocation.getCurrentPosition(function(position) {
			clearTimeout(location_timeout);

			lat = position.coords.latitude;
			lng = position.coords.longitude;

			var startPoint = new google.maps.LatLng(lat, lng);

			//Set the variable for the google map option
			var mapOptions = {
				zoom: 16,
				center: startPoint,
				disableDefaultUI: true
			};

			//Create a new map object
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

			//Call getVenue to show places on the map and show the list
			getVenues(search);

		}, function(error) {
			clearTimeout(location_timeout);
		geolocFail();
		});
		} else {
		// Fallback for no geolocation
		geolocFail();
	}
}

function geolocFail(){
	var $foursquareList = $('.results');
	$foursquareList.addClass('open').append('<li><h3>Oh no! Seems that we can\'t find anything.</h3></li>');

	//Use google map api to clear the markers on the map													
	google.maps.event.addDomListener(window, 'load', addGoogleMapsMarkers(markers));

}

//Initialize app
initialize();
