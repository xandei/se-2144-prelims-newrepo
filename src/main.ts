const display = document.getElementById('display') as HTMLElement; // get the display element
let currentInput: string = ''; // stores the current input from the user
let operator: string = ''; // stores the current operator
let previousInput: string = ''; // stores the previous input before the operator
let isOperatorPressed: boolean = false; // flag to check if an operator has been pressed
let isDecimalPressed: boolean = false; // flag to check if a decimal has been pressed
let isOff: boolean = false; // flag to check if the calculator is off

function initEventListeners() {
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.getElementById('equals') as HTMLElement;
    const clearButton = document.getElementById('ac') as HTMLElement;
    const backspaceButton = document.getElementById('backspace') as HTMLElement;
    const byeButton = document.getElementById('bye') as HTMLElement;
    const helloButton = document.getElementById('hello') as HTMLElement;
    const decimalButton = document.getElementById('decimal') as HTMLElement;
    const toggleSignButton = document.getElementById('toggle-sign') as HTMLElement;

    numberButtons.forEach(button => {
        button.addEventListener('click', () => handleNumberInput(button.textContent!));
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => handleOperatorInput(button.textContent!));
    });

    equalsButton.addEventListener('click', handleEquals);
    clearButton.addEventListener('click', handleClear);
    backspaceButton.addEventListener('click', handleBackspace);
    byeButton.addEventListener('click', handleBye);
    helloButton.addEventListener('click', handleHello);
    decimalButton.addEventListener('click', handleDecimal);
    toggleSignButton.addEventListener('click', handleToggleSign);
}

function handleNumberInput(value: string) {
    if (!isOff) {
        if (currentInput.length < 18) { // limit input length
            isOperatorPressed = false; // reset operator flag

            // Allow adding a negative number only at the start
            if (currentInput === '' && value === '-') {
                currentInput = '-'; // set current input to negative
            } else if (currentInput !== '-') {
                // Append the value if it's a number and a decimal isn't already present
                if (value !== '.' || !currentInput.includes('.')) {
                    currentInput += value; // concatenate current input
                }
            }
            updateDisplay(); // update the display with the current input
        }
    }
}

function handleOperatorInput(op: string) {
    if (!isOff && !isOperatorPressed && currentInput) {
        if (operator) {
            calculateResult(); // calculate result if there's already an operator
        }
        previousInput += currentInput + ' '; // store the current input
        currentInput = ''; // clear current input
        operator = op; // set the operator
        isOperatorPressed = true; // set operator pressed flag
        updateDisplay(); // update display with current operation
    }
}

function handleEquals() {
    if (!isOff && previousInput && currentInput) {
        calculateResult(); // calculate result when equals is pressed
        updateDisplay(); // show the result on display
    }
}

function handleClear() {
    operator = '';
    previousInput = '';
    isOperatorPressed = false;
    isOff = false;
    currentInput = ''; // reset to empty string
    updateDisplay(); // clear the display
    updateDisplayColor(); // reset display color to white
}

function handleBackspace() {
    if (!isOff) {
        currentInput = currentInput.slice(0, -1); // remove the last character from current input
        if (currentInput === '') {
            currentInput = ''; // reset to empty if input is empty
        }
        updateDisplay(); // Update the display
    }
}

function handleBye() {
    display.textContent = 'Goodbye'; // show goodbye message
    isOff = true; // set calculator state to off
    updateDisplayColor(); // change display color to black
    setTimeout(() => {
        display.textContent = ''; // clear display after a delay
    }, 1500);
}

function handleHello() {
    if (!isOff) { // check if the calculator is on
        const greetings = ['Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]; // random greeting
        display.textContent = randomGreeting; // display greeting
    }
}

function handleDecimal() {
    if (!isOff) {
        // allow a decimal point only if it hasn't been pressed yet
        if (!isDecimalPressed) {
            if (currentInput === '') {
                currentInput = '0.'; // start with '0.' if current input is empty
            } else if (!currentInput.includes('.')) {
                currentInput += '.'; // append decimal point if it doesn't exist
            }
            isDecimalPressed = true; // set flag to indicate decimal has been pressed
            updateDisplay(); // update the display
        }
    }
}

function calculateResult() {
    if (!isOff) {
        let result: number;
        const prev = parseFloat(previousInput.trim()); // parse previous input
        const curr = parseFloat(currentInput); // parse current input
        
        // handle error if inputs are not valid numbers
        if (isNaN(prev) || isNaN(curr)) {
            currentInput = 'Error'; // show error message
            previousInput = ''; // clear previous input
            return;
        }

        // perform calculation based on the operator
        switch (operator) {
            case '+':
                result = prev + curr; // addition
                break;
            case '-':
                result = prev - curr; // subtraction
                break;
            case '*':
                result = prev * curr; // multiplication
                break;
            case '/':
                result = curr !== 0 ? prev / curr : 0; // handle division by zero
                break;
            default:
                result = 0; // default case
        }

        currentInput = result.toString(); // convert result to string
        previousInput = ''; // reset previous input after calculation
        operator = ''; // reset operator
        isOperatorPressed = false; // reset operator pressed flag
        isDecimalPressed = false; // reset decimal flag
        updateDisplay(); // show result
    }
}

function handleToggleSign() {
    if (!isOff && currentInput) {
        // toggle the sign of the current input
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1); // remove the '-' sign
        } else {
            currentInput = '-' + currentInput; // add the '-' sign
        }
        
        // If current input becomes empty or is just a negative sign, set it to empty
        if (currentInput === '-') {
            currentInput = ''; // clear input
        }
        
        updateDisplay(); // update the display
    }
}

function updateDisplay() {
    // update display to show both previous input and current input
    display.textContent = `${previousInput}${operator ? ' ' + operator + ' ' : ''}${currentInput}`;
}

function updateDisplayColor() {
    // change display color based on whether the calculator is off or on
    if (isOff) {
        display.style.backgroundColor = 'black'; // set background to black
        display.style.color = 'white'; // set text color to white
    } else {
        display.style.backgroundColor = 'white'; // set background to white
        display.style.color = 'black'; // set text color to black
    }
}

// initialize event listeners
initEventListeners();
updateDisplay(); // update the display initially
updateDisplayColor(); // set initial display color based on the state
