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
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'dfd0919a1a33da253891307cacb8266c';

// ***** EVENT LISTENERS *****
form.addEventListener('submit', function (event) {
    // Preventing normal submit-behaviour.
    event.preventDefault();
    
    // Selecting the users input.
    let userInput = formInput.value;

    fetch(`${baseUrl}?q=${userInput}&units=metric&lang=sv&appid=${apiKey}`).then(handleResponse).catch(errorHandler);
});

// ***** FUNCTIONS *****
async function handleResponse (promise) {
    // Storing the users input in a variable and reseting the <input>-element to allow new searches.
    let userInput = formInput.value;
    // Calling function 'formatString' to make sure the data from userInput will be presented in a proper format.
    userInput = formatString(userInput);
    // Reseting the <input>-element (searchfield).
    formInput.value = '';
    // Using .blur() to remove the focus from the input-element (searchfield) in order to remove search suggestions for old user-input from showing
    formInput.blur();
    // Using .focus() to once again focus on the input-element (searchfield) after the old user-input has been removed.
    formInput.focus();

    // Evaluating if an error occurred in the response from the API.
    if (!promise.ok) {
        // Hiding the <table>-element that displays weather information if one exists.
        let table = document.querySelector('.main-table');
        if (table) {
            table.style.display = 'none';
        };

        // Updating textcontent to let the user know an error has occurred. 
        mainTitle.textContent = 'Fel :(';
        // Evaluates if the statuscode is 404, which means a city with the searched name does not exist in the API.
        if (promise.status === 404) {
            // Updating the textcontent to let the user know no such city was found.
            mainDescription.textContent = `Vi lyckas tyvärr inte hitta en stad med namnet: ${userInput}`;
            // Throwing an error.
            throw new Error(`An error occurred while searching for a city with the name ${userInput}: ` + promise.status + ' ' + promise.statusText);
        } else {
            // Updating the textcontent to let the user know something went wrong.
            mainDescription.textContent = 'Något gick tyvärr fel med sökningen';
            // Throwing an error.
            throw new Error('An error occurred while communicating with the server: ' + promise.status + ' ' + promise.statusText);
        }
    };
    
    // Defining a variable that will hold the data in the response.
    let promiseJs = null;
    // Checking for errors while converting the data in the response from JSON to JavaScript.
    try {
        // Converting the data in the response from JSON to JavaScript and storing it in 'promiseJs'.
        promiseJs = await promise.json();

        // Evaluating if the data is complete or if something is missing.
        if (!promiseJs.weather[0].description) {
            throw new SyntaxError(`Incomplete data: No weather description`);
        } else if (!promiseJs.weather[0].icon) {
            throw new SyntaxError(`Incomplete data: No weather icon`);
        } else if (!promiseJs.main.temp) {
            throw new SyntaxError(`Incomplete data: No temperature`);
        } else if (!promiseJs.main.feels_like) {
            throw new SyntaxError(`Incomplete data: No feels like temperature`);
        } else if (!promiseJs.wind.speed) {
            throw new SyntaxError(`Incomplete data: No wind speed`);
        } else if (!promiseJs.wind.deg && typeof promiseJs.wind.deg !== 'number') {
            throw new SyntaxError(`Incomplete data: No wind direction`);
        } else if (!promiseJs.main.humidity) {
            throw new SyntaxError(`Incomplete data: No humidity`);
        }
    } catch (error) {
        console.error('Json Error: ' + error);
    }
    
    /* *** Updating textcontent. *** */
    // Updating textcontent with userInput instead of directly getting the name from API-response because the API-response is sometimes in english and sometimes in swedish.
    mainTitle.textContent = userInput;
    mainDescription.textContent = `I ${userInput} är det just nu ${promiseJs.weather[0].description}`;

    // Evaluates if mainContentContainer only has two children, if it does the function 'addTable' will be called to create the elements needed to display the weather information recieved from the API.
   if (mainContentContainer.children.length === 2) {
       addTable();
   }

   /* *** Updating <table>-element to display weather information *** */
   let table = document.querySelector('.main-table');
   // Setting display to block to make sure it is visible, if the user previously has done a search on a city that cannot be found display will be set to 'none'.
   table.style.display = 'block';
   
   // Updating the <img>-element that is a child of <thead> to display a weather icon.
   let weatherImg = document.querySelector('table thead th img');
   weatherImg.setAttribute('src', `http://openweathermap.org/img/wn/${promiseJs.weather[0].icon}@2x.png`);

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

// Handling errors related to the response from the API or the content of the response.
function errorHandler (error) {
    console.error(error);
}

// addTable creates a <table>-element with children and appends it as a child to mainContentContainer.
function addTable () {
     const table = document.createElement('table');
     const thead = document.createElement('thead');
     const tbody = document.createElement('tbody');
 
     // Appending a child element that will contain the weather icon.
     thead.insertAdjacentHTML('afterbegin', `<th colspan="2"><img></th>`);
     table.appendChild(thead);
 
     // Appending several child elements that will be used to display the weather information.
     tbody.insertAdjacentHTML('afterbegin', `<td>Temperatur</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Känns som</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Vindhastighet</td> <td></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Vindriktning</td> <td><i class="fas fa-long-arrow-alt-up"></i></td>`);
     tbody.insertAdjacentHTML('beforeend', `<td>Luftfuktighet</td> <td></td>`);
     table.appendChild(tbody);
     
     // Adding css-class 'main-table'.
     table.classList.add('main-table');

     // Appending the <table> element as a child to mainContentContainer
     mainContentContainer.appendChild(table);
}

// Changing the color of the text displaying temperature information based on the temperature value.
function temperatureColor (temperature, element) {
    if (temperature <= 0) {
        element.style.color = 'darkblue';
    } else if (temperature <= 10) {
        element.style.color = 'blue';
    } else if (temperature >= 30) {
        element.style.color = 'red';
    } else if (temperature >= 20) {
        element.style.color = 'orange';
    } else {
        element.style.color = 'green';
    };
};

// Converts the first character of every new word in a string to uppercase, every other character in the string will be lowercase. 
// ex) 'riO de jAnEiro' -> 'Rio De Janeiro'.
function formatString (string) {
    let newString = '';
    
    for (let i = 0; i < string.length; i++) {
        if (i === 0 || string.charAt(i - 1) === ' ') {
            newString += string.charAt(i).toUpperCase();
        } else {
            newString += string.charAt(i).toLowerCase();
        };
    }

    return newString
};