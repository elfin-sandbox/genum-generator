/**
 * //// Genum - Random Number Generator
 *
 * This module provides a simple random number generator with additional features
 * such as copying the generated number to the clipboard and fetching trivia about the number.
 *
 * @module number-generator
 */

/**
 * Declares the parameter object, configuration object, and clipboard icon paths.
 */
const parameter = {
    minValue: 1,
    maxValue: 999,
};

const config = {
    cardIcon: document.querySelectorAll(".card__icon"),
    cardTitle: document.querySelectorAll(".card__title"),
    cardDesc: document.querySelectorAll(".card__description"),

    btnGenerate: document.querySelector(".generate__button"),
    btnOptions: document.querySelector(".options__button"),

    outputContainer: document.querySelector(".output__container"),
    outputLabel: document.querySelector(".output__label"),
    outputNumber: document.querySelector(".output__number"),
    copyIcon: document.querySelector(".clipboard__label"),
    triviaText: document.querySelector(".trivia__text"),
};

const clipboardIcon = {
    copy: "./src/images/clipboard.svg",
    check: "./src/images/check.svg",
};

/**
 * Initialize the app and set up event listeners
 */
initialize();
main();

/**
 * Initializes the app by loading JSON data and configuring clipboard behavior.
 */
function initialize() {
    loadFeaturesJSON();
    setClipboard();
}

/**
 * Fetches feature data from a JSON file and updates the UI with icons, titles, and descriptions.
 */
function loadFeaturesJSON() {
    const { cardIcon, cardTitle, cardDesc } = config;

    fetch("src/json/number-features.json")
        .then((response) => response.json())
        .then((data) => {
            let contents = data.contents;

            contents.forEach((card, index) => {
                cardIcon[index].src = card.header.icon;
                cardTitle[index].textContent = card.header.title;
                cardDesc[index].textContent = card.description;
            });
        });
}

/**
 * Configures the clipboard icon behavior based on user interactions with the output container.
 */
function setClipboard() {
    const { outputContainer, copyIcon } = config;

    outputContainer.onmouseleave = () => {
        copyIcon.src = clipboardIcon.copy;
    };
}

/**
 * Main function that sets up event listeners for various buttons and interactions.
 */
function main() {
    const { btnGenerate, btnOptions, outputContainer } = config;

    btnGenerate.addEventListener("click", () => {
        onClickGenerate();
    });

    btnOptions.addEventListener("click", () => {
        onClickOptions();
    });

    outputContainer.addEventListener("click", () => {
        onCopy();
    });
}

/**
 * Handles the generate button click event, generates a random number, and fetches trivia for it.
 */
async function onClickGenerate() {
    try {
        const fetchedNumber = fetchNumber();
        if (fetchedNumber) {
            const fetchedTrivia = await fetchTrivia(fetchedNumber);
            displayResults(fetchedNumber, fetchedTrivia);
        }
    } catch (error) {
        console.error("Error in onClickGenerate:", error);
        const { triviaText } = config;
        triviaText.textContent = "Sorry, we couldn't fetch the data.";
    }
}

/**
 * Generates a random number within the specified range.
 * @returns {number} A random number between minValue and maxValue.
 */
function fetchNumber() {
    const { minValue, maxValue } = parameter;
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

/**
 * Fetches trivia information for the given random number and displays it in the UI.
 *
 * @async
 * @param {number} randomNumber - The number for which to fetch trivia.
 * @returns {Promise<string>} The trivia information as a string.
 */
async function fetchTrivia(randomNumber) {
    const { triviaText } = config;

    try {
        const response = await fetch(`http://numbersapi.com/${randomNumber}`);
        const data = await response.text();
        return data.toString();
    } catch (error) {
        console.error("Error fetching trivia:", error);
        triviaText.textContent = "Sorry, we couldn't fetch the trivia.";
        return "Sorry, we couldn't fetch the trivia.";
    }
}

/**
 * Displays the generated number and its trivia on the UI.
 * @param {number} fetchedNumber - The generated random number.
 * @param {string} fetchedTrivia - The trivia information for the number.
 */
function displayResults(fetchedNumber, fetchedTrivia) {
    const { outputLabel, outputNumber, triviaText } = config;

    outputLabel.textContent = "Your generated number is:";
    outputNumber.textContent = fetchedNumber;
    triviaText.textContent = fetchedTrivia;
}

/**
 * Handles the options button click event, allowing users to set new min and max values for number generation.
 */
function onClickOptions() {
    let minValueTemp = parseInt(prompt("Enter minimum value (min: 1)"));
    let maxValueTemp = parseInt(prompt("Enter maximum value (max: 9999)"));

    minValueTemp = isNaN(minValueTemp) ? 1 : minValueTemp;
    maxValueTemp = isNaN(maxValueTemp) ? 999 : maxValueTemp;

    if (minValueTemp > maxValueTemp) {
        alert("Minimum value cannot be greater than maximum value.");
        minValueTemp = 1;
        maxValueTemp = 999;
    }

    parameter.minValue = minValueTemp;
    parameter.maxValue = maxValueTemp;
}

/**
 * Copies the generated number to the clipboard and updates the clipboard icon to show success.
 */
function onCopy() {
    const { outputNumber, copyIcon } = config;

    navigator.clipboard
        .writeText(outputNumber.textContent)
        .then(() => {
            copyIcon.src = clipboardIcon.check;

            setTimeout(() => {
                copyIcon.src = clipboardIcon.copy;
            }, 1500);
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
}
