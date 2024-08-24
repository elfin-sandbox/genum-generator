/**
 * Genum - Random Word Generator
 *
 * This module provides a random word generator with additional features
 * such as displaying the word, its definition, and interacting with a dictionary API.
 *
 * @module word-generator
 */

/**
 * Initial word length used for generating random words.
 * @type {number}
 */
let wordLength = 5;

const wordLimit = {
    WORD_LENGTH_MIN: 3,
    WORD_LENGTH_MAX: 9,
    DEFAULT_LENGTH: 5,
};

/**
 * Configuration object for various UI elements and icons.
 * @type {Config}
 */
const config = {
    cardIcon: document.querySelectorAll(".card__icon"),
    cardTitle: document.querySelectorAll(".card__title"),
    cardDesc: document.querySelectorAll(".card__description"),

    btnGenerate: document.querySelector(".generate__button"),
    btnOptions: document.querySelector(".options"),
    btnDictionary: document.querySelector(".dictionary"),

    outputContainer: document.querySelector(".output__container"),
    outputLabel: document.querySelector(".output__label"),
    outputWord: document.querySelector(".output__word"),
    triviaLabel: document.querySelector(".trivia__label"),
    triviaText: document.querySelector(".trivia__text"),
    copyIcon: document.querySelector(".clipboard__label"),
};

/**
 * Object containing paths to clipboard icons.
 * @type {ClipboardIcon}
 */
const clipboardIcon = {
    copy: "./src/images/clipboard.svg",
    check: "./src/images/check.svg",
};

/**
 *  Initialize the word generator and set up event listeners
 */
initialize();
main();

/**
 * Initializes the word generator by loading features and setting clipboard functionality.
 */
function initialize() {
    loadFeaturesJSON();
    setClipboard();
}

/**
 * Loads word features from a JSON file and updates the UI with card icons, titles, and descriptions.
 */
function loadFeaturesJSON() {
    const { cardIcon, cardTitle, cardDesc } = config;

    fetch("src/json/word-features.json")
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
 * Sets the clipboard icon when the mouse leaves the output container.
 */
function setClipboard() {
    const { outputContainer, copyIcon } = config;

    outputContainer.onmouseleave = () => {
        copyIcon.src = clipboardIcon.copy;
    };
}

/**
 * Sets up event listeners for buttons.
 */
function main() {
    const { btnGenerate, btnOptions, btnDictionary, outputContainer } = config;

    btnGenerate.addEventListener("click", () => {
        onClickGenerate();
    });

    btnOptions.addEventListener("click", () => {
        onClickOptions();
    });

    btnDictionary.addEventListener("click", () => {
        onClickDictionary();
    });

    outputContainer.addEventListener("click", () => {
        onCopy();
    });
}

/**
 * Handles the click event of the generate button.
 * Fetches a random word and its definition, and then displays them.
 * @async
 */
async function onClickGenerate() {
    try {
        const targetWord = await fetchWord();
        if (targetWord) {
            const formattedWord = formatWord(targetWord);
            const targetDefinition = await fetchDefinition(formattedWord);
            displayWord(targetWord, targetDefinition);
        }
    } catch (error) {
        console.error("Error in onClickGenerate:", error);
        const { triviaText } = config;
        triviaText.textContent = "Sorry, we couldn't fetch the data.";
    }
}

/**
 * Fetches a random word from the API.
 * @returns {Promise<string>} The fetched word.
 * @async
 */
async function fetchWord() {
    try {
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`);
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching word:", error);
        return null;
    }
}

/**
 * Fetches the definition of a word from the dictionary API.
 * @param {string} formattedWord - The formatted word to get the definition for.
 * @returns {Promise<string>} The definition of the word.
 * @async
 */
async function fetchDefinition(formattedWord) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formattedWord}`);
        const data = await response.json();

        const definition = data[0].meanings[0].definitions[0].definition;
        const partSpeech = data[0].meanings[0].partOfSpeech;
        return `(${partSpeech}) ${definition}`;
    } catch (error) {
        console.error("Error fetching definition:", error);
        return "Sorry, we couldn't fetch the definition.";
    }
}

/**
 * Formats a word by capitalizing the first letter.
 * @param {string} targetWord - The word to format.
 * @returns {string} The formatted word.
 */
function formatWord(targetWord) {
    return targetWord.charAt(0).toUpperCase() + targetWord.slice(1);
}

/**
 * Displays the generated word and its definition on the page.
 * @param {string} targetWord - The word to display.
 * @param {string} targetDefinition - The definition of the word.
 */
function displayWord(targetWord, targetDefinition) {
    const { outputLabel, outputWord, triviaLabel, triviaText } = config;

    outputLabel.textContent = "Your generated word is:";
    outputWord.textContent = targetWord;
    triviaLabel.textContent = formatWord(targetWord);
    triviaText.textContent = targetDefinition;
}

/**
 * Handles the click event of the options button.
 * Allows the user to set a new word length for generating random words.
 */
function onClickOptions() {
    const { WORD_LENGTH_MIN, WORD_LENGTH_MAX, DEFAULT_LENGTH } = wordLimit;

    wordLength = parseInt(prompt("Enter word length (min: 3 / max: 9)"));

    if (isNaN(wordLength)) {
        alert("Invalid input. Please enter a number.");
        wordLength = DEFAULT_LENGTH;
        return;
    }

    if (wordLength > WORD_LENGTH_MAX) {
        alert("Word length cannot be greater than 9.");
        wordLength = DEFAULT_LENGTH;
    } else if (wordLength < WORD_LENGTH_MIN) {
        alert("Word length cannot be less than 3.");
        wordLength = DEFAULT_LENGTH;
    }
}

/**
 * Handles the click event of the dictionary button.
 * Opens a new tab with the definition of the displayed word on Wordnik.
 */
function onClickDictionary() {
    const { outputWord } = config;
    const pathWord = outputWord.textContent;

    window.open(`https://www.wordnik.com/words/${pathWord}`);
}

/**
 * Copies the generated number to the clipboard and updates the clipboard icon to show success.
 */
function onCopy() {
    const { outputWord, copyIcon } = config;

    navigator.clipboard
        .writeText(outputWord.textContent)
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
