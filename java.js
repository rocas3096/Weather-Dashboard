let weather = {
    apiKey: "d1d6eafde5dc8b5c039167dcfa22c05c",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" 
            + city 
            + "&units=imperial&exclude=minutely,hourly,alerts&appid=" 
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
    },
    displayWeather : function(data) {
        const { name } = data.city;
        const { dt } = data.list[0];
        const { icon, description } = data.list[0].weather[0];
        const { temp, humidity } = data.list[0].main;
        const { speed } = data.list[0].wind;
        const roundedTemp = Math.round(temp);
        const date = new Date (dt*1000);
        const day = date.getDate();
        const month =date.getMonth() + 1;
        console.log(name, dt, icon, description, temp, humidity, speed)
        document.querySelector(".city").innerText = name + " " + month + "/" +day;
        document.querySelector(".icon").src = 
        "https://openweathermap.org/img/wn/" 
        + icon
        + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = roundedTemp + " °F";
        document.querySelector(".humidity").innerText = "Humiditiy: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "MPH";
    }
};


