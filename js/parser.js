// ============================================
// Calculator Expression Parser
// ============================================

// This function receives a mathematical expression
// such as "2 + 3" and returns the answer.
function calculateExpression(expression) {

    // Remove unnecessary spaces from the expression.
    expression = expression.trim();

    // Split the expression into three parts:
    // number, operator, number
    //
    // Example:
    // "2 + 3"
    //
    // becomes:
    // ["2", "+", "3"]
    const parts = expression.split(" ");

    // Make sure we have exactly three parts.
    if (parts.length !== 3) {
        throw new Error("Invalid expression");
    }

    // Convert the first value from text into a number.
    const firstNumber = Number(parts[0]);

    // Get the mathematical operator.
    const operator = parts[1];

    // Convert the second value from text into a number.
    const secondNumber = Number(parts[2]);

    // Check whether the numbers are actually valid.
    if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
        throw new Error("Invalid number");
    }

    // Perform the appropriate calculation.
    switch (operator) {

        case "+":
            return firstNumber + secondNumber;

        case "-":
            return firstNumber - secondNumber;

        case "*":
            return firstNumber * secondNumber;

        case "/":
            if (secondNumber === 0) {
                throw new Error("Cannot divide by zero");
            }

            return firstNumber / secondNumber;

        default:
            throw new Error("Unknown operator");
    }
}


// ============================================
// Temporary Tests
// ============================================

console.log(calculateExpression("2 + 3"));
console.log(calculateExpression("10 - 4"));
console.log(calculateExpression("5 * 6"));
console.log(calculateExpression("20 / 4"));
