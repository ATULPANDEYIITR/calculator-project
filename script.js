/* =========================================================
   UNIVERSAL CALCULATOR APPLICATION
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let expressionHistory = [];

let memoryValue = 0;

let undoStack = [];

let redoStack = [];

let customVariables = {};

let customConstants = {};

let precision =
    Number(
        localStorage.getItem(
            "calculatorPrecision"
        )
    ) || 10;


/* =========================================================
   ELEMENT HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function numberFrom(id) {

    return Number(
        $(id).value
    );

}


function textFrom(id) {

    return String(
        $(id).value
    ).trim();

}


function showResult(
    id,
    value
) {

    $(id).innerHTML =
        value;

}


function numberResult(
    id,
    value
) {

    showResult(
        id,
        `<strong>${formatUniversalNumber(value, precision)}</strong>`
    );

}


function safeNumber(
    id
) {

    const value =
        Number(
            $(id).value
        );


    if (
        !Number.isFinite(value)
    ) {

        throw new Error(
            "Please enter a valid number."
        );

    }


    return value;

}


/* =========================================================
   NAVIGATION
========================================================= */

function openModule(
    moduleName
) {

    document
        .querySelectorAll(".module")
        .forEach(
            module =>
                module.classList.remove(
                    "active-module"
                )
        );


    const target =
        $(
            moduleName +
            "Module"
        );


    if (target) {

        target.classList.add(
            "active-module"
        );

    }


    document
        .querySelectorAll(".nav-button")
        .forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    const names = [

        "calculator",

        "mathematics",

        "statistics",

        "physics",

        "chemistry",

        "finance",

        "business",

        "engineering",

        "programmer",

        "converter",

        "datetime",

        "ml",

        "workspace",

        "formulas"

    ];


    const index =
        names.indexOf(
            moduleName
        );


    if (
        buttons[index]
    ) {

        buttons[index]
            .classList.add(
                "active"
            );

    }

}


/* =========================================================
   ANGLE MODE
========================================================= */

function cycleAngleMode() {

    if (
        angleMode === "DEG"
    ) {

        angleMode = "RAD";

    }

    else if (
        angleMode === "RAD"
    ) {

        angleMode = "GRAD";

    }

    else {

        angleMode = "DEG";

    }


    $("angleModeButton")
        .textContent =
        angleMode;


    localStorage.setItem(
        "angleMode",
        angleMode
    );


    toast(
        "Angle mode: " +
        angleMode
    );

}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    $("themeButton")
        .textContent =
        dark ? "☀️" : "🌙";


    localStorage.setItem(
        "calculatorTheme",
        dark
            ? "dark"
            : "light"
    );

}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "calculatorTheme"
        );


    if (
        theme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

        $("themeButton")
            .textContent =
            "☀️";

    }

}


/* =========================================================
   CALCULATOR EDITING
========================================================= */

function currentExpression() {

    return $("expressionInput").value;

}


function saveUndoState() {

    undoStack.push(
        currentExpression()
    );


    if (
        undoStack.length > 100
    ) {

        undoStack.shift();

    }


    redoStack = [];

}


function insertText(
    text
) {

    saveUndoState();


    const input =
        $("expressionInput");


    const start =
        input.selectionStart;


    const end =
        input.selectionEnd;


    const old =
        input.value;


    input.value =
        old.slice(
            0,
            start
        )
        +
        text
        +
        old.slice(
            end
        );


    input.focus();


    const cursor =
        start +
        text.length;


    input.setSelectionRange(
        cursor,
        cursor
    );


    previewExpression();

}


function backspaceExpression() {

    const input =
        $("expressionInput");


    if (
        input.value.length === 0
    ) {

        return;

    }


    saveUndoState();


    const start =
        input.selectionStart;


    const end =
        input.selectionEnd;


    if (
        start !== end
    ) {

        input.value =
            input.value.slice(
                0,
                start
            )
            +
            input.value.slice(
                end
            );

    }

    else if (
        start > 0
    ) {

        input.value =
            input.value.slice(
                0,
                start - 1
            )
            +
            input.value.slice(
                start
            );


        input.setSelectionRange(
            start - 1,
            start - 1
        );

    }


    previewExpression();

}


function undoAction() {

    if (
        undoStack.length === 0
    ) {

        return;

    }


    redoStack.push(
        currentExpression()
    );


    $("expressionInput").value =
        undoStack.pop();


    previewExpression();

}


function redoAction() {

    if (
        redoStack.length === 0
    ) {

        return;

    }


    undoStack.push(
        currentExpression()
    );


    $("expressionInput").value =
        redoStack.pop();


    previewExpression();

}


/* =========================================================
   CALCULATOR
========================================================= */

function previewExpression() {

    const expression =
        currentExpression();


    if (
        !expression
    ) {

        $("expressionPreview")
            .textContent = "";

        return;

    }


    try {

        const result =
            evaluateUniversalExpression(
                expression,
                {
                    ...customVariables,
                    ...customConstants
                }
            );


        $("expressionPreview")
            .textContent =
            "Preview: " +
            formatUniversalNumber(
                result,
                precision
            );

    }

    catch {

        $("expressionPreview")
            .textContent = "";

    }

}


function calculateExpressionNow() {

    const expression =
        currentExpression();


    if (
        !expression
    ) {

        return;

    }


    try {

        const result =
            evaluateUniversalExpression(
                expression,
                {
                    ...customVariables,
                    ...customConstants
                }
            );


        const formatted =
            formatUniversalNumber(
                result,
                precision
            );


        $("calculatorResult")
            .textContent =
            formatted;


        addHistory(
            expression,
            formatted
        );


    }

    catch (error) {

        $("calculatorResult")
            .textContent =
            "Error";


        toast(
            error.message
        );

    }

}


function expressionKey(
    event
) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        calculateExpressionNow();

    }


    if (
        event.key === "Escape"
    ) {

        clearCalculator();

    }

}


function clearCalculator() {

    saveUndoState();


    $("expressionInput")
        .value = "";


    $("calculatorResult")
        .textContent =
        "0";


    $("expressionPreview")
        .textContent = "";

}


/* =========================================================
   PRECISION
========================================================= */

function updatePrecision() {

    precision =
        Math.max(
            1,
            Math.min(
                15,
                Number(
                    $("precisionInput").value
                )
            )
        );


    localStorage.setItem(
        "calculatorPrecision",
        precision
    );


    toast(
        "Precision updated."
    );

}


/* =========================================================
   MEMORY
========================================================= */

function resultAsNumber() {

    const value =
        Number(
            $("calculatorResult")
                .textContent
        );


    if (
        !Number.isFinite(value)
    ) {

        throw new Error(
            "There is no numeric result."
        );

    }


    return value;

}


function memoryClear() {

    memoryValue = 0;

    toast(
        "Memory cleared."
    );

}


function memoryRecall() {

    insertText(
        formatUniversalNumber(
            memoryValue
        )
    );

}


