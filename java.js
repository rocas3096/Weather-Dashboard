//call API for weather using custom API key
let weather = {
    apiKey: "d1d6eafde5dc8b5c039167dcfa22c05c",
    // empty search history array to be populated later
    searchHistory: [],
    // function for fetching weather for today and 5 day forcast using input of a city
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" 
            + city 
            + "&units=imperial&appid=" 
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
        //logs any errors in process to console
        .catch((error) => console.error(error));
    },
    //function for displaying weather data to page
    displayWeather : function(data) {
        //constants for todays weather data
        const { name } = data.city;
        const { dt } = data.list[0];
        const { icon, description } = data.list[0].weather[0];
        const { temp, humidity } = data.list[0].main;
        const { speed } = data.list[0].wind;
        const roundedTemp = Math.round(temp);
        const date = new Date (dt*1000);
        const day = date.getDate();
        const month =date.getMonth() + 1;
        // saving and displaying information related to city searched
        this.saveSearchHistory(name);
        this.displaySearchHistory();
        //testing that todays data works
        console.log(name, dt, icon, description, temp, humidity, speed)
        //displays todays weather data to page
        document.querySelector(".city").innerText = name + " " + month + "/" +day;
        document.querySelector(".icon").src = 
        "https://openweathermap.org/img/wn/" 
        + icon
        + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = roundedTemp + " °F";
        document.querySelector(".humidity").innerText = "Humiditiy: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "MPH";
        //removes the class loading which was used to hide the display for todays weather until the default search was completed as to not display default text data
        document.querySelector(".card").classList.remove("loading");
        //loop over the next five days of data
        for (let i=1; i <= 5; i++) {
            const dayData = data.list.find(
                (item) =>
                new Date(item.dt_txt).getHours() === 21 &&
                new Date(item.dt_txt).getDate() === new Date().getDate() + i
            ); //Data for the next 5 days
            const { dt_txt } =dayData;
            const { icon } = dayData.weather[0]
            const { temp } = dayData.main;
            const { speed } = dayData.wind;
            const { humidity } = dayData.main;
            const roundedTemp = Math.round(temp);
            const roundedWind = Math.round(speed);
            
            //create new cards for each of the days and append them to the data we have
            const fiveDayForcast = document.querySelector("#five-day-forcast");
            const box = document.createElement("div");
            box.classList.add("col-12", "col-md-2", "col-lg-2");
            box.setAttribute("style", "margin: auto;");
            const box1 = document.createElement("div");
            box1.classList.add("card");
            const box2 = document.createElement("div");
            box2.classList.add("col-12", "col-md-12");
            const box3 = document.createElement("div");
            box3.classList.add("card-body");
            const date = new Date(dt_txt);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            box3.innerHTML= `
            <h5 class = "card-title">${month}/${day}</h5>
            <h4 class= "card-text">${roundedTemp} °F</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="image of cloud by default; image of current weather"/>
            <p class="card-text">Humidity: ${humidity} %</p>
            <p class="card-text">Wind: ${roundedWind} MPH</p>
            `;

            box2.appendChild(box3);
            box1.appendChild(box2);
            box.appendChild(box1);
            fiveDayForcast.appendChild(box);
        }
    },
    //pulls user search infomation to be used for search and compares if the last search matched this one, if so search does not execute 
    search: function () {
        const query = document.querySelector(".form-control").value;
        if (query !== this.lastQuery) {
            this.lastQuery = query;
            this.fetchWeather(query);
            const fiveDayForcast = document.querySelector("#five-day-forcast");
        fiveDayForcast.innerHTML = ``;
        }
    },
    
    //sets length of array for searchHistory to 7 and pushes currently searched city to the array as well as saving it to local storage
    saveSearchHistory: function (city) {
        if(this.searchHistory.length >=7) {
            this.searchHistory.shift();
        }
        this.searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    //displays search history by retrieving it from local storage and then creating list elements for this data and adding them to the page. These list elements are then given event listeners so that they can be used to repeat previous searches for cities
    displaySearchHistory: function() {
        const searchHistoryList = document.querySelector('.search-history');
        searchHistoryList.innerHTML = ``;
        const storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        this.searchHistory = storedSearchHistory;
        this.searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener("click" , () => {
                this.fetchWeather(city);
                const fiveDayForcast = document.querySelector("#five-day-forcast");
                fiveDayForcast.innerHTML = ``;
            });
            searchHistoryList.appendChild(li);
        });
    },
};


//adds event listener for when submit button is clicked
document.querySelector('button[type="submit"]').addEventListener("click", function(event) {
    event.preventDefault();
    weather.search(document.querySelector(".form-control").value);
});

//adds event listener for when enter button is hit in search bar
document.querySelector(".form-control").addEventListener("keyup", function(event){
    if (event.key == "Enter") {
        event.preventDefault();
        weather.search(document.querySelector(".form-control").value);
    }
})

//displays search history array automatically
weather.displaySearchHistory();

//loads up weather for chicago by default so page is not empty 
weather.fetchWeather("Chicago");