/**
 * //// Genum - Random Number Generator
 *
 * This module provides a simple random number generator with additional features
 * such as copying the generated number to the clipboard and fetching trivia about the number.
 *
 * @module number-generator
 */

/**
 * Holds the min and max values for random number generation.
 *
 * @typedef {Object} Parameter
 * @property {number} minValue - Minimum value for random number generation.
 * @property {number} maxValue - Maximum value for random number generation.
 */

/**
 * References to DOM elements used in the application.
 *
 * @typedef {Object} Config
 * @property {NodeListOf<Element>} cardIcon - Icons displayed in the feature cards.
 * @property {NodeListOf<Element>} cardTitle - Titles displayed in the feature cards.
 * @property {NodeListOf<Element>} cardDesc - Descriptions displayed in the feature cards.
 * @property {Element} btnGenerate - Button for generating a random number.
 * @property {Element} btnOptions - Button for setting options.
 * @property {Element} outputContainer - Container for displaying the output number.
 * @property {Element} outputNumber - Element that shows the generated random number.
 * @property {Element} copyIcon - Icon indicating the clipboard status.
 * @property {Element} triviaText - Element that shows the trivia fetched about the random number.
 */

/**
 * Paths to icons used for the clipboard status.
 *
 * @typedef {Object} ClipboardIcon
 * @property {string} copy - Path to the "copy" icon.
 * @property {string} check - Path to the "check" icon.
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
    outputNumber: document.querySelector(".output__number"),
    copyIcon: document.querySelector(".clipboard__label"),
    triviaText: document.querySelector(".trivia__text"),
};

const clipboardIcon = {
    copy: "./src/images/clipboard.svg",
    check: "./src/images/check.svg",
};

/**
 * Defines the main function and call the initialization and main functions.
 */
initialize();
main();

/**
 * Initializes the app by loading JSON data, setting up focus styles, and configuring clipboard behavior.
 */
function initialize() {
    loadFeaturesJSON();
    setFocus();
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
 * Sets focus and blur event listeners on the generate button to change its background color.
 */
function setFocus() {
    const { btnGenerate } = config;

    btnGenerate.onfocus = () => {
        btnGenerate.style.backgroundColor = "var(--emerald-700)";
    };

    btnGenerate.onblur = () => {
        btnGenerate.style.backgroundColor = "var(--emerald-500)";
    };
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
function onClickGenerate() {
    const { minValue, maxValue } = parameter;
    let randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

    const { outputNumber } = config;
    outputNumber.textContent = randomNumber;

    fetchTrivia(randomNumber);
}

/**
 * Fetches trivia information for the given random number and displays it in the UI.
 *
 * @async
 * @param {number} randomNumber - The number for which to fetch trivia.
 */
async function fetchTrivia(randomNumber) {
    const { triviaText } = config;

    try {
        const response = await fetch(`http://numbersapi.com/${randomNumber}`);
        const data = await response.text();
        triviaText.textContent = data;
    } catch (error) {
        console.error("Error fetching trivia:", error);
        triviaText.textContent = "Sorry, we couldn't fetch the trivia.";
    }
}

/**
 * Handles the options button click event, allowing users to set new min and max values for number generation.
 */
function onClickOptions() {
    let { minValueTemp, maxValueTemp } = parameter;

    minValueTemp = parseInt(prompt("Enter minimum value (min: 1)"));
    maxValueTemp = parseInt(prompt("Enter maximum value (max: 9999)"));

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
