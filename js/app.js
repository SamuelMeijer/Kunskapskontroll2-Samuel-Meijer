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
};