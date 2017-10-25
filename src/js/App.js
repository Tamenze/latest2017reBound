import React, { Component } from 'react';
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCc0PiUzO6wLvxB7sDQyKURtgonb_juQSE&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();
      const DirectionsDisplay = new google.maps.DirectionsRenderer();

      DirectionsService.route({
        origin: new google.maps.LatLng(41.8507300, -87.6512600),
        //change origin, destination, and travel mode with react input
        destination: new google.maps.LatLng(41.8525800, -87.6514100),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            console.log(result)
            DirectionsDisplay.setPanel(document.getElementById('directions'))
            DirectionsDisplay.setDirections(result)
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        origin:"",
        destination:"",
        duration:"",
        genreTerm: " ",
        searchTerm: " ",
        sortBy:"",
      results: {
        query: "",
        results: []
      },
      categories: {
        "0": {
            "name": "Arts",
            "sub": [
                "Comedy",
                "Design",
                "Fashion & Beauty",
                "Food",
                "Literature",
                "Performing Arts",
                "TV & Film",
                "Visual Arts"
            ]
        },
        "1": {
            "name": "Business",
            "sub": [
                "Business News",
                "Careers",
                "Investing",
                "Management & Marketing",
                "Shopping"
            ]
        },
        "2": {
            "name": "Education",
            "sub": [
                "Educational Technology",
                "Higher Education",
                "K-12",
                "Language Courses",
                "Training"
            ]
        },
        "3": {
            "name": "Games & Hobbies",
            "sub": [
                "Automotive",
                "Aviation",
                "Hobbies",
                "Other Games",
                "Video Games"
            ]
        },
        "4": {
            "name": "Government & Organizations",
            "sub": [
                "Local",
                "National",
                "Non-Profit",
                "Regional"
            ]
        },
        "5": {
            "name": "Health",
            "sub": [
                "Alternative Health",
                "Fitness & Nutrition",
                "Self-Help",
                "Sexuality"
            ]
        },
        "6": {
            "name": "Kids & Family",
            "sub": false
        },
        "7": {
            "name": "Music",
            "sub": false
        },
        "8": {
            "name": "News & Politics",
            "sub": false
        },
        "9": {
            "name": "Religion & Spirituality",
            "sub": [
                "Buddhism",
                "Christianity",
                "Hinduism",
                "Islam",
                "Judaism",
                "Other",
                "Spirituality"
            ]
        },
        "10": {
            "name": "Science & Medicine",
            "sub": [
                "Medicine",
                "Natural Sciences",
                "Social Sciences"
            ]
        },
        "11": {
            "name": "Society & Culture",
            "sub": [
                "History",
                "Personal Journals",
                "Philosophy",
                "Places & Travel"
            ]
        },
        "12": {
            "name": "Sports & Recreation",
            "sub": [
                "Amateur",
                "College & High School",
                "Outdoor",
                "Professional"
            ]
        },
        "13": {
            "name": "Technology",
            "sub": [
                "Gadgets",
                "Tech News",
                "Podcasting",
                "Software How-To"
            ]
        }
      }//categories end
    }//state end 
    
    this.directionSubmit = this.directionSubmit.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sortChange = this.sortChange.bind(this);
    //^lets you call 'this' from the method and have it point to this.state 

}//constructor end

initMap(){
    var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 40.7079502, lng: -74.0066584},
      zoom: 13
    });
}

sortChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    // this.setState({
    //   [name]: value
    // });
    // console.log(this.state);

    // fetch(`api/${this.state.genreTerm}/${this.state.searchTerm}/${this.state.sortBy}`)
    fetch(`api/${this.state.genreTerm}/${this.state.searchTerm}/${value}`)
    .then(
        response => response.json()
    )
    .then(
        this.setState({
          [name]: value
        })
    )
    .then(
        (result) => {
            console.log("FOO",result.data)
            const returnedPods = result.data;
            this.setState({results: returnedPods})
        }
    )
    .catch(e => e) 
    console.log(this.state); 
}

searchSubmit(event){
    console.log("clickeried :)")
    event.preventDefault();
    this.setState({
        genreTerm: this.state.genreTerm,
        searchTerm: this.state.searchTerm
    });
    console.log(this.state.genreTerm);
    console.log(this.state.searchTerm);
    console.log(`api/${this.state.genreTerm}/${this.state.searchTerm}`);
    fetch(`api/${this.state.genreTerm}/${this.state.searchTerm}`)
    .then(
        response => response.json()
    )
    .then(
        (result) => {
            console.log("FOO",result.data)
            const returnedPods = result.data;
            this.setState({results: returnedPods})
        }
    )
    .catch(e => e)
}

directionSubmit(event){
    event.preventDefault();
    // console.log("direction search requested");
    // console.log(this.state.origin, this.state.destination);
    fetch(`/api/${this.state.origin}/${this.state.destination}`)
    .then(
        response => response.json()
    )
    .then(
        (result) => {
            console.log("BOO", result)
            const returnedDirections = result.googleData;
            this.setState({duration: returnedDirections})
        }
    )
}

handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    // console.log(this.state)); --shows incomplete, bc setState updates asynchronously
}

componentDidMount(){
     window.initMap = this.initMap
}

  render() {
    //there should always be some value, and the type of value should be decided before returning
    const Pods = this.state.results;
    const x = Pods.results;
    console.log("x ",this.state.results.results);
    const numResults = x.length
    console.log("numresults ",numResults);
    const dur = this.state.duration;
    // const numResults = x ? x.length : 0
    //if x is there, set numresults eq to x.length
    //if x is not thre, set numresults eq to 0 

    const categories = this.state.categories;
    // console.log(categories);
    let selects = Array(14).fill('');
    let i = 0;

    for (const x in categories){   
      let y = categories[`${x}`].name;
      let b = categories[i].sub;
      // console.log(b);
      // b.unshift(y);
      if (b!== false){
        selects[i]=[y,b]; 
      }
      else{
        selects[i]=[y,[]]
      }
      i++;
    }
    // console.log(JSON.stringify(selects));




    return (
      <div className="App">
        <h1>Bound</h1>
        <h3>Find the perfect podcast for your trip.</h3>

        <form onSubmit={this.directionSubmit}>
            <label>Type in your origin:</label>
            <input type="text" name="origin" onChange={this.handleInputChange} required/>

            <label>Type in your destination:</label>
            <input type="text" name="destination" onChange={this.handleInputChange} required/>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>

           <MapWithADirectionsRenderer/> 
           <div style={{ backgroundColor: 'aliceblue'}} id="directions"></div>

      <form className="searchEntries" onSubmit={this.searchSubmit}>
        <label> Genre</label>
        <select required className="custom-select" name="genreTerm" onChange={this.handleInputChange}>
             <option value="">None</option>
             {selects &&
              selects.map((name) => 
                <optgroup label={name[0]}>
                 <option value={name[0]}> {name[0]} </option>
                { name[1].map(item => 
                  <option value={item}> {item} </option> 
                )}
                </optgroup>
              )
            }  
        </select>

        <label> Search Term</label>
        <input onChange={this.handleInputChange} name="searchTerm" className="form-control" type="text" placeholder="Search Term" required/>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

        <ul>
          <li>Query: {Pods.query}</li>
          <li> Total Results: {Pods.total_results}</li>
          <li> Results on this page: {numResults}</li>
        </ul>
        <hr/>

        <div>
        { (numResults > 0) &&
            <select className="custom-select" name="sortBy" id="sorty" onChange={this.sortChange}>
                <option value="">sort by </option>
                <option value="date_created desc"> newest to oldest </option>
                <option value="date_created asc">  oldest to newest </option>
                <option value="duration desc"> longest to shortest</option>
                <option value="duration asc"> shortest to longest </option>
                <option value="buzz_score desc"> most popular first </option>
                <option value="buzz_score asc"> least popular first </option> 
            </select>
        }
              {x.map((podcast, i) =>
              <div key={i}>
                <h3>{podcast.title} of <em> {podcast.show_title}</em></h3>
                <img src={podcast.image_urls.thumb}/>
                <p> Date created: {podcast.date_created}</p>
                <p> Description: <br/> {podcast.description} </p>
                <p> Buzzscore: {podcast.buzz_score}</p>
                <p> RSS: <a target="_blank" href={podcast.rss_url}>Link</a></p>
                <p> Duration: 
                  {podcast.audio_files.map(file =>
                    <span> <a target="_blank" href={file.mp3}> {file.duration} </a> </span>
                  )}
                </p>
                {( (x.length - 1) !== i) &&
                    <hr/>
                }

              </div>

              )}

        </div>


      </div>

    );
  }
}

// <PodResults pods={this.state.results.results}/> 

// const PodResults = ({pods}) =>
// <div>
//     <select className="custom-select" name="sortBy" id="sorty" onChange={this.sortChange}>
//         <option value="">sort by </option>
//         <option value="date_created desc"> newest to oldest </option>
//         <option value="date_created asc">  oldest to newest </option>
//         <option value="duration desc"> longest to shortest</option>
//         <option value="duration asc"> shortest to longest </option>
//         <option value="buzz_score desc"> most popular first </option>
//         <option value="buzz_score asc"> least popular first </option> 
//     </select>
//       {pods.map((podcast, i) =>
//       <div key={i}>
//         <h3>{podcast.title} of <em> {podcast.show_title}</em></h3>
//         <img src={podcast.image_urls.thumb}/>
//         <p> Date created: {podcast.date_created}</p>
//         <p> Description: <br/> {podcast.description} </p>
//         <p> Buzzscore: {podcast.buzz_score}</p>
//         <p> RSS: <a target="_blank" href={podcast.rss_url}>Link</a></p>
//         <p> Duration: 
//           {podcast.audio_files.map(file =>
//             <span> <a target="_blank" href={file.mp3}> {file.duration} </a> </span>
//           )}
//         </p>
//       </div>
//       )}
// </div>



export default App;
