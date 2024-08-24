let wordLength = 5;

const config = {
    cardIcon: document.querySelectorAll(".card__icon"),
    cardTitle: document.querySelectorAll(".card__title"),
    cardDesc: document.querySelectorAll(".card__description"),

    btnGenerate: document.querySelector(".generate__button"),

    outputContainer: document.querySelector(".output__container"),
    outputWord: document.querySelector(".output__word"),
    triviaLabel: document.querySelector(".trivia__label"),
    triviaText: document.querySelector(".trivia__text"),
    copyIcon: document.querySelector(".clipboard__label"),
};

const clipboardIcon = {
    copy: "./src/images/clipboard.svg",
    check: "./src/images/check.svg",
};

initialize();
main();

function initialize() {
    loadFeaturesJSON();
    setFocus();
    setClipboard();
}

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

function setFocus() {
    const { btnGenerate } = config;

    btnGenerate.onfocus = () => {
        btnGenerate.style.backgroundColor = "var(--emerald-700)";
    };

    btnGenerate.onblur = () => {
        btnGenerate.style.backgroundColor = "var(--emerald-500)";
    };
}

function setClipboard() {
    const { outputContainer, copyIcon } = config;

    outputContainer.onmouseleave = () => {
        copyIcon.src = clipboardIcon.copy;
    };
}

function main() {
    const { btnGenerate, btnOptions, outputContainer } = config;

    btnGenerate.addEventListener("click", () => {
        onClickGenerate();
    });

    // btnOptions.addEventListener("click", () => {
    //     onClickOptions();
    // });

    // outputContainer.addEventListener("click", () => {
    //     onCopy();
    // });
}

async function onClickGenerate() {
    await fetchWord();
}

async function fetchWord() {
    try {
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`);
        const data = await response.json();
        const targetWord = data[0];
        const targetDefinition = await fetchDefinition(targetWord);

        displayWord(targetWord, targetDefinition);
    } catch (error) {
        console.error("Error fetching trivia:", error);
        triviaText.textContent = "Sorry, we couldn't fetch the trivia.";
    }
}

async function fetchDefinition(formattedWord) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formattedWord}`);
        const data = await response.json();

        const definition = data[0].meanings[0].definitions[0].definition;
        return definition;
    } catch (error) {
        console.error("Error fetching trivia:", error);
        triviaText.textContent = "Sorry, we couldn't fetch the trivia.";
    }
}

function formatWord(targetWord) {
    return targetWord.charAt(0).toUpperCase() + targetWord.slice(1);
}

function displayWord(targetWord, targetDefinition) {
    const { outputWord, triviaLabel, triviaText } = config;

    outputWord.textContent = targetWord;
    triviaLabel.textContent = formatWord(targetWord);
    triviaText.textContent = targetDefinition;
}
