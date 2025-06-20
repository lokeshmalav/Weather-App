// start building 

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFoundContainer = document.querySelector(".not-found-container");



//intiall variables

let currentTab = userTab;
const API_KEY = "c4cd6b39afcd51d3060d677275563176";
currentTab.classList.add("current-tab");

getfromSessionStorage();

// ek kaam or pending hai 




    // function switch tab  if we come from clicking user tab then user tab will passed as clickedTab
  function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    // Check if userTab is clicked
    if (clickedTab === userTab) {
        // Show user location weather

        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        notFoundContainer.classList.remove("avtive");

        // Show location weather info
        getfromSessionStorage();
    }

    // Check if searchTab is clicked
    else if (clickedTab === searchTab) {
        // Show search form only
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
}



// switch b/w tabs on click on user tab
 userTab.addEventListener('click',()=>{
     // pass the tab we clicked on 
    switchTab(userTab);
 });

 // swith from search tab

 searchTab.addEventListener('click',()=>{
        // pass the tab we clicked on 
        switchTab(searchTab);
 });


 // implement the fuction fetchfromsession storage
 // check if cordinates are already present in session storage
 function   getfromSessionStorage(){
      const localCoordinates = sessionStorage.getItem("user-coordinates");

      if(!localCoordinates){
        notFoundContainer.classList.remove("active");
        grantAccessContainer.classList.add("active");

      }
      else{
         
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
      }
 }

     // it will call API to fetch weather info
  async function fetchUserWeatherInfo(coordinates){
        const {lat, lon} = coordinates;
        // make grant container invisible 
        grantAccessContainer.classList.remove("active");
        notFoundContainer.classList.remove("active");
        // maker loader visible
        loadingScreen.classList.add("active");

        //API call

    

        try{
           const response = await fetch(
                      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                       );
             const data  =  await response.json();
        
             loadingScreen.classList.remove("active");
             userInfoContainer.classList.add("active");

             // render weather on UI
             renderWeatherInfo(data);

        }
        catch(err){
                   
             loadingScreen.classList.remove("active");
              // Homework
              console.log("error");
        }
   }



   // render the weathr info on UI
 function renderWeatherInfo(weatherInfo) {
    // Firstly, we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Fetch values from weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    

    windspeed.innerText = `${weatherInfo?.wind?.speed}  m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// implemnting getLocation 
  function getLocation(){
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
     } 
     else{
         alert("No geolaction support available");
     }
  }

  // implement showPosition function
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    // store in user-coordinates
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // render on UI
    fetchUserWeatherInfo(userCoordinates);
}


// we have to add a listener on grant access button so it can get
// our coordinates and store them in session storage to use in future in the same session 
 const grantAccessButton = document.querySelector("[data-grantAccess]");

 grantAccessButton.addEventListener('click',getLocation);


 // implementing search  form
 let searchInput = document.querySelector("[data-searchInput]");
 searchForm.addEventListener('submit',(e)=>{
       e.preventDefault();
     
       let cityName = searchInput.value;

       if(cityName==="") return;
       else{
         fetchSearchWeatherInfo(cityName); // input is city name
       }
      
 }); 


 // function that fethc weather info based on city name 

 async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFoundContainer?.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();


        // show loading screen
        loadingScreen.classList.remove("active");


        // if city not found
        if (data.cod === "404") {
            notFoundContainer.classList.add("active");
            return;
        }
     
        // show user info on UI
        userInfoContainer.classList.add("active");
        //fill info in the UI
        renderWeatherInfo(data);
       
        // ✅ Clear input field after successful rendering
        searchInput.value = "";

    } 
    catch (err) {
        loadingScreen.classList.remove("active");
        notFoundContainer.classList.add("active");
    }
      

}



           
   



