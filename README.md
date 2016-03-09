# Neighborhood Project with Foursquare

This is a project for the Udacity front end nanodegree.  It is a neighborhood map of the Dublin/IE area and some points of interest in that area.

## Basic Instruction

1. Open the index.html file in a modern browser (chrome, firefox, ie11, etc.).
2. Click on list items or on the marks to select a location and retrieve info about it.
3. Type into the filter/search box to filter the shown locations.
4. Click anywhere on the actual map to close the information window that opens.
5. See places around you clicking on "Look arround on my current Location" button.

## Notes

* Screens smaller than 700px wide are treaded differently than large screens to help prevent blocking information with the list. 
* Most points have a review that will open in the infowindow if so.
* This tool uses Knockout, jquery, and also includes modernizr in hopes of further cross browser support.  A modern browser is still recommended.
* The page is responsive but it is not intended for mobile viewing on small devices.  If you are viewing on a mobile phone, landscape is recommended as the width of the list is fixed.
* Foursquare API powers the site information outside of the map and can get your current locatin to you best view
* Google maps api was used.
* Foursquare API was used to search places to then display on the Map
* To use the functionality "Look arround on my current Location" on Chrome when running app locally, you'll need to run the app on localhost. You can use Python's simpleHTTPServer, see this article to set up enviroment: http://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver/.