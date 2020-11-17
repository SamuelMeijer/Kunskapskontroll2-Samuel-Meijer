// TODO: MAKE REPOSITORY PUBLIC BEFORE HANDING IN THE ASSIGNMENT, ONLY SET TO PRIVATE TO PROTECT THE API-KEY!

/*
**** INSTRUCTIONS ****
1. All info ska presenteras i metric units
2. Ett formulär med en text-input och en submit-knapp där användaren anger en stad.
3. Det nuvarande vädret för den inmatade staden hämtas och  presenteras. Du behöver ha med följande: 
    - Description
    - Väderikon, se https://openweathermap.org/weather-conditions 
    - Temperatur
    - Vindhastighet
    - Luftfuktighet
4. Temperaturdatan ska användas för att ändra färg på något i appen. Kan vara hela bakgrunden eller en liten ikon, du väljer själv.
5. Utifall den inmatade staden inte kan hittas ska det visas ett tydligt och informerande meddelande.
6. Kommentera all kod med beskrivning av vad den gör
*/

// ***** ELEMENTS *****
const form = document.getElementById('header-form');
const formInput = document.getElementById('header-form-input');
const formBtn = document.getElementById('header-form-btn');

const mainContentContainer = document.querySelector('.main-content-container');
const mainTitle = document.querySelector('.main-title');
const mainDescription = document.querySelector('.main-description');

// ***** API-URL *****
// TODO: Uncomment, dont want to waste API-calls during development of other parts since there is a limit of 1000/day.
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'dfd0919a1a33da253891307cacb8266c';

// ***** EVENT LISTENERS *****
form.addEventListener('submit', function (event) {
    let userInput = formInput.value;

    // TODO: Add alternatives for units and language? Currently units will be displayed as metric and language as swedish.
    fetch(`${baseUrl}?q=${userInput}&units=metric&lang=sv&appid=${apiKey}`).then(handleResponse).catch(function (error) {
        console.error('FEEEEL', error.message);
    });

    // Preventing normal submit-behaviour.
    event.preventDefault();
});

// ***** FUNCTIONS *****
async function handleResponse (promise) {
    console.log(promise);
    // TODO: Add try...catch
    const promiseJs = await promise.json();
    console.log(promiseJs);

    // Updating textcontent.
    mainTitle.textContent = promiseJs.name; // TODO: Update with userinput instead of promiseJs.name? PromiseJS.name will always be in english.
    mainDescription.textContent = `I ${promiseJs.name} är det just nu ${promiseJs.weather[0].description}`;

    // Evaluates if mainContentContainer only has two childre, if it does the function 'addTable' will be called to create the elements needed to display the weather information recieved from the API.
   if (mainContentContainer.children.length === 2) {
       addTable();
   }

   /* *** Updating <table>-element to display weather information *** */
   // Updating the <img>-element that is a child of <thead> to display a weather icon.
   document.querySelector('table thead th img').setAttribute('src', `http://openweathermap.org/img/wn/${promiseJs.weather[0].icon}@2x.png`);

   // Nodelist of every <tr>-element inside <table>.
   const trNodeList = document.querySelectorAll('table tbody tr');

   // Looping through the nodelist and updating the textcontent of the second child, the <td>-element that displays the weather information.
   for (let i = 0; i < trNodeList.length; i++) {
       switch (i) {
            case 0:
                trNodeList[i].children[1].textContent = `${promiseJs.main.temp} C°`;
                break
            case 1:
                trNodeList[i].children[1].textContent = `${promiseJs.main.feels_like} C°`;
                break
            case 2:
                trNodeList[i].children[1].textContent = `${promiseJs.wind.speed} m/s`;
                break
            case 3:
                // Rotating the arrow-icon to the corresponding degree in promiseJs.wind.deg
                trNodeList[i].children[1].children[0].style.transform = `rotate(${promiseJs.wind.deg}deg)`;
                break
            case 4:
                trNodeList[i].children[1].textContent = `${promiseJs.main.humidity} %`;
                break
       }
   }

   // Changing the color of the text displaying temperature information based on the temperature value.
   temperatureColor(promiseJs.main.temp, trNodeList[0].children[1]);
   temperatureColor(promiseJs.main.feels_like, trNodeList[1].children[1]);


};

// addTable creates a <table>-element with children and appends it as a child to mainContentContainer.
function addTable () {
     const table = document.createElement('table');
     const thead = document.createElement('thead');
     const tbody = document.createElement('tbody');
 
     // Appending a child element that will contain the weather icon.
     thead.insertAdjacentHTML('afterbegin', `<th colspan="2"><img></th>`);
     table.appendChild(thead);
 
     // Appending several child elements that will be used to display the weather information.
     tbody.insertAdjacentHTML('afterbegin', `<td>Temperature</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Feels like</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Wind</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Wind direction</td> <td><i class="fas fa-long-arrow-alt-up"></i></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Humidity</td> <td></td>`);
     table.appendChild(tbody);
     
     // Appending the <table> element as a child to mainContentContainer
     mainContentContainer.appendChild(table);
}

// Changing the color of the text displaying temperature information based on the temperature value.
function temperatureColor (temperature, element) {
    if (temperature <= 0) {
        element.style.color = 'darkblue';
    } else if (temperature <= 10) {
        element.style.color = 'blue';
    } else if (temperature >= 20) {
        element.style.color = 'green';
    } else if (temperature >= 30) {
        element.style.color = 'darkgreen';
    } else {
        element.style.color = 'yellow';
    };
};