function memoryAdd() {

    memoryValue +=
        resultAsNumber();

    toast(
        "Added to memory."
    );

}


function memorySubtract() {

    memoryValue -=
        resultAsNumber();

    toast(
        "Subtracted from memory."
    );

}


function memoryStore() {

    memoryValue =
        resultAsNumber();

    toast(
        "Stored in memory."
    );

}


/* =========================================================
   HISTORY
========================================================= */

function addHistory(
    expression,
    result
) {

    expressionHistory.unshift({

        expression,

        result,

        date:
            new Date()
                .toLocaleString()

    });


    if (
        expressionHistory.length > 100
    ) {

        expressionHistory.pop();

    }


    localStorage.setItem(
        "universalHistory",
        JSON.stringify(
            expressionHistory
        )
    );


    renderHistory();

}


function renderHistory() {

    const list =
        $("historyList");


    list.innerHTML = "";


    if (
        expressionHistory.length === 0
    ) {

        list.innerHTML =
            "<p>No calculations yet.</p>";

        return;

    }


    expressionHistory.forEach(
        function(item, index) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "history-item";


            element.innerHTML = `

                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(item.result)}
                </div>

                <small>
                    ${escapeHTML(item.date)}
                </small>

                <div class="history-actions">

                    <button
                        onclick="event.stopPropagation(); copyText('${escapeAttribute(item.result)}')"
                    >
                        Copy
                    </button>

                    <button
                        onclick="event.stopPropagation(); deleteHistory(${index})"
                    >
                        Delete
                    </button>

                </div>

            `;


            element.onclick =
                function() {

                    $("expressionInput")
                        .value =
                        item.expression;


                    $("calculatorResult")
                        .textContent =
                        item.result;


                    openModule(
                        "calculator"
                    );

                };


            list.appendChild(
                element
            );

        }
    );

}


function loadHistory() {

    const saved =
        localStorage.getItem(
            "universalHistory"
        );


    if (
        saved
    ) {

        try {

            expressionHistory =
                JSON.parse(
                    saved
                );

        }

        catch {

            expressionHistory =
                [];

        }

    }


    renderHistory();

}


function deleteHistory(
    index
) {

    expressionHistory.splice(
        index,
        1
    );


    localStorage.setItem(
        "universalHistory",
        JSON.stringify(
            expressionHistory
        )
    );


    renderHistory();

}


function clearHistory() {

    expressionHistory =
        [];


    localStorage.removeItem(
        "universalHistory"
    );


    renderHistory();

}


/* =========================================================
   COPY
========================================================= */

function copyText(
    text
) {

    navigator.clipboard
        .writeText(
            text
        )
        .then(
            () =>
                toast(
                    "Copied."
                )
        );

}


function copyCalculatorResult() {

    copyText(
        $("calculatorResult")
            .textContent
    );

}


/* =========================================================
   MATHEMATICS
========================================================= */

function solveMathExpression() {

    try {

        const result =
            evaluateUniversalExpression(
                textFrom(
                    "mathExpression"
                )
            );


        numberResult(
            "mathExpressionResult",
            result
        );

    }

    catch (error) {

        showResult(
            "mathExpressionResult",
            error.message
        );

    }

}


function solveEquation() {

    try {

        const equation =
            textFrom(
                "equationInput"
            );


        const result =
            solveSimpleEquation(
                equation
            );


        showResult(
            "equationResult",
            JSON.stringify(
                result
            )
        );

    }

    catch (error) {

        showResult(
            "equationResult",
            error.message
        );

    }

}


function solveQuadratic() {

    try {

        const a =
            safeNumber(
                "quadA"
            );

        const b =
            safeNumber(
                "quadB"
            );

        const c =
            safeNumber(
                "quadC"
            );


        const discriminant =
            b * b -
            4 * a * c;


        if (
            a === 0
        ) {

            throw new Error(
                "a cannot be zero."
            );

        }


        if (
            discriminant >= 0
        ) {

            const x1 =
                (
                    -b +
                    Math.sqrt(
                        discriminant
                    )
                )
                /
                (
                    2 * a
                );


            const x2 =
                (
                    -b -
                    Math.sqrt(
                        discriminant
                    )
                )
                /
                (
                    2 * a
                );


            showResult(
                "quadraticResult",
                `x₁ = ${formatUniversalNumber(x1)}
                 <br>
                 x₂ = ${formatUniversalNumber(x2)}`
            );

        }

        else {

            const real =
                -b /
                (2 * a);


            const imaginary =
                Math.sqrt(
                    -discriminant
                )
                /
                (2 * a);


            showResult(
                "quadraticResult",
                `x₁ = ${formatUniversalNumber(real)}
                 + ${formatUniversalNumber(imaginary)}i
                 <br>
                 x₂ = ${formatUniversalNumber(real)}
                 - ${formatUniversalNumber(imaginary)}i`
            );

        }

    }

    catch (error) {

        showResult(
            "quadraticResult",
            error.message
        );

    }

}


function calculateSequence() {

    try {

        const type =
            $("sequenceType").value;


        const a =
            safeNumber(
                "sequenceFirst"
            );


        const difference =
            safeNumber(
                "sequenceDifference"
            );


        const n =
            safeNumber(
                "sequenceN"
            );


        let nth;

        let sum;


        if (
            type === "ap"
        ) {

            nth =
                a +
                (n - 1) *
                difference;


            sum =
                n / 2 *
                (
                    2 * a +
                    (n - 1) *
                    difference
                );

        }

        else {

            nth =
                a *
                Math.pow(
                    difference,
                    n - 1
                );


            sum =
                difference === 1

                    ? a * n

                    : a *
                      (
                          Math.pow(
                              difference,
                              n
                          ) - 1
                      )
                      /
                      (
                          difference - 1
                      );

        }


        showResult(
            "sequenceResult",
            `nth term = ${formatUniversalNumber(nth)}
             <br>
             Sum = ${formatUniversalNumber(sum)}`
        );

    }

    catch (error) {

        showResult(
            "sequenceResult",
            error.message
        );

    }

}


function numberTheory() {

    try {

        const n =
            safeNumber(
                "numberTheoryInput"
            );


        const factors =
            primeFactors(n);


        showResult(
            "numberTheoryResult",
            `Prime: ${isPrime(n)}
             <br>
             Factors: ${factors.join(" × ")}
             <br>
             Divisors: ${divisors(n).join(", ")}
             <br>
             Euler φ(n): ${eulerTotient(n)}`
        );

    }

    catch (error) {

        showResult(
            "numberTheoryResult",
            error.message
        );

    }

}


