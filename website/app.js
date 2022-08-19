/* Global Variables */
const dateField = document.getElementById("date");
const tempField = document.getElementById("temp");
const contentField = document.getElementById("content");
const cityField = document.getElementById("city");
const generateBtn = document.getElementById("generate");
const zipError = document.getElementById("zipError");
const feelingsError = document.getElementById("feelingsError");
const zipInput = document.getElementById("zip");
const feelingsInput = document.getElementById("feelings");

// my loopback url
const serverUrl = "http://127.0.0.1:8000";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();

// The url to get weather data by postal code
const mainURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
// My openWeather api key
const api_KEY = "&appid=58caf6f0fb874ebe04a4103b8f22ae9d";
//Units of measurement
const unitMeasurement = "&units=metric";

//event to button generate
generateBtn.addEventListener("click", async () => {
  const zipContent = +zipInput.value;
  const feelingsContent = feelingsInput.value;
  if (!zipContent || typeof zipContent !== "number") {
    zipError.textContent = "zipcode must be number !!!";
    zipError.classList.add("showError");
    setTimeout(() => {
      zipError.classList.remove("showError");
    }, 2000);
    return;
  }
  // error guard
  if (feelingsContent === "") {
    feelingsError.textContent = "You must enter Your Feelings";
    feelingsError.classList.add("showError");
    setTimeout(() => {
      feelingsError.classList.remove("showError");
    }, 2000);
    return;
  }
  const openWeatherData = await getDataFromOpenWeather(zipContent);
  if (!openWeatherData) {
    return;
  }
  if (openWeatherData.cod === 200) {
    const {
      main: { temp },
      name: city,
    } = openWeatherData;
    const postData = {
      temp,
      city,
      newDate,
      feelingsContent,
    };

    await postResults(`${serverUrl}/add`, postData);
    await addDataToFrontUI();
  }
});


//get data from weather api
async function getDataFromOpenWeather(zip) {
  try {
    const res = await fetch(`${mainURL}${zip}${api_KEY}${unitMeasurement}`);
    const data = await res.json();
    if (res.status === 404) {
      zipError.textContent = `${data.message}`;
      zipError.classList.add("showError");
      setTimeout(() => {
        zipError.classList.remove("showError");
      }, 2000);
      return;
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Function to POST data
const postResults = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newEntry = await res.json();
    return newEntry;
  } catch (error) {
    console.log(error);
  }
};

// update my fornt UI
const addDataToFrontUI = async () => {
  const res = await fetch(`${serverUrl}/all`);
  try {
    const results = await res.json();
    dateField.innerHTML = `<h3>The Date : </h3> <h3>${results.newDate}</h3>`;
    cityField.innerHTML = `<h3>City : </h3> <h3>${results.city}</h3>`;
    tempField.innerHTML = `<h2 class="tempResult">${Math.round(
      results.temp
    )} c</h2>`;
    contentField.innerHTML = `<h5>My Feelings : </h5> <h3>${results.feelingsContent}</h3>`;
  } catch (error) {
    console.log(error);
  }
};
