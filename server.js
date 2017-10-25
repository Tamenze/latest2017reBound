const express = require('express');
const app = express();
const Audiosearch = require('audiosearch-client-node');
const audiosearch = new Audiosearch(process.env.AUDIOSEARCH_APP_ID, process.env.AUDIOSEARCH_SECRET);
// const map = require('google_directions');
// const google = window.google

app.use("/", express.static('dist'))




app.get('/api/:origin/:destination', function(req, res){


	// console.log(req.params)

	// var directionsService = new google.maps.DirectionsService();
	// var directionsDisplay = new google.maps.DirectionsRenderer();

	// function map_out() {
	//   var selectedMode = "transit";

	//   var start = req.params.origin;
	//   var end = req.params.destination;

	//   var myOptions = {
	//    zoom:7,
	//    mapTypeId: google.maps.MapTypeId.ROADMAP
	//   }

	//   var map = new google.maps.Map(document.getElementById("map"), myOptions);
	//   directionsDisplay.setMap(map);

	//   var request = {
	//      origin: start, 
	//      destination: end,
	//      travelMode: google.maps.DirectionsTravelMode[selectedMode] 
	//   };


	//   directionsService.route(request, function(response, status) {
	//     if (status == google.maps.DirectionsStatus.OK) {

	//   //SETS DIRECTIONSDISPLAY (GLOBAL VARIABLE) TO BE THE RESPONSE RETURNED FROM THIS SPECIFIC ROUTE REQUEST
	//       directionsDisplay.setPanel(document.getElementById('directions'))
	//       directionsDisplay.setDirections(response)


	//       // DISPLAYS THE DISTANCE:
	//       document.getElementById('distance').innerHTML = "Distance: " +
	//       ((response.routes[0].legs[0].distance.value)*.000621371).toFixed(2) + " miles";

	//       // DISPLAYS THE DURATION:
	//       var duration_in_minutes =Math.floor((response.routes[0].legs[0].duration.value)*.0166667)
	//       document.getElementById('duration').innerHTML = "Duration: " + duration_in_minutes + " minutes";

	//       //TRANSFERS DURATION VALUE TO GENRE FORM
	//       // directionsDisplay.setDirections(response);
	//       // document.getElementsByName("triptime")[0].value = duration_in_minutes

	//       // drop_down();
	//     }
	//     else {
	//         window.alert('Directions request failed due to ' + status);
	//         directionsDisplay.setMap(null);
	//         directionsDisplay.set('directions', null);
	//       }

	//   })//end of directionsService function

	// };//end of map_out function

})

// app.get('/api/:origin/:destination', function(req, res){
// 	var params = {
// 		origin: `${req.params.origin}`,
// 		destination: `${req.params.destination}`,
// 		key: process.env.AUDIOSEARCH_GOOGLE_DIRECTIONS_KEY,

// 		mode:"transit",
// 		// language:"",
// 	};

// 	map.getDuration(params, function (err, data) {
// 		if (err) {
// 			console.log(err);
// 			return 1;
// 		}
// 		console.log("data ",data);
// 		res.json({googleData: data, test: "hello moto" })
// 	})

	// map.getDirectionSteps(params, function (err, steps){
 //    if (err) {
 //        console.log(err);
 //        return 1;
 //    }
 
 //    // parse the JSON object of steps into a string output 
 //    var output="";
 //    var stepCounter = 1;
 //    steps.forEach(function(stepObj) {
 //        var instruction = stepObj.html_instructions;
 //        instruction = instruction.replace(/<[^>]*>/g, ""); // regex to remove html tags 
 //        var distance = stepObj.distance.text;
 //        var duration = stepObj.duration.text;
 //        output += "Step " + stepCounter + ": " + instruction + " ("+ distance +"/"+ duration+")\n";
 //        stepCounter++;
 //    });	
 //    console.log(output);
	// });

// })


const qKey = 'categories.name';	
//later, will have to be gotten from the react state upon form submit. see twit tool for example.
// categories.name =Talk%20Show (encode uri used on value (aka qString) of drop down select)
//could also be [network.name]=NPR or [physical_location]=popuparchive NO. FUTURE FEATURE MAYBE

const qString = 'Arts';
//film
//the genre/pod type --> this should definitely get chosen by dropdown 

const qTerm = 'Oprah';
//will smith --> typed in 
 
const qDuration = 50;
//50 <-- will be from gmaps return, Not typed in.



//future, sort by
//https://www.audiosear.ch/api/search/episodes/trump?filters[network.name]=npr&range[duration]=45%2C60&sort_by=buzz_score&sort_order=asc

//next page help: https://github.com/popuparchive/audiosearch-cookbook/wiki/Searching-Episodes

// -user gets estimated duration of their trip from gmap api (i changed in audiosearch js so that search looks for 5 minutes lower or higher than duration)
  // -user is met with a drop down list and search bar to type things in 
  //   -if no search term typed in and no genre selected, validators stop your search and ask that you select something 
  //   -if a search term is typed in and no genre selected, searches using empty strings ("", "") as default values for genre (in filter function, triggers search using just typed query)
  //   -if a search is typed in and a genre selected, searches using all 


function getPods(params,res){
	console.log(params);
	audiosearch.filter('categories.name',params.qGenre, params.qTerm, '50')
    .then(function (results){
		console.log("pulling from audiosearch api");	
		var podcastList = results;
		console.log(podcastList);
		//dev only: log categories so i can keep manually adding to state for dropdown
		podcastList.results.forEach(function (x){
			console.log("urls ", x.urls);
			console.log("audios ", x.audio_files);
		})

	res.json({data: podcastList})
	})
}

function sortPods(params,res){
	if(!params.qSort){
		params.qSort = ""
	}
	console.log(params);
	audiosearch.filter('categories.name',params.qGenre, params.qTerm, '50',params.qSort)
    .then(function (results){
		console.log("pulling from audiosearch api");	
		var podcastList = results;
		// console.log(podcastList);
	res.json({data: podcastList})
	})
}


app.get('/api/:qGenre/:qTerm', function(req, res){
	getPods(req.params, res)
})

app.get('/api/:qGenre/:qTerm/:qSort', function(req, res){
	sortPods(req.params, res)
})

app.listen(3000);