function matrixCalculate() {

    try {

        const matrix =
            parseMatrix(
                textFrom(
                    "matrixInput"
                )
            );


        const operation =
            $("matrixOperation").value;


        let result;


        if (
            operation === "det"
        ) {

            result =
                math.det(
                    matrix
                );

        }

        else if (
            operation === "inv"
        ) {

            result =
                math.inv(
                    matrix
                );

        }

        else if (
            operation === "transpose"
        ) {

            result =
                math.transpose(
                    matrix
                );

        }

        else if (
            operation === "rank"
        ) {

            result =
                math.rank(
                    matrix
                );

        }

        else {

            result =
                math.trace(
                    matrix
                );

        }


        showResult(
            "matrixResult",
            `<pre>${escapeHTML(JSON.stringify(result, null, 2))}</pre>`
        );

    }

    catch (error) {

        showResult(
            "matrixResult",
            error.message
        );

    }

}


function calculateDerivative() {

    try {

        const expression =
            textFrom(
                "calculusFunction"
            );


        const derivative =
            math.derivative(
                expression,
                "x"
            );


        const point =
            Number(
                $("calculusPoint").value
            );


        let output =
            derivative.toString();


        if (
            Number.isFinite(point)
        ) {

            output +=
                `<br>At x=${point}: ${
                    derivative.evaluate({
                        x: point
                    })
                }`;

        }


        showResult(
            "calculusResult",
            output
        );

    }

    catch (error) {

        showResult(
            "calculusResult",
            error.message
        );

    }

}


function calculateIntegral() {

    try {

        const expression =
            textFrom(
                "calculusFunction"
            );


        const point =
            Number(
                $("calculusPoint").value
            );


        if (
            !Number.isFinite(point)
        ) {

            throw new Error(
                "Enter a point for numerical integration."
            );

        }


        const fn =
            math.compile(
                expression
            );


        const start =
            0;


        const end =
            point;


        const steps =
            1000;


        const width =
            (
                end - start
            )
            /
            steps;


        let total = 0;


        for (
            let i = 0;
            i < steps;
            i++
        ) {

            const x1 =
                start +
                i * width;


            const x2 =
                x1 +
                width;


            const y1 =
                fn.evaluate({
                    x: x1
                });


            const y2 =
                fn.evaluate({
                    x: x2
                });


            total +=
                (
                    y1 + y2
                )
                *
                width
                /
                2;

        }


        showResult(
            "calculusResult",
            `Numerical integral from 0 to ${point} = ${
                formatUniversalNumber(
                    total
                )
            }`
        );

    }

    catch (error) {

        showResult(
            "calculusResult",
            error.message
        );

    }

}


