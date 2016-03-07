var Location = function(data) {
	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;
	this.img = data.img;
	this.ph = data.ph;
	this.url = data.url;
	this.rate = data.rate;
	this.canonicalUrl = data.canonicalUrl;
	this.txtReview = data.txtReview;
	this.address = data.address;
	this.latLng = new google.maps.LatLng(this.lat, this.lng);

	this.marker = new google.maps.Marker({
					position: this.latLng,
					map: map,
					animation: google.maps.Animation.DROP,
					title: this.name,
					ph: this.ph,
					pic: this.ph,
					blurb: this.txtReview
	});
};

//create knockout model to bind to the search element												
function ViewModel() {
	// set this to the self variable
 	var self = this;

	//set the bind-data to the search field to "Temple Bar"
	self.searchTerm = ko.observable('Temple Bar');

	self.places = ko.observableArray([]);

	//function to update the view model	
	self.updatefsResults = function(){
		//return the updated data from the search field
		//then run the ajax function to create the foursquare list
		ko.computed(function(){
			getVenues(self.searchTerm());
		}, self);
	};

	//Get user current location
	self.getMyLocation = function(){
		ko.computed(function(){
			geoFindMe(self.searchTerm());
		}, self);
	};

	self.colapseNav = function(){
		ko.computed(function(){
			showOrHideNav();
		}, self);
	};
}

//Start knockout dependency tracking
ko.applyBindings(new ViewModel());
