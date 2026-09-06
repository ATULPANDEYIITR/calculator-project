// ============================================
// ADVANCED CALCULATOR ENGINE
// ============================================

// Main function
function calculateExpression(expression) {

    if (typeof expression !== "string") {
        throw new Error("Please enter a calculation.");
    }

    expression = expression.trim();

    if (expression === "") {
        throw new Error("Please enter a calculation.");
    }

    // Convert calculator symbols into symbols JavaScript understands
    expression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, "PI")
        .replace(/\^/g, "**");

    // Replace square root
    expression = expression.replace(
        /sqrt\s*\(\s*([^()]+)\s*\)/gi,
        "Math.sqrt($1)"
    );

    // Replace percentages
    expression = expression.replace(
        /(\d+(?:\.\d+)?)%/g,
        "($1/100)"
    );

    // Add Math.PI
    expression = expression.replace(/\bPI\b/g, "Math.PI");

    // Allow only safe calculator characters
    if (!/^[0-9+\-*/().\sA-Za-z]+$/.test(expression)) {
        throw new Error("Invalid characters in calculation.");
    }

    // Only allow the functions we support
    const allowedWords = [
        "Math.sqrt"
    ];

    const words = expression.match(/[A-Za-z.]+/g) || [];

    for (const word of words) {
        if (!allowedWords.includes(word)) {
            throw new Error("Unknown function.");
        }
    }

    // Check brackets
    let brackets = 0;

    for (const character of expression) {

        if (character === "(") {
            brackets++;
        }

        if (character === ")") {
            brackets--;

            if (brackets < 0) {
                throw new Error("Brackets are not correct.");
            }
        }
    }

    if (brackets !== 0) {
        throw new Error("Brackets are not correct.");
    }

    // Prevent empty brackets
    if (/\(\s*\)/.test(expression)) {
        throw new Error("Empty brackets are not allowed.");
    }

    // Prevent obvious invalid patterns
    if (/[+\-*/]{3,}/.test(expression)) {
        throw new Error("Calculation is not valid.");
    }

    // Calculate
    let result;

    try {
        result = Function(
            '"use strict"; return (' + expression + ')'
        )();
    } catch (error) {
        throw new Error("Calculation is not valid.");
    }

    // Check answer
    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Calculation produced an invalid answer.");
    }

    return Number(result.toFixed(12));
}


// ============================================
// EASY TEST FUNCTION
// ============================================

function testAdvancedCalculator() {

    const tests = [
        ["2+3", 5],
        ["2+3*4", 14],
        ["(2+3)*4", 20],
        ["12.5*4", 50],
        ["-5+10", 5],
        ["10+5*2-3", 17],
        ["2^5", 32],
        ["sqrt(25)", 5],
        ["200*10%", 20]
    ];

    console.log("===== ADVANCED CALCULATOR TESTS =====");

    tests.forEach(function(test) {

        const expression = test[0];
        const expected = test[1];

        try {

            const result = calculateExpression(expression);

            console.log(
                expression +
                " = " +
                result +
                " | Expected: " +
                expected
            );

        } catch (error) {

            console.error(
                expression +
                " | ERROR: " +
                error.message
            );
        }
    });

    console.log("===== TESTS COMPLETE =====");
}


// Run tests when page loads
testAdvancedCalculator();