function calculateNCRNPR() {

    try {

        const n =
            safeNumber(
                "nValue"
            );


        const r =
            safeNumber(
                "rValue"
            );


        showResult(
            "ncrResult",
            `nCr = ${formatUniversalNumber(nCr(n,r))}
             <br>
             nPr = ${formatUniversalNumber(nPr(n,r))}`
        );

    }

    catch (error) {

        showResult(
            "ncrResult",
            error.message
        );

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function readCSV(
    id
) {

    return textFrom(id)
        .split(",")
        .map(Number)
        .filter(
            Number.isFinite
        );

}


function descriptiveStatistics() {

    try {

        const data =
            readCSV(
                "statisticsData"
            );


        const sorted =
            [...data].sort(
                (a,b) =>
                    a-b
            );


        const q1 =
            percentile(
                data,
                25
            );


        const q3 =
            percentile(
                data,
                75
            );


        const values = {

            Count:
                data.length,

            Mean:
                mean(data),

            Median:
                median(data),

            Mode:
                mode(data).join(", "),

            Minimum:
                Math.min(...data),

            Maximum:
                Math.max(...data),

            Range:
                Math.max(...data) -
                Math.min(...data),

            "Population Variance":
                variance(
                    data,
                    false
                ),

            "Sample Variance":
                variance(
                    data,
                    true
                ),

            "Population SD":
                standardDeviation(
                    data,
                    false
                ),

            "Sample SD":
                standardDeviation(
                    data,
                    true
                ),

            Q1:
                q1,

            Q3:
                q3,

            IQR:
                q3 - q1,

            "Mean Absolute Deviation":
                data.reduce(
                    (
                        sum,
                        value
                    ) =>
                        sum +
                        Math.abs(
                            value -
                            mean(data)
                        ),
                    0
                )
                /
                data.length

        };


        $("statisticsResult")
            .innerHTML =
            Object.entries(
                values
            )
            .map(
                (
                    [key,value]
                ) =>
                    `
                    <div class="stat-box">
                        <span>${key}</span>
                        <strong>${typeof value === "number"
                            ? formatUniversalNumber(value)
                            : value}</strong>
                    </div>
                    `
            )
            .join("");

    }

    catch (error) {

        showResult(
            "statisticsResult",
            error.message
        );

    }

}


function calculateZScore() {

    try {

        const x =
            safeNumber(
                "zX"
            );


        const meanValue =
            safeNumber(
                "zMean"
            );


        const sd =
            safeNumber(
                "zSD"
            );


        numberResult(
            "zResult",
            (
                x - meanValue
            )
            /
            sd
        );

    }

    catch (error) {

        showResult(
            "zResult",
            error.message
        );

    }

}


function probabilityCalculations() {

    try {

        const a =
            safeNumber(
                "probabilityA"
            );


        const b =
            safeNumber(
                "probabilityB"
            );


        showResult(
            "probabilityResult",
            `P(A∩B) assuming independence = ${
                formatUniversalNumber(a*b)
            }
            <br>
            P(A∪B) assuming independence = ${
                formatUniversalNumber(
                    a+b-a*b
                )
            }`
        );

    }

    catch (error) {

        showResult(
            "probabilityResult",
            error.message
        );

    }

}


function normalDistribution() {

    try {

        const x =
            safeNumber(
                "normalX"
            );


        const m =
            safeNumber(
                "normalMean"
            );


        const sd =
            safeNumber(
                "normalSD"
            );


        numberResult(
            "normalResult",
            normalPDF(
                x,
                m,
                sd
            )
        );

    }

    catch (error) {

        showResult(
            "normalResult",
            error.message
        );

    }

}


function linearRegression() {

    try {

        const x =
            readCSV(
                "regressionX"
            );


        const y =
            readCSV(
                "regressionY"
            );


        if (
            x.length !== y.length
        ) {

            throw new Error(
                "X and Y must have the same length."
            );

        }


        const xMean =
            mean(x);


        const yMean =
            mean(y);


        const slope =
            x.reduce(
                (
                    sum,
                    value,
                    i
                ) =>
                    sum +
                    (
                        value-xMean
                    ) *
                    (
                        y[i]-yMean
                    ),
                0
            )
            /
            x.reduce(
                (
                    sum,
                    value
                ) =>
                    sum +
                    Math.pow(
                        value-xMean,
                        2
                    ),
                0
            );


        const intercept =
            yMean -
            slope*xMean;


        const r =
            correlation(
                x,
                y
            );


        showResult(
            "regressionResult",
            `Slope = ${formatUniversalNumber(slope)}
             <br>
             Intercept = ${formatUniversalNumber(intercept)}
             <br>
             R = ${formatUniversalNumber(r)}
             <br>
             R² = ${formatUniversalNumber(r*r)}`
        );

    }

    catch (error) {

        showResult(
            "regressionResult",
            error.message
        );

    }

}


/* =========================================================
   PHYSICS
========================================================= */

function physicsForce() {

    const m =
        safeNumber(
            "forceMass"
        );


    const a =
        safeNumber(
            "forceAcceleration"
        );


    numberResult(
        "forceResult",
        m*a
    );

}


function kineticEnergy() {

    const m =
        safeNumber(
            "kineticMass"
        );


    const v =
        safeNumber(
            "kineticVelocity"
        );


    numberResult(
        "kineticResult",
        0.5*m*v*v
    );

}


function potentialEnergy() {

    const m =
        safeNumber(
            "potentialMass"
        );


    const h =
        safeNumber(
            "potentialHeight"
        );


    const g =
        safeNumber(
            "potentialGravity"
        );


    numberResult(
        "potentialResult",
        m*g*h
    );

}


function ohmsLaw() {

    const V =
        Number(
            $("ohmVoltage").value
        );


    const I =
        Number(
            $("ohmCurrent").value
        );


    const R =
        Number(
            $("ohmResistance").value
        );


    if (
        Number.isFinite(V)
        &&
        Number.isFinite(I)
    ) {

        numberResult(
            "ohmResult",
            V/I
        );

    }

    else if (
        Number.isFinite(V)
        &&
        Number.isFinite(R)
    ) {

        numberResult(
            "ohmResult",
            V/R
        );

    }

    else if (
        Number.isFinite(I)
        &&
        Number.isFinite(R)
    ) {

        numberResult(
            "ohmResult",
            I*R
        );

    }

    else {

        showResult(
            "ohmResult",
            "Enter any two values."
        );

    }

}


function electricalPower() {

    const V =
        safeNumber(
            "powerVoltage"
        );


    const I =
        safeNumber(
            "powerCurrent"
        );


    numberResult(
        "powerResult",
        V*I
    );

}


function idealGasLaw() {

    const n =
        safeNumber(
            "gasN"
        );


    const R =
        safeNumber(
            "gasR"
        );


    const T =
        safeNumber(
            "gasT"
        );


    const V =
        safeNumber(
            "gasV"
        );


    numberResult(
        "gasResult",
        n*R*T/V
    );

}


function projectileMotion() {

    const v =
        safeNumber(
            "projectileVelocity"
        );


    const angle =
        safeNumber(
            "projectileAngle"
        );


    const g =
        safeNumber(
            "projectileGravity"
        );


    const radians =
        degreesToRadians(
            angle
        );


    const range =
        v*v *
        Math.sin(
            2*radians
        )
        /
        g;


    const height =
        v*v *
        Math.pow(
            Math.sin(radians),
            2
        )
        /
        (2*g);


    const time =
        2*v*
        Math.sin(radians)
        /
        g;


    showResult(
        "projectileResult",
        `Range = ${formatUniversalNumber(range)} m
         <br>
         Maximum height = ${formatUniversalNumber(height)} m
         <br>
         Flight time = ${formatUniversalNumber(time)} s`
    );

}


function massEnergy() {

    const mass =
        safeNumber(
            "massRelativity"
        );


    numberResult(
        "massEnergyResult",
        mass *
        Math.pow(
            UNIVERSAL_CONSTANTS.c,
            2
        )
    );

}


/* =========================================================
   CHEMISTRY
========================================================= */

function calculateMoles() {

    const mass =
        safeNumber(
            "chemMass"
        );


    const molarMass =
        safeNumber(
            "chemMolarMass"
        );


    numberResult(
        "molesResult",
        mass /
        molarMass
    );

}


function calculateMolarity() {

    const moles =
        safeNumber(
            "molarityMoles"
        );


    const volume =
        safeNumber(
            "molarityVolume"
        );


    numberResult(
        "molarityResult",
        moles /
        volume
    );

}


function calculateDilution() {

    const C1 =
        safeNumber(
            "dilutionC1"
        );


    const V1 =
        safeNumber(
            "dilutionV1"
        );


    const C2 =
        safeNumber(
            "dilutionC2"
        );


    numberResult(
        "dilutionResult",
        C1*V1/C2
    );

}


function calculatePH() {

    const concentration =
        safeNumber(
            "phConcentration"
        );


    numberResult(
        "phResult",
        -Math.log10(
            concentration
        )
    );

}


function chemGasPressure() {

    const n =
        safeNumber(
            "chemGasN"
        );


    const T =
        safeNumber(
            "chemGasT"
        );


    const V =
        safeNumber(
            "chemGasV"
        );


    const R =
        0.082057;


    numberResult(
        "chemGasResult",
        n*R*T/V
    );

}


function radioactiveDecay() {

    const initial =
        safeNumber(
            "decayInitial"
        );


    const halfLife =
        safeNumber(
            "decayHalfLife"
        );


    const time =
        safeNumber(
            "decayTime"
        );


    numberResult(
        "decayResult",
        initial *
        Math.pow(
            0.5,
            time/halfLife
        )
    );

}


/* =========================================================
   FINANCE
========================================================= */

function financeEMI() {

    try {

        const P =
            safeNumber(
                "financePrincipal"
            );


        const rate =
            safeNumber(
                "financeRate"
            );


        const years =
            safeNumber(
                "financeTenure"
            );


        const emi =
            calculateEMI(
                P,
                rate,
                years
            );


        const total =
            emi *
            years *
            12;


        showResult(
            "financeEMIResult",
            `Monthly EMI: ${money(emi)}
             <br>
             Total payment: ${money(total)}
             <br>
             Total interest: ${money(total-P)}`
        );

    }

    catch (error) {

        showResult(
            "financeEMIResult",
            error.message
        );

    }

}


function financeSIP() {

    const monthly =
        safeNumber(
            "sipMonthly"
        );


    const rate =
        safeNumber(
            "sipRate"
        );


    const years =
        safeNumber(
            "sipYears"
        );


    const value =
        calculateSIP(
            monthly,
            rate,
            years
        );


    const invested =
        monthly *
        years *
        12;


    showResult(
        "sipResult",
        `Invested: ${money(invested)}
         <br>
         Future value: ${money(value)}
         <br>
         Profit: ${money(value-invested)}`
    );

}


function compoundInterest() {

    const P =
        safeNumber(
            "ciPrincipal"
        );


    const r =
        safeNumber(
            "ciRate"
        );


    const t =
        safeNumber(
            "ciYears"
        );


    const n =
        safeNumber(
            "ciFrequency"
        );


    const amount =
        compoundAmount(
            P,
            r,
            t,
            n
        );


    showResult(
        "ciResult",
        `Final amount: ${money(amount)}
         <br>
         Interest: ${money(amount-P)}`
    );

}


function calculateCAGR() {

    const start =
        safeNumber(
            "cagrStart"
        );


    const end =
        safeNumber(
            "cagrEnd"
        );


    const years =
        safeNumber(
            "cagrYears"
        );


    numberResult(
        "cagrResult",
        CAGR(
            start,
            end,
            years
        )
    );


    $("cagrResult")
        .innerHTML +=
        "%";

}


function calculateNPV() {

    const rate =
        safeNumber(
            "npvRate"
        );


    const flows =
        readCSV(
            "npvFlows"
        );


    numberResult(
        "npvResult",
        NPV(
            rate,
            flows
        )
    );

}


function calculateROI() {

    const finalValue =
        safeNumber(
            "roiGain"
        );


    const initial =
        safeNumber(
            "roiCost"
        );


    numberResult(
        "roiResult",
        (
            (
                finalValue -
                initial
            )
            /
            initial
        ) * 100
    );


    $("roiResult")
        .innerHTML +=
        "%";

}


function corporateFinance() {

    const revenue =
        safeNumber(
            "corpRevenue"
        );


    const cogs =
        safeNumber(
            "corpCOGS"
        );


    const opex =
        safeNumber(
            "corpOpex"
        );


    const depreciation =
        safeNumber(
            "corpDA"
        );


    const amortization =
        safeNumber(
            "corpAmortization"
        );


    const interest =
        safeNumber(
            "corpInterest"
        );


    const taxRate =
        safeNumber(
            "corpTaxRate"
        );


    const grossProfit =
        revenue-cogs;


    const ebitda =
        calculateEBITDA(
            revenue,
            cogs,
            opex
        );


    const ebit =
        calculateEBIT(
            ebitda,
            depreciation,
            amortization
        );


    const ebt =
        calculateEBT(
            ebit,
            interest
        );


    const tax =
        ebt *
        taxRate /
        100;


    const netIncome =
        ebt-tax;


    $("corporateResult")
        .innerHTML = `

        <div class="stat-box">
            <span>Revenue</span>
            <strong>${money(revenue)}</strong>
        </div>

        <div class="stat-box">
            <span>Gross Profit</span>
            <strong>${money(grossProfit)}</strong>
        </div>

        <div class="stat-box">
            <span>Gross Margin</span>
            <strong>${formatUniversalNumber(
                grossProfit/revenue*100
            )}%</strong>
        </div>

        <div class="stat-box">
            <span>EBITDA</span>
            <strong>${money(ebitda)}</strong>
        </div>

        <div class="stat-box">
            <span>EBITDA Margin</span>
            <strong>${formatUniversalNumber(
                ebitda/revenue*100
            )}%</strong>
        </div>

        <div class="stat-box">
            <span>EBIT</span>
            <strong>${money(ebit)}</strong>
        </div>

        <div class="stat-box">
            <span>EBT</span>
            <strong>${money(ebt)}</strong>
        </div>

        <div class="stat-box">
            <span>Tax</span>
            <strong>${money(tax)}</strong>
        </div>

        <div class="stat-box">
            <span>Net Income</span>
            <strong>${money(netIncome)}</strong>
        </div>

        <div class="stat-box">
            <span>Net Margin</span>
            <strong>${formatUniversalNumber(
                netIncome/revenue*100
            )}%</strong>
        </div>

    `;

}


function breakEven() {

    const fixed =
        safeNumber(
            "breakFixed"
        );


    const price =
        safeNumber(
            "breakPrice"
        );


    const variable =
        safeNumber(
            "breakVariable"
        );


    const units =
        fixed /
        (
            price-variable
        );


    showResult(
        "breakEvenResult",
        `Break-even units:
         ${formatUniversalNumber(units)}
         <br>
         Break-even revenue:
         ${money(units*price)}`
    );

}


function calculateWACC() {

    const E =
        safeNumber(
            "waccEquity"
        );


    const D =
        safeNumber(
            "waccDebt"
        );


    const Ke =
        safeNumber(
            "waccCostEquity"
        );


    const Kd =
        safeNumber(
            "waccCostDebt"
        );


    const tax =
        safeNumber(
            "waccTax"
        );


    const total =
        E+D;


    const wacc =
        E/total*Ke
        +
        D/total*Kd*(1-tax/100);


    showResult(
        "waccResult",
        formatUniversalNumber(
            wacc
        ) + "%"
    );

}


function calculateCAPM() {

    const rf =
        safeNumber(
            "capmRiskFree"
        );


    const beta =
        safeNumber(
            "capmBeta"
        );


    const market =
        safeNumber(
            "capmMarket"
        );


    numberResult(
        "capmResult",
        rf +
        beta *
        (
            market-rf
        )
    );


    $("capmResult")
        .innerHTML +=
        "%";

}


/* =========================================================
   BUSINESS
========================================================= */

function calculateCAC() {

    const spend =
        safeNumber(
            "cacMarketing"
        );


    const customers =
        safeNumber(
            "cacCustomers"
        );


    numberResult(
        "cacResult",
        spend/customers
    );

}


function calculateLTV() {

    const arpu =
        safeNumber(
            "ltvARPU"
        );


    const margin =
        safeNumber(
            "ltvMargin"
        );


    const lifetime =
        safeNumber(
            "ltvLifetime"
        );


    numberResult(
        "ltvResult",
        arpu *
        margin/100 *
        lifetime
    );

}


function calculateLTVCAC() {

    const ltv =
        safeNumber(
            "ltvValue"
        );


    const cac =
        safeNumber(
            "cacValue"
        );


    numberResult(
        "ltvCacResult",
        ltv/cac
    );


    $("ltvCacResult")
        .innerHTML +=
        " : 1";

}


function saasMetrics() {

    const mrr =
        safeNumber(
            "saasMRR"
        );


    const churn =
        safeNumber(
            "saasChurn"
        );


    const customers =
        safeNumber(
            "saasCustomers"
        );


    const arr =
        mrr*12;


    const arpu =
        mrr/customers;


    showResult(
        "saasResult",
        `MRR: ${money(mrr)}
         <br>
         ARR: ${money(arr)}
         <br>
         ARPU: ${money(arpu)}
         <br>
         Annual churn estimate: ${formatUniversalNumber(
            1-Math.pow(
                1-churn/100,
                12
            )
        )*100}%`
    );

}


function marketingMetrics() {

    const clicks =
        safeNumber(
            "marketingClicks"
        );


    const impressions =
        safeNumber(
            "marketingImpressions"
        );


    const spend =
        safeNumber(
            "marketingSpend"
        );


    const conversions =
        safeNumber(
            "marketingConversions"
        );


    const ctr =
        clicks/
        impressions*100;


    const cpc =
        spend/clicks;


    const cpa =
        spend/conversions;


    const conversionRate =
        conversions/
        clicks*100;


    showResult(
        "marketingResult",
        `CTR: ${formatUniversalNumber(ctr)}%
         <br>
         CPC: ${money(cpc)}
         <br>
         CPA: ${money(cpa)}
         <br>
         Conversion rate: ${formatUniversalNumber(conversionRate)}%`
    );

}


function projectMetrics() {

    const ev =
        safeNumber(
            "pmEV"
        );


    const pv =
        safeNumber(
            "pmPV"
        );


    const ac =
        safeNumber(
            "pmAC"
        );


    const cpi =
        ev/ac;


    const spi =
        ev/pv;


    showResult(
        "projectResult",
        `CPI: ${formatUniversalNumber(cpi)}
         <br>
         SPI: ${formatUniversalNumber(spi)}
         <br>
         Cost variance: ${money(ev-ac)}
         <br>
         Schedule variance: ${money(ev-pv)}`
    );

}


/* =========================================================
   ENGINEERING
========================================================= */

function engineeringStress() {

    numberResult(
        "stressResult",
        safeNumber(
            "stressForce"
        )
        /
        safeNumber(
            "stressArea"
        )
    );

}


function engineeringStrain() {

    numberResult(
        "strainResult",
        safeNumber(
            "strainChange"
        )
        /
        safeNumber(
            "strainOriginal"
        )
    );

}


function youngModulus() {

    numberResult(
        "youngResult",
        safeNumber(
            "youngStress"
        )
        /
        safeNumber(
            "youngStrain"
        )
    );

}


function gearRatio() {

    numberResult(
        "gearResult",
        safeNumber(
            "gearInput"
        )
        /
        safeNumber(
            "gearOutput"
        )
    );

}


function threePhasePower() {

    const voltage =
        safeNumber(
            "threeVoltage"
        );


    const current =
        safeNumber(
            "threeCurrent"
        );


    const pf =
        safeNumber(
            "threePF"
        );


    numberResult(
        "threePhaseResult",
        Math.sqrt(3) *
        voltage *
        current *
        pf
    );

}


function reynoldsNumber() {

    const density =
        safeNumber(
            "reynoldsDensity"
        );


    const velocity =
        safeNumber(
            "reynoldsVelocity"
        );


    const length =
        safeNumber(
            "reynoldsLength"
        );


    const viscosity =
        safeNumber(
            "reynoldsViscosity"
        );


    numberResult(
        "reynoldsResult",
        density *
        velocity *
        length /
        viscosity
    );

}


/* =========================================================
   PROGRAMMER
========================================================= */

function programmerConvert(
    base
) {

    try {

        const value =
            textFrom(
                "programmerValue"
            );


        let number;


        if (
            base === 2
        ) {

            number =
                parseInt(
                    value,
                    2
                );

        }

        else if (
            base === 8
        ) {

            number =
                parseInt(
                    value,
                    8
                );

        }

        else if (
            base === 16
        ) {

            number =
                parseInt(
                    value,
                    16
                );

        }

        else {

            number =
                parseInt(
                    value,
                    10
                );

        }


        if (
            Number.isNaN(number)
        ) {

            throw new Error(
                "Invalid number."
            );

        }


        $("programmerResult")
            .innerHTML = `

            <div class="programmer-result">
                Binary:
                <strong>
                    ${number.toString(2)}
                </strong>
            </div>

            <div class="programmer-result">
                Octal:
                <strong>
                    ${number.toString(8)}
                </strong>
            </div>

            <div class="programmer-result">
                Decimal:
                <strong>
                    ${number}
                </strong>
            </div>

            <div class="programmer-result">
                Hexadecimal:
                <strong>
                    ${number.toString(16).toUpperCase()}
                </strong>
            </div>

        `;

    }

    catch (error) {

        showResult(
            "programmerResult",
            error.message
        );

    }

}


function bitwiseOperations() {

    const a =
        parseInt(
            textFrom(
                "bitA"
            ),
            10
        );


    const b =
        parseInt(
            textFrom(
                "bitB"
            ),
            10
        );


    showResult(
        "bitwiseResult",
        `AND: ${a & b}
         <br>
         OR: ${a | b}
         <br>
         XOR: ${a ^ b}
         <br>
         NOT A: ${~a}
         <br>
         A << 1: ${a << 1}
         <br>
         A >> 1: ${a >> 1}`
    );

}


function calculateSubnet() {

    try {

        const ip =
            textFrom(
                "ipAddress"
            );


        const cidrValue =
            Number(
                $("cidr").value
            );


        const parts =
            ip.split(".")
                .map(Number);


        if (
            parts.length !== 4 ||
            cidrValue < 0 ||
            cidrValue > 32
        ) {

            throw new Error(
                "Invalid IPv4 address or CIDR."
            );

        }


        const ipNumber =
            (
                parts[0] << 24
            )
            |
            (
                parts[1] << 16
            )
            |
            (
                parts[2] << 8
            )
            |
            parts[3];


        const mask =
            cidrValue === 0
                ? 0
                : (
                    0xffffffff <<
                    (
                        32-cidrValue
                    )
                );


        const network =
            ipNumber &
            mask;


        const broadcast =
            network |
            (~mask);


        function toIP(
            value
        ) {

            return [
                (value >>> 24) & 255,
                (value >>> 16) & 255,
                (value >>> 8) & 255,
                value & 255
            ].join(".");

        }


        const hostBits =
            32-cidrValue;


        const hosts =
            hostBits <= 1
                ? 0
                : Math.pow(
                    2,
                    hostBits
                )-2;


        showResult(
            "subnetResult",
            `Network: ${toIP(network)}
             <br>
             Broadcast: ${toIP(broadcast)}
             <br>
             CIDR: /${cidrValue}
             <br>
             Usable hosts: ${hosts}`
        );

    }

    catch (error) {

        showResult(
            "subnetResult",
            error.message
        );

    }

}


/* =========================================================
   UNIT CONVERTER
========================================================= */

function loadConverterUnits() {

    const category =
        $("converterCategory").value;


    const from =
        $("converterFrom");


    const to =
        $("converterTo");


    from.innerHTML = "";

    to.innerHTML = "";


    if (
        category === "temperature"
    ) {

        [
            "Celsius",
            "Fahrenheit",
            "Kelvin"
        ]
        .forEach(
            unit => {

                from.innerHTML +=
                    `<option>${unit}</option>`;

                to.innerHTML +=
                    `<option>${unit}</option>`;

            }
        );

        return;

    }


    const table =
        UNIT_TABLES[
            category
        ];


    Object.keys(
        table
    )
    .forEach(
        unit => {

            from.innerHTML +=
                `<option value="${unit}">
                    ${unit}
                </option>`;

            to.innerHTML +=
                `<option value="${unit}">
                    ${unit}
                </option>`;

        }
    );


    convertUnits();

}


function convertUnits() {

    const category =
        $("converterCategory").value;


    const value =
        Number(
            $("converterValue").value
        );


    if (
        !Number.isFinite(value)
    ) {

        $("converterResult")
            .textContent =
            "Enter a value.";

        return;

    }


    const from =
        $("converterFrom").value;


    const to =
        $("converterTo").value;


    let result;


    if (
        category ===
        "temperature"
    ) {

        result =
            convertTemperature(
                value,
                from,
                to
            );

    }

    else {

        const table =
            UNIT_TABLES[
                category
            ];


        result =
            value *
            table[from]
            /
            table[to];

    }


    $("converterResult")
        .textContent =
        `${formatUniversalNumber(result)}
         ${to}`;

}


/* =========================================================
   DATE & TIME
========================================================= */

function dateDifference() {

    const start =
        new Date(
            $("dateStart").value
        );


    const end =
        new Date(
            $("dateEnd").value
        );


    const milliseconds =
        Math.abs(
            end-start
        );


    const days =
        milliseconds /
        86400000;


    showResult(
        "dateDifferenceResult",
        `${formatUniversalNumber(days)} days
         <br>
         ${formatUniversalNumber(days/7)} weeks`
    );

}


function calculateAge() {

    const birth =
        new Date(
            $("birthDate").value
        );


    const now =
        new Date();


    let years =
        now.getFullYear() -
        birth.getFullYear();


    const monthDifference =
        now.getMonth() -
        birth.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            now.getDate() <
            birth.getDate()
        )
    ) {

        years--;

    }


    showResult(
        "ageResult",
        `${years} years old`
    );

}


