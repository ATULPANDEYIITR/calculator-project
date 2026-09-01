const display = document.getElementById("display");

const previousDisplay =
    document.getElementById("previousDisplay");

const historyList =
    document.getElementById("historyList");

const themeButton =
    document.getElementById("themeButton");


let currentInput = "0";

let firstNumber = null;

let operator = null;

let waitingForSecondNumber = false;

let history = [];



/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    display.textContent = currentInput;

}



/* =========================
   BUTTON PRESS
========================= */

function press(value) {


    /* NUMBERS */

    if (value >= "0" && value <= "9") {

        if (currentInput === "Error") {

            currentInput = value;

        }

        else if (waitingForSecondNumber) {

            currentInput = value;

            waitingForSecondNumber = false;

        }

        else if (currentInput === "0") {

            currentInput = value;

        }

        else {

            currentInput += value;

        }

        updateDisplay();

        return;
    }



    /* DECIMAL */

    if (value === ".") {

        if (waitingForSecondNumber) {

            currentInput = "0.";

            waitingForSecondNumber = false;

        }

        else if (!currentInput.includes(".")) {

            currentInput += ".";

        }

        updateDisplay();

        return;
    }



    /* CLEAR */

    if (value === "AC") {

        currentInput = "0";

        firstNumber = null;

        operator = null;

        waitingForSecondNumber = false;

        previousDisplay.textContent = "";

        updateDisplay();

        return;
    }



    /* BACKSPACE */

    if (value === "backspace") {

        if (currentInput === "Error") {

            currentInput = "0";

        }

        else if (waitingForSecondNumber) {

            return;

        }

        else if (currentInput.length > 1) {

            currentInput =
                currentInput.slice(0, -1);

        }

        else {

            currentInput = "0";

        }

        updateDisplay();

        return;
    }



    /* PERCENTAGE */

    if (value === "%") {

        if (currentInput !== "Error") {

            currentInput =
                String(Number(currentInput) / 100);

        }

        updateDisplay();

        return;
    }



    /* OPERATORS */

    if (
        value === "+" ||
        value === "-" ||
        value === "*" ||
        value === "/"
    ) {

        if (currentInput === "Error") {

            return;

        }


        /*
        If the user enters another operator
        before pressing =, replace the operator.
        */

        if (
            operator !== null &&
            waitingForSecondNumber
        ) {

            operator = value;

            return;

        }


        firstNumber = Number(currentInput);

        operator = value;

        waitingForSecondNumber = true;


        previousDisplay.textContent =
            formatNumber(firstNumber) +
            " " +
            getOperatorSymbol(operator);

        return;
    }



    /* EQUALS */

    if (value === "=") {

        calculate();

        return;
    }

}



/* =========================
   CALCULATION
========================= */

function calculate() {


    if (
        firstNumber === null ||
        operator === null ||
        waitingForSecondNumber
    ) {

        return;
    }


    const secondNumber =
        Number(currentInput);


    let result;



    if (operator === "+") {

        result =
            firstNumber + secondNumber;

    }



    else if (operator === "-") {

        result =
            firstNumber - secondNumber;

    }



    else if (operator === "*") {

        result =
            firstNumber * secondNumber;

    }



    else if (operator === "/") {

        if (secondNumber === 0) {

            currentInput = "Error";

            previousDisplay.textContent =
                "Cannot divide by zero";

            updateDisplay();

            firstNumber = null;

            operator = null;

            waitingForSecondNumber = false;

            return;
        }


        result =
            firstNumber / secondNumber;

    }



    const expression =
        formatNumber(firstNumber) +
        " " +
        getOperatorSymbol(operator) +
        " " +
        formatNumber(secondNumber);


    currentInput =
        formatNumber(result);


    previousDisplay.textContent =
        expression + " =";


    addToHistory(
        expression,
        currentInput
    );


    firstNumber = null;

    operator = null;

    waitingForSecondNumber = true;


    updateDisplay();
}



/* =========================
   OPERATOR SYMBOL
========================= */

function getOperatorSymbol(operator) {

    if (operator === "+") {
        return "+";
    }

    if (operator === "-") {
        return "−";
    }

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    return operator;
}



/* =========================
   NUMBER FORMATTING
========================= */

function formatNumber(number) {

    if (!Number.isFinite(Number(number))) {

        return "Error";

    }


    const rounded =
        Number(
            Number(number).toFixed(10)
        );


    return String(rounded);
}



/* =========================
   HISTORY
========================= */

function addToHistory(
    expression,
    result
) {

    const calculation = {

        expression: expression,

        result: result

    };


    history.unshift(calculation);


    /*
    Keep only the latest 20 calculations.
    */

    if (history.length > 20) {

        history.pop();

    }


    saveHistory();

    displayHistory();
}



/* =========================
   DISPLAY HISTORY
========================= */

function displayHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="empty-history">No calculations yet</p>';

        return;

    }


    history.forEach(function(item) {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        historyItem.innerHTML =

            `
            <div class="history-expression">
                ${item.expression}
            </div>

            <div class="history-result">
                = ${item.result}
            </div>
            `;


        /*
        Clicking an old result puts it
        back into the calculator.
        */

        historyItem.addEventListener(
            "click",
            function() {

                currentInput =
                    item.result;

                firstNumber = null;

                operator = null;

                waitingForSecondNumber = false;

                updateDisplay();

            }
        );


        historyList.appendChild(historyItem);

    });

}



/* =========================
   SAVE HISTORY
========================= */

function saveHistory() {

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

}



/* =========================
   LOAD HISTORY
========================= */

function loadHistory() {

    const savedHistory =
        localStorage.getItem(
            "calculatorHistory"
        );


    if (savedHistory) {

        history =
            JSON.parse(savedHistory);

    }


    displayHistory();

}



/* =========================
   CLEAR HISTORY
========================= */

function clearHistory() {

    history = [];


    localStorage.removeItem(
        "calculatorHistory"
    );


    displayHistory();

}



/* =========================
   THEME
========================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    if (
        document.body.classList.contains("dark")
    ) {

        themeButton.textContent = "☀️";

        localStorage.setItem(
            "calculatorTheme",
            "dark"
        );

    }

    else {

        themeButton.textContent = "🌙";

        localStorage.setItem(
            "calculatorTheme",
            "light"
        );

    }

}



/* =========================
   LOAD THEME
========================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "calculatorTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeButton.textContent = "☀️";

    }

}



/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        /* NUMBERS */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            press(key);

        }


        /* DECIMAL */

        else if (key === ".") {

            press(".");

        }


        /* ADD */

        else if (key === "+") {

            press("+");

        }


        /* SUBTRACT */

        else if (key === "-") {

            press("-");

        }


        /* MULTIPLY */

        else if (key === "*") {

            press("*");

        }


        /* DIVIDE */

        else if (key === "/") {

            press("/");

        }


        /* ENTER */

        else if (
            key === "Enter" ||
            key === "="
        ) {

            press("=");

        }


        /* BACKSPACE */

        else if (key === "Backspace") {

            press("backspace");

        }


        /* ESCAPE */

        else if (key === "Escape") {

            press("AC");

        }


        /* PERCENT */

        else if (key === "%") {

            press("%");

        }

    }
);



/* =========================
   START APPLICATION
========================= */

loadHistory();

loadTheme();

updateDisplay();