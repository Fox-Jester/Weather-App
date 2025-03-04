



const App = {

    $: {


        currentWeather: document.querySelector("#current-weather"),

        currentTemp: document.querySelector("#current-temp"),
        currentHigh:document.querySelector("#current-high"),
        currentLow: document.querySelector("#current-low"),
        currentFlTemp: document.querySelector("#current-fl-temp"),
        currentHumidity: document.querySelector("#current-humidity"),

        searchBar: document.querySelector("#search-bar"),
        searchBtn: document.querySelector("#search-btn"),

        searchReset: document.querySelector(".search-reset"),

        inputGroup: document.querySelector(".input-group"),
        weekContainer: document.querySelector(".week-container"),
        header: document.querySelector(".header"),

        cityName: document.querySelector("#city-name"),

        apiKey: "ef4e47f45cd622e4387db0795554b15a",

        currentDT: "",
    },

    init(){
        App.applyEventListeners();
        App.loadCityName();
    },

    saveCityName(name){
        localStorage.setItem("cityName", `${name}`);
    },

    loadCityName(){
        if(localStorage.getItem("cityName")){
            const city = localStorage.getItem("cityName");
            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${App.$.apiKey}&units=imperial`;
            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${App.$.apiKey}&units=imperial`;
            App.getWeather(weatherURL,forecastURL,city);
        
           console.log("City Loaded");

        };

       
        
        

    },
   

    applyEventListeners(){

        App.$.searchBtn.addEventListener("click", App.search)

        App.$.searchBar.addEventListener("keydown", (e) => {
            if(e.key === "Enter"){
                App.search()
            }
        })


        App.$.searchReset.addEventListener("click", App.searchRefresh);
        
    },

    search(){
        
        if(!App.$.searchBar.value){
            alert("not a valid city");
            return;
        }
        const city = App.$.searchBar.value[0].toUpperCase() + App.$.searchBar.value.slice(1).toLowerCase();
        

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${App.$.apiKey}&units=imperial`;

        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${App.$.apiKey}&units=imperial`;
       
        
        

        App.getWeather(weatherURL,forecastURL,city);
        
       
        
        
    },
    searchRefresh(){
        App.$.header.classList.add("search-mode");
        App.$.inputGroup.classList.add("search-mode");
        App.$.weekContainer.classList.add("search-mode");

        localStorage.setItem("cityName", "")
    },
    
    weatherMode(){
        App.$.header.classList.remove("search-mode");
        App.$.inputGroup.classList.remove("search-mode");
        App.$.weekContainer.classList.remove("search-mode");
        
    },

    getWeather(weatherURL, forecastURL, city){

        fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            App.displayWeather(data);
            App.weatherMode();
            App.$.cityName.innerHTML = city;
            App.saveCityName(city);
            
        })
        .catch(error => {
            console.log("Error fetching curent weather data:", error);
            alert("Invaild City")
        });


        fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            App.spliceForecast(data.list);
        })
        .catch(error => {
            console.log("Error fetching curent forecast data:", error);

        });

      
    },
    
    displayWeather(data){

        const temp = Math.round(data.main.temp);
        const tempHigh = Math.round(data.main.temp_max);
        const tempLow = Math.round(data.main.temp_min);
        const tempFL = Math.round(data.main.feels_like);

        const imgIcon = App.findIcon(data.weather[0].id, data.weather[0].icon)

    
        const humidity = data.main.humidity;

        App.$.currentWeather.src = imgIcon;
        App.$.currentTemp.innerHTML = temp;
        App.$.currentHigh.innerHTML = tempHigh;
        App.$.currentLow.innerHTML = tempLow;
        App.$.currentFlTemp.innerHTML = tempFL
        App.$.currentHumidity.innerHTML = humidity;

        App.$.currentDT = data.dt
    },


    spliceForecast(data){
        const forecast1 = data[0]
        const forecast2 = data[1]
        const forecast3 = data[2]
        const forecast4 = data[3]
        const forecast5 = data[4]
        const forecast6 = data[5]
        const forecast7 = data[6]

        App.forecastResetTimer(forecast1);
        
        App.displayForecast(forecast1, 1);
        App.displayForecast(forecast2, 2);
        App.displayForecast(forecast3, 3);
        App.displayForecast(forecast4, 4);
        App.displayForecast(forecast5, 5);
        App.displayForecast(forecast6, 6);
        App.displayForecast(forecast7, 7);
        
    },



    displayForecast(forecast, id){

      

        const temp = Math.round(forecast.main.temp);
        const icon = App.findIcon(forecast.weather[0].id, forecast.weather[0].icon);
        
        const time = App.unixConverter(forecast.dt);

        
        const forecastTemp = document.querySelector(`#forecast-${id} .forecast-temp`);
        const forecastImg = document.querySelector(`#forecast-${id} img`);
        const forecastTime = document.querySelector(`#forecast-${id} h2`);

        forecastTemp.innerHTML = temp;
        forecastImg.src = icon;
        forecastTime.innerHTML = time;
    },

    unixConverter(dt){
        const dateTime = new Date(dt * 1000);
        const dateHours = dateTime.getHours();
        let hour = ""
        if(dateHours >= 12){
            hour = `${dateHours - 12}:00pm`
        }
        else {
            hour = `${dateHours}:00am`
        }
        return hour
    },

    forecastResetTimer(forecastData){
        const dt = forecastData.dt;
        const timeDifference = ((dt - App.$.currentDT) * 1000);
        setTimeout(App.loadCityName, timeDifference);
    },

   


   


    findIcon(id, icon){

        const day_Or_Night = icon.slice(-1)

        switch(true){
            case (id >= 200 && id < 300):
                return "icons/thunder_storm.svg";

            case (id >= 300 && id < 500):
                return "icons/cloud-rain.svg";

            case (id >= 500 && id < 600):
                return "icons/cloud-showers.svg";

            case (id >= 600 && id < 700):
                return "icons/snow.svg";

            case (id >= 700 && id < 800):
                return "icons/smog.svg";

            case (id === 800 && day_Or_Night === 'd'):
                return "icons/sun.svg";

            case (id === 800 && day_Or_Night === 'n'):
                return "icons/moon.svg";

            case (id >= 801):
                return "icons/cloud.svg";
  

        }

    }, 


}


App.init()


