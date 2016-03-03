//create knockout model to bind to the search element												
function fsBusinessViewModel() {
	// set this to the self variable
 	var self = this;

	//set the bind-data to the search field to "Temple Bar"
	self.searchTerm = ko.observable('Temple Bar');

	//function to update the view model	
	self.updatefsResults = function(){
		//return the updated data from the search field
		//then run the ajax function to create the foursquare list
		ko.computed(function(){
			getVenues(self.searchTerm());
		}, self);
	},
	//
	self.getMyLocation = function(){
		//return the updated data from the search field
		//then run the ajax function to create the foursquare list
		ko.computed(function(){
			geoFindMe(self.searchTerm());
		}, self);
	}	
}

//Start knockout dependency tracking
ko.applyBindings(new fsBusinessViewModel());