function addDaysToDate() {

    const date =
        new Date(
            $("dateBase").value
        );


    const days =
        safeNumber(
            "dateDays"
        );


    date.setDate(
        date.getDate() +
        days
    );


    showResult(
        "addDaysResult",
        date.toLocaleDateString()
    );

}


/* =========================================================
   MACHINE LEARNING
========================================================= */

function runClassificationMetrics() {

    const tp =
        safeNumber(
            "mlTP"
        );


    const tn =
        safeNumber(
            "mlTN"
        );


    const fp =
        safeNumber(
            "mlFP"
        );


    const fn =
        safeNumber(
            "mlFN"
        );


    const result =
        classificationMetrics(
            tp,
            tn,
            fp,
            fn
        );


    showResult(
        "mlResult",
        `Accuracy: ${result.accuracy}
         <br>
         Precision: ${result.precision}
         <br>
         Recall: ${result.recall}
         <br>
         Specificity: ${result.specificity}
         <br>
         F1: ${result.f1}`
    );

}


/*
   The public function above would have the same
   name as the mathematical helper. Rename the
   mathematical helper here for browser safety.
*/

const classificationMetricEngine =
    classificationMetrics;


/* =========================================================
   REGRESSION METRICS
========================================================= */

function regressionMetrics() {

    const actual =
        readCSV(
            "actualValues"
        );


    const predicted =
        readCSV(
            "predictedValues"
        );


    if (
        actual.length !==
        predicted.length
    ) {

        throw new Error(
            "Arrays must have equal length."
        );

    }


    const errors =
        actual.map(
            (
                value,
                index
            ) =>
                value -
                predicted[index]
        );


    const mae =
        errors.reduce(
            (
                sum,
                error
            ) =>
                sum +
                Math.abs(error),
            0
        )
        /
        errors.length;


    const mse =
        errors.reduce(
            (
                sum,
                error
            ) =>
                sum +
                error*error,
            0
        )
        /
        errors.length;


    const rmse =
        Math.sqrt(
            mse
        );


    const meanActual =
        mean(
            actual
        );


    const ssTotal =
        actual.reduce(
            (
                sum,
                value
            ) =>
                sum +
                Math.pow(
                    value -
                    meanActual,
                    2
                ),
            0
        );


    const ssResidual =
        errors.reduce(
            (
                sum,
                error
            ) =>
                sum +
                error*error,
            0
        );


    const r2 =
        1 -
        ssResidual /
        ssTotal;


    showResult(
        "regressionMetricsResult",
        `MAE: ${formatUniversalNumber(mae)}
         <br>
         MSE: ${formatUniversalNumber(mse)}
         <br>
         RMSE: ${formatUniversalNumber(rmse)}
         <br>
         R²: ${formatUniversalNumber(r2)}`
    );

}


