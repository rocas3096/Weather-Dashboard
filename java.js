//call API for weather using custom API key
let weather = {
    apiKey: "d1d6eafde5dc8b5c039167dcfa22c05c",
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
        document.querySelector(".card").classList.remove("loading");
        //loop over the next five days of data
        for (let i=1; i <= 5; i++) {
            const dayData = data.list.find(
                (item) =>
                new Date(item.dt_txt).getHours() === 18 &&
                new Date(item.dt_txt).getDate() === new Date().getDate() + i
            ); //Data for 3pm on the following 5 days
            const { dt_txt } =dayData;
            const { icon } = dayData.weather[0]
            const { temp } = dayData.main;
            const { speed } = dayData.wind;
            const { humidity } = dayData.main;
            const roundedTemp = Math.round(temp);
            
            //create new cards for each of the days and append them to the data we have
            const fiveDayForcast = document.querySelector("#five-day-forcast");
            const box = document.createElement("div");
            box.classList.add("col-12", "col-md-1.5", "col-lg-2");
            const box1 = document.createElement("div");
            box1.classList.add("card");
            const box2 = document.createElement("div");
            box2.classList.add("row");
            const box3 = document.createElement("div");
            box3.classList.add("col-12", "col-md-12");
            const box4 = document.createElement("div");
            box4.classList.add("card-body");
            const date = new Date(dt_txt);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            box4.innerHTML= `
            <h5 class = "card-title">${month}/${day}</h5>
            <h4 class= "card-text">${roundedTemp} °F</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="image of cloud by default; image of current weather"/>
            <p class="card-text">Humidity: ${humidity} %</p>
            <p class="card-text">Wind: ${speed} MPH</p>
            `;

            box3.appendChild(box4);
            box2.appendChild(box3);
            box1.appendChild(box2);
            box.appendChild(box1);
            fiveDayForcast.appendChild(box);
        }
    },
    //pulls user search infomation to be used for search
    search: function () {
        this.fetchWeather(document.querySelector(".form-control").value);
        const fiveDayForcast = document.querySelector("#five-day-forcast");
        fiveDayForcast.innerHTML = `
        <div class="col-12 col-md-2 col-lg-2" style="opacity: 0;">
        </div>
        `;
    }
    
};

//adds event listener for when submit button is clicked
document.querySelector('button[type="submit"]').addEventListener("click", function() {
    weather.search();
});

//adds event listener for when enter button is hit in search bar
document.querySelector(".form-control").addEventListener("keyup", function(event){
    if (event.key == "Enter") {
        weather.search();
    }
})

//makes refresh button redo the search for the current city
document.querySelector('.btn-success').addEventListener("click", function() {
    weather.search();
});

//loads up weather for chicago by default
weather.fetchWeather("Chicago");