function entropyGini() {

    const probabilities =
        readCSV(
            "classProbabilities"
        );


    const entropy =
        probabilities.reduce(
            (
                sum,
                p
            ) =>
                p > 0
                    ? sum -
                      p *
                      Math.log2(p)
                    : sum,
            0
        );


    const gini =
        1 -
        probabilities.reduce(
            (
                sum,
                p
            ) =>
                sum+p*p,
            0
        );


    showResult(
        "entropyResult",
        `Entropy: ${formatUniversalNumber(entropy)}
         <br>
         Gini impurity: ${formatUniversalNumber(gini)}`
    );

}


/* =========================================================
   WORKSPACE
========================================================= */

function runWorkspace() {

    const text =
        $("workspaceInput").value;


    const lines =
        text
            .split("\n")
            .map(
                line =>
                    line.trim()
            )
            .filter(
                Boolean
            );


    const variables = {

        ...customVariables,

        ...customConstants

    };


    const results = [];


    lines.forEach(
        function(line) {

            if (
                !line.includes("=")
            ) {

                return;

            }


            const parts =
                line.split("=");


            const name =
                parts
                    .shift()
                    .trim();


            const expression =
                parts
                    .join("=")
                    .trim();


            try {

                const value =
                    evaluateUniversalExpression(
                        expression,
                        variables
                    );


                variables[name] =
                    value;


                customVariables[name] =
                    value;


                results.push({

                    name,

                    value

                });

            }

            catch {

                results.push({

                    name,

                    value:
                        "Error"

                });

            }

        }
    );


    $("workspaceResult")
        .innerHTML =
        results.map(
            item =>
                `
                <div class="workspace-line">
                    <span>
                        ${escapeHTML(item.name)}
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(
                                item.value
                            )
                        )}
                    </strong>
                </div>
                `
        )
        .join("");


    localStorage.setItem(
        "customVariables",
        JSON.stringify(
            customVariables
        )
    );

}


function saveWorkspace() {

    localStorage.setItem(
        "savedWorkspace",
        $("workspaceInput").value
    );


    toast(
        "Workspace saved."
    );

}


function loadWorkspace() {

    const saved =
        localStorage.getItem(
            "savedWorkspace"
        );


    if (
        saved
    ) {

        $("workspaceInput")
            .value =
            saved;

    }

}


/* =========================================================
   FORMULA LIBRARY
========================================================= */

const FORMULAS = [

    {
        category:
            "Mathematics",

        name:
            "Quadratic Formula",

        formula:
            "x = (-b ± √(b² - 4ac)) / 2a",

        description:
            "Solves ax² + bx + c = 0."
    },


    {
        category:
            "Mathematics",

        name:
            "Arithmetic Progression",

        formula:
            "aₙ = a₁ + (n - 1)d",

        description:
            "Finds the nth term of an arithmetic sequence."
    },


    {
        category:
            "Mathematics",

        name:
            "Geometric Progression",

        formula:
            "aₙ = a₁rⁿ⁻¹",

        description:
            "Finds the nth term of a geometric sequence."
    },


    {
        category:
            "Calculus",

        name:
            "Derivative",

        formula:
            "dy/dx",

        description:
            "Measures the rate at which a function changes."
    },


    {
        category:
            "Physics",

        name:
            "Newton's Second Law",

        formula:
            "F = ma",

        description:
            "Force equals mass multiplied by acceleration."
    },


    {
        category:
            "Physics",

        name:
            "Kinetic Energy",

        formula:
            "KE = ½mv²",

        description:
            "Energy associated with motion."
    },


    {
        category:
            "Physics",

        name:
            "Potential Energy",

        formula:
            "PE = mgh",

        description:
            "Gravitational potential energy near Earth's surface."
    },


    {
        category:
            "Physics",

        name:
            "Einstein's Equation",

        formula:
            "E = mc²",

        description:
            "Mass-energy equivalence."
    },


    {
        category:
            "Chemistry",

        name:
            "Ideal Gas Law",

        formula:
            "PV = nRT",

        description:
            "Relates pressure, volume, amount and temperature of an ideal gas."
    },


    {
        category:
            "Chemistry",

        name:
            "Molarity",

        formula:
            "M = moles / litres",

        description:
            "Concentration expressed as moles per litre."
    },


    {
        category:
            "Chemistry",

        name:
            "pH",

        formula:
            "pH = -log₁₀[H⁺]",

        description:
            "Measures hydrogen ion concentration."
    },


    {
        category:
            "Finance",

        name:
            "Compound Interest",

        formula:
            "A = P(1 + r/n)ⁿᵗ",

        description:
            "Calculates the value of an investment with compound growth."
    },


    {
        category:
            "Finance",

        name:
            "CAGR",

        formula:
            "CAGR = (Ending / Beginning)^(1/n) - 1",

        description:
            "Compound annual growth rate."
    },


    {
        category:
            "Finance",

        name:
            "EMI",

        formula:
            "EMI = P r (1+r)ⁿ / ((1+r)ⁿ - 1)",

        description:
            "Monthly loan repayment calculation."
    },


    {
        category:
            "Finance",

        name:
            "CAPM",

        formula:
            "Ke = Rf + β(Rm - Rf)",

        description:
            "Estimates expected return on an investment."
    },


    {
        category:
            "Finance",

        name:
            "WACC",

        formula:
            "WACC = E/V Ke + D/V Kd(1-T)",

        description:
            "Weighted average cost of capital."
    },


    {
        category:
            "Business",

        name:
            "EBITDA",

        formula:
            "EBITDA = EBIT + D&A",

        description:
            "Earnings before interest, taxes, depreciation and amortization."
    },


    {
        category:
            "Business",

        name:
            "Gross Margin",

        formula:
            "Gross Profit / Revenue × 100",

        description:
            "Measures gross profitability."
    },


    {
        category:
            "Business",

        name:
            "Break-even",

        formula:
            "Fixed Cost / (Price - Variable Cost)",

        description:
            "Number of units required to cover costs."
    },


    {
        category:
            "Statistics",

        name:
            "Z-score",

        formula:
            "z = (x - μ) / σ",

        description:
            "Measures how many standard deviations a value is from the mean."
    },


    {
        category:
            "Statistics",

        name:
            "Variance",

        formula:
            "σ² = Σ(x - μ)² / N",

        description:
            "Measures dispersion around the mean."
    },


    {
        category:
            "Machine Learning",

        name:
            "Precision",

        formula:
            "TP / (TP + FP)",

        description:
            "Fraction of positive predictions that are correct."
    },


    {
        category:
            "Machine Learning",

        name:
            "Recall",

        formula:
            "TP / (TP + FN)",

        description:
            "Fraction of actual positives correctly identified."
    },


    {
        category:
            "Machine Learning",

        name:
            "F1 Score",

        formula:
            "2PR / (P + R)",

        description:
            "Harmonic mean of precision and recall."
    },


    {
        category:
            "Engineering",

        name:
            "Stress",

        formula:
            "σ = F / A",

        description:
            "Force per unit area."
    },


    {
        category:
            "Engineering",

        name:
            "Young's Modulus",

        formula:
            "E = Stress / Strain",

        description:
            "Measures material stiffness."
    }

];


function renderFormulas(
    list = FORMULAS
) {

    $("formulaList")
        .innerHTML =
        list.map(
            formula =>
                `
                <div class="formula-card">

                    <small>
                        ${formula.category}
                    </small>

                    <h3>
                        ${formula.name}
                    </h3>

                    <div class="formula-equation">
                        ${formula.formula}
                    </div>

                    <p>
                        ${formula.description}
                    </p>

                </div>
                `
        )
        .join("");

}


function searchFormulas() {

    const query =
        $("formulaSearch")
            .value
            .toLowerCase();


    const filtered =
        FORMULAS.filter(
            formula =>
                (
                    formula.name +
                    " " +
                    formula.category +
                    " " +
                    formula.formula +
                    " " +
                    formula.description
                )
                .toLowerCase()
                .includes(
                    query
                )
        );


    renderFormulas(
        filtered
    );

}


/* =========================================================
   MONEY
========================================================= */

function money(
    value
) {

    return new Intl.NumberFormat(
        "en-IN",
        {

            style:
                "currency",

            currency:
                "INR",

            maximumFractionDigits:
                2

        }
    )
    .format(
        value
    );

}


/* =========================================================
   SECURITY / DISPLAY HELPERS
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(
    message
) {

    const element =
        $("toast");


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                element.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key === "z"
        ) {

            event.preventDefault();

            undoAction();

            return;

        }


        if (
            event.ctrlKey &&
            event.key === "y"
        ) {

            event.preventDefault();

            redoAction();

            return;

        }


        if (
            event.ctrlKey &&
            event.key === "c"
        ) {

            return;

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeApplication() {

    loadTheme();

    loadHistory();

    loadWorkspace();

    loadConverterUnits();

    renderFormulas();


    const savedAngle =
        localStorage.getItem(
            "angleMode"
        );


    if (
        savedAngle
    ) {

        angleMode =
            savedAngle;

    }


    $("angleModeButton")
        .textContent =
        angleMode;


    $("precisionInput")
        .value =
        precision;


    const savedVariables =
        localStorage.getItem(
            "customVariables"
        );


    if (
        savedVariables
    ) {

        try {

            customVariables =
                JSON.parse(
                    savedVariables
                );

        }

        catch {

            customVariables = {};

        }

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);