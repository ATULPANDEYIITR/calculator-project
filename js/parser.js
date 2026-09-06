/* =========================================================
   UNIVERSAL CALCULATOR
   MATHEMATICAL ENGINE
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

let angleMode = "DEG";

let significantFigures = 10;


/* =========================================================
   CONSTANTS
========================================================= */

const UNIVERSAL_CONSTANTS = {

    phi:
        (1 + Math.sqrt(5)) / 2,

    tau:
        2 * Math.PI,

    pi:
        Math.PI,

    e:
        Math.E,

    sqrt2:
        Math.SQRT2,

    sqrt3:
        Math.sqrt(3),

    ln2:
        Math.LN2,

    ln10:
        Math.LN10,

    c:
        299792458,

    g:
        9.80665,

    G:
        6.67430e-11,

    h:
        6.62607015e-34,

    kB:
        1.380649e-23,

    NA:
        6.02214076e23,

    R:
        8.31446261815324

};


/* =========================================================
   ANGLES
========================================================= */

function degreesToRadians(value) {

    return value * Math.PI / 180;

}


function radiansToDegrees(value) {

    return value * 180 / Math.PI;

}


function gradiansToRadians(value) {

    return value * Math.PI / 200;

}


function angleToRadians(value) {

    if (angleMode === "DEG") {

        return degreesToRadians(value);

    }


    if (angleMode === "GRAD") {

        return gradiansToRadians(value);

    }


    return value;

}


function radiansToCurrentAngle(value) {

    if (angleMode === "DEG") {

        return radiansToDegrees(value);

    }


    if (angleMode === "GRAD") {

        return value * 200 / Math.PI;

    }


    return value;

}


/* =========================================================
   TRIGONOMETRY
========================================================= */

function calcSin(value) {

    return Math.sin(
        angleToRadians(value)
    );

}


function calcCos(value) {

    return Math.cos(
        angleToRadians(value)
    );

}


function calcTan(value) {

    return Math.tan(
        angleToRadians(value)
    );

}


function calcAsin(value) {

    return radiansToCurrentAngle(
        Math.asin(value)
    );

}


function calcAcos(value) {

    return radiansToCurrentAngle(
        Math.acos(value)
    );

}


function calcAtan(value) {

    return radiansToCurrentAngle(
        Math.atan(value)
    );

}


/* =========================================================
   HYPERBOLIC
========================================================= */

function calcSinh(value) {

    return Math.sinh(value);

}


function calcCosh(value) {

    return Math.cosh(value);

}


function calcTanh(value) {

    return Math.tanh(value);

}


function calcAsinh(value) {

    return Math.asinh(value);

}


function calcAcosh(value) {

    return Math.acosh(value);

}


function calcAtanh(value) {

    return Math.atanh(value);

}


/* =========================================================
   FACTORIAL
========================================================= */

function factorial(n) {

    n = Number(n);


    if (
        !Number.isInteger(n) ||
        n < 0
    ) {

        throw new Error(
            "Factorial requires a non-negative whole number."
        );

    }


    if (n > 170) {

        throw new Error(
            "Number is too large for factorial."
        );

    }


    let result = 1;


    for (
        let i = 2;
        i <= n;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================================================
   DOUBLE FACTORIAL
========================================================= */

function doubleFactorial(n) {

    n = Number(n);


    if (
        !Number.isInteger(n) ||
        n < 0
    ) {

        throw new Error(
            "Invalid double factorial."
        );

    }


    let result = 1;


    for (
        let i = n;
        i >= 2;
        i -= 2
    ) {

        result *= i;

    }


    return result;

}


/* =========================================================
   COMBINATION
========================================================= */

function nCr(n, r) {

    n = Number(n);

    r = Number(r);


    if (
        !Number.isInteger(n) ||
        !Number.isInteger(r) ||
        r < 0 ||
        n < 0 ||
        r > n
    ) {

        throw new Error(
            "Invalid nCr values."
        );

    }


    r = Math.min(
        r,
        n - r
    );


    let result = 1;


    for (
        let i = 1;
        i <= r;
        i++
    ) {

        result =
            result *
            (n - r + i) /
            i;

    }


    return result;

}


/* =========================================================
   PERMUTATION
========================================================= */

function nPr(n, r) {

    return (
        factorial(n) /
        factorial(n - r)
    );

}


/* =========================================================
   GCD
========================================================= */

function gcd(a, b) {

    a = Math.abs(
        Math.trunc(a)
    );

    b = Math.abs(
        Math.trunc(b)
    );


    while (b !== 0) {

        const temporary = b;

        b = a % b;

        a = temporary;

    }


    return a;

}


/* =========================================================
   LCM
========================================================= */

function lcm(a, b) {

    if (
        a === 0 ||
        b === 0
    ) {

        return 0;

    }


    return Math.abs(
        a * b
    ) / gcd(a, b);

}


/* =========================================================
   PRIME
========================================================= */

function isPrime(number) {

    number =
        Math.trunc(
            Number(number)
        );


    if (number < 2) {

        return false;

    }


    if (number === 2) {

        return true;

    }


    if (number % 2 === 0) {

        return false;

    }


    for (
        let i = 3;
        i * i <= number;
        i += 2
    ) {

        if (
            number % i === 0
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================================
   PRIME FACTORIZATION
========================================================= */

function primeFactors(number) {

    number =
        Math.abs(
            Math.trunc(
                Number(number)
            )
        );


    const factors = [];


    while (
        number % 2 === 0 &&
        number > 1
    ) {

        factors.push(2);

        number /= 2;

    }


    for (
        let i = 3;
        i * i <= number;
        i += 2
    ) {

        while (
            number % i === 0
        ) {

            factors.push(i);

            number /= i;

        }

    }


    if (number > 1) {

        factors.push(number);

    }


    return factors;

}


/* =========================================================
   EULER TOTIENT
========================================================= */

function eulerTotient(n) {

    n =
        Math.abs(
            Math.trunc(
                Number(n)
            )
        );


    let result = n;

    const factors =
        [
            ...new Set(
                primeFactors(n)
            )
        ];


    factors.forEach(
        function(p) {

            result *=
                1 - 1 / p;

        }
    );


    return Math.trunc(result);

}


/* =========================================================
   DIVISORS
========================================================= */

function divisors(n) {

    n =
        Math.abs(
            Math.trunc(
                Number(n)
            )
        );


    const output = [];


    for (
        let i = 1;
        i * i <= n;
        i++
    ) {

        if (
            n % i === 0
        ) {

            output.push(i);


            if (
                i !== n / i
            ) {

                output.push(
                    n / i
                );

            }

        }

    }


    return output.sort(
        (a, b) => a - b
    );

}


/* =========================================================
   MODULAR POWER
========================================================= */

function modularPower(
    base,
    exponent,
    modulus
) {

    base =
        ((base % modulus) + modulus) %
        modulus;


    let result = 1;


    while (
        exponent > 0
    ) {

        if (
            exponent % 2 === 1
        ) {

            result =
                (result * base) %
                modulus;

        }


        base =
            (base * base) %
            modulus;


        exponent =
            Math.floor(
                exponent / 2
            );

    }


    return result;

}


/* =========================================================
   FORMAT
========================================================= */

function formatUniversalNumber(
    value,
    precision = significantFigures
) {

    if (
        typeof value === "number"
    ) {

        if (
            !Number.isFinite(value)
        ) {

            return "Error";

        }


        if (
            value === 0
        ) {

            return "0";

        }


        return Number(
            value.toPrecision(
                precision
            )
        ).toString();

    }


    return String(value);

}


/* =========================================================
   EXPRESSION
========================================================= */

function normalizeExpression(
    expression
) {

    expression =
        String(expression)
            .replace(/π/g, "pi")
            .replace(/φ/g, "phi")
            .replace(/τ/g, "tau")
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");


    return expression;

}


/* =========================================================
   SAFE FUNCTION SET
========================================================= */

function createMathScope() {

    return {

        pi:
            Math.PI,

        e:
            Math.E,

        phi:
            UNIVERSAL_CONSTANTS.phi,

        tau:
            UNIVERSAL_CONSTANTS.tau,

        sin:
            calcSin,

        cos:
            calcCos,

        tan:
            calcTan,

        asin:
            calcAsin,

        acos:
            calcAcos,

        atan:
            calcAtan,

        sinh:
            calcSinh,

        cosh:
            calcCosh,

        tanh:
            calcTanh,

        asinh:
            calcAsinh,

        acosh:
            calcAcosh,

        atanh:
            calcAtanh,

        factorial,

        fact:
            factorial,

        doubleFactorial,

        nCr,

        nPr,

        gcd,

        lcm,

        abs:
            Math.abs,

        floor:
            Math.floor,

        ceil:
            Math.ceil,

        round:
            Math.round,

        sqrt:
            Math.sqrt,

        cbrt:
            Math.cbrt,

        exp:
            Math.exp,

        log:
            Math.log10,

        ln:
            Math.log,

        log2:
            Math.log2,

        mod:
            function(a, b) {
                return a % b;
            },

        sign:
            Math.sign,

        deg:
            radiansToDegrees,

        rad:
            degreesToRadians,

        ...UNIVERSAL_CONSTANTS

    };

}


/* =========================================================
   EXPRESSION EVALUATION
========================================================= */

function evaluateUniversalExpression(
    expression,
    variables = {}
) {

    expression =
        normalizeExpression(
            expression
        );


    const scope = {

        ...createMathScope(),

        ...variables

    };


    try {

        return math.evaluate(
            expression,
            scope
        );

    } catch (error) {

        throw new Error(
            error.message
        );

    }

}


/* =========================================================
   EQUATION SOLVING
========================================================= */

function solveSimpleEquation(
    equation,
    variable = "x"
) {

    equation =
        equation.replace(
            /\s/g,
            ""
        );


    if (
        !equation.includes("=")
    ) {

        throw new Error(
            "Equation must contain =."
        );

    }


    const parts =
        equation.split("=");


    const left =
        parts[0];


    const right =
        parts.slice(1).join("=");


    const expression =
        `(${left})-(${right})`;


    const simplified =
        math.simplify(
            expression
        );


    try {

        const polynomial =
            math.polynomialRoot(
                expression,
                variable
            );

        return polynomial;

    } catch {

        const scope = {};

        const solutions = [];


        for (
            let x = -100;
            x <= 100;
            x += 0.01
        ) {

            try {

                const value =
                    evaluateUniversalExpression(
                        expression,
                        {
                            [variable]: x
                        }
                    );


                if (
                    Math.abs(value) <
                    0.0001
                ) {

                    solutions.push(
                        x
                    );

                }

            } catch {}

        }


        return [
            ...new Set(
                solutions.map(
                    value =>
                        Number(
                            value.toFixed(4)
                        )
                )
            )
        ];

    }

}


/* =========================================================
   MATRIX PARSER
========================================================= */

function parseMatrix(text) {

    return text
        .trim()
        .split(";")
        .map(
            row =>
                row
                    .split(",")
                    .map(
                        Number
                    )
        );

}


/* =========================================================
   STATISTICS
========================================================= */

function statisticsArray(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (
        numbers.length === 0
    ) {

        throw new Error(
            "No valid numbers."
        );

    }


    return numbers;

}


function mean(values) {

    values =
        statisticsArray(values);


    return (
        values.reduce(
            (a, b) => a + b,
            0
        ) /
        values.length
    );

}


function median(values) {

    values =
        statisticsArray(values)
            .sort(
                (a, b) => a - b
            );


    const middle =
        Math.floor(
            values.length / 2
        );


    if (
        values.length % 2 === 0
    ) {

        return (
            values[middle - 1] +
            values[middle]
        ) / 2;

    }


    return values[middle];

}


function mode(values) {

    values =
        statisticsArray(values);


    const counts = {};


    values.forEach(
        function(value) {

            counts[value] =
                (counts[value] || 0) + 1;

        }
    );


    const maximum =
        Math.max(
            ...Object.values(
                counts
            )
        );


    return Object.keys(
        counts
    )
        .filter(
            key =>
                counts[key] === maximum
        )
        .map(Number);

}


function variance(
    values,
    sample = false
) {

    values =
        statisticsArray(values);


    const average =
        mean(values);


    return (
        values.reduce(
            (sum, value) =>
                sum +
                Math.pow(
                    value - average,
                    2
                ),
            0
        )
        /
        (
            values.length -
            (sample ? 1 : 0)
        )
    );

}


function standardDeviation(
    values,
    sample = false
) {

    return Math.sqrt(
        variance(
            values,
            sample
        )
    );

}


function percentile(
    values,
    p
) {

    values =
        statisticsArray(values)
            .sort(
                (a, b) => a - b
            );


    const index =
        (p / 100) *
        (values.length - 1);


    const lower =
        Math.floor(index);


    const upper =
        Math.ceil(index);


    if (
        lower === upper
    ) {

        return values[lower];

    }


    return (
        values[lower] +
        (
            values[upper] -
            values[lower]
        ) *
        (index - lower)
    );

}


function covariance(
    x,
    y
) {

    x =
        statisticsArray(x);

    y =
        statisticsArray(y);


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


    return (
        x.reduce(
            (
                sum,
                value,
                index
            ) =>
                sum +
                (
                    value - xMean
                ) *
                (
                    y[index] - yMean
                ),
            0
        )
        /
        x.length
    );

}


function correlation(
    x,
    y
) {

    return (
        covariance(x, y) /
        (
            standardDeviation(x) *
            standardDeviation(y)
        )
    );

}


/* =========================================================
   NORMAL DISTRIBUTION
========================================================= */

function normalPDF(
    x,
    meanValue,
    sd
) {

    return (
        1 /
        (
            sd *
            Math.sqrt(
                2 * Math.PI
            )
        )
    )
    *
    Math.exp(
        -0.5 *
        Math.pow(
            (x - meanValue) / sd,
            2
        )
    );

}


/* =========================================================
   BINOMIAL
========================================================= */

function binomialProbability(
    n,
    k,
    p
) {

    return (
        nCr(n, k) *
        Math.pow(p, k) *
        Math.pow(
            1 - p,
            n - k
        )
    );

}


/* =========================================================
   POISSON
========================================================= */

function poissonProbability(
    lambda,
    k
) {

    return (
        Math.pow(
            lambda,
            k
        )
        *
        Math.exp(
            -lambda
        )
        /
        factorial(k)
    );

}


/* =========================================================
   FINANCE
========================================================= */

function calculateEMI(
    principal,
    annualRate,
    years
) {

    const months =
        years * 12;


    const monthlyRate =
        annualRate / 12 / 100;


    if (
        monthlyRate === 0
    ) {

        return (
            principal /
            months
        );

    }


    return (
        principal *
        monthlyRate *
        Math.pow(
            1 + monthlyRate,
            months
        )
        /
        (
            Math.pow(
                1 + monthlyRate,
                months
            ) - 1
        )
    );

}


function calculateSIP(
    monthlyInvestment,
    annualRate,
    years
) {

    const months =
        years * 12;


    const monthlyRate =
        annualRate / 12 / 100;


    if (
        monthlyRate === 0
    ) {

        return (
            monthlyInvestment *
            months
        );

    }


    return (
        monthlyInvestment *
        (
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            )
            /
            monthlyRate
        )
        *
        (
            1 + monthlyRate
        )
    );

}


function compoundAmount(
    principal,
    rate,
    years,
    frequency
) {

    return (
        principal *
        Math.pow(
            1 +
            rate / 100 / frequency,
            frequency * years
        )
    );

}


function CAGR(
    beginning,
    ending,
    years
) {

    return (
        Math.pow(
            ending / beginning,
            1 / years
        ) - 1
    ) * 100;

}


function NPV(
    rate,
    cashFlows
) {

    return cashFlows.reduce(
        (
            total,
            cashFlow,
            index
        ) =>
            total +
            cashFlow /
            Math.pow(
                1 + rate / 100,
                index
            ),
        0
    );

}


/* =========================================================
   BUSINESS
========================================================= */

function calculateEBITDA(
    revenue,
    cogs,
    opex
) {

    return (
        revenue -
        cogs -
        opex
    );

}


function calculateEBIT(
    ebitda,
    depreciation,
    amortization
) {

    return (
        ebitda -
        depreciation -
        amortization
    );

}


function calculateEBT(
    ebit,
    interest
) {

    return (
        ebit -
        interest
    );

}


function calculateNetIncome(
    ebt,
    taxRate
) {

    return (
        ebt *
        (
            1 -
            taxRate / 100
        )
    );

}


/* =========================================================
   MACHINE LEARNING
========================================================= */

function classificationMetrics(
    tp,
    tn,
    fp,
    fn
) {

    const total =
        tp + tn + fp + fn;


    const accuracy =
        (
            tp + tn
        ) /
        total;


    const precision =
        tp /
        (
            tp + fp
        );


    const recall =
        tp /
        (
            tp + fn
        );


    const specificity =
        tn /
        (
            tn + fp
        );


    const f1 =
        2 *
        precision *
        recall /
        (
            precision +
            recall
        );


    return {

        accuracy,

        precision,

        recall,

        specificity,

        f1

    };

}


/* =========================================================
   UNIT CONVERSION
========================================================= */

const UNIT_TABLES = {

    length: {

        meter: 1,

        kilometer: 1000,

        centimeter: 0.01,

        millimeter: 0.001,

        inch: 0.0254,

        foot: 0.3048,

        yard: 0.9144,

        mile: 1609.344,

        nautical_mile: 1852

    },


    area: {

        square_meter: 1,

        square_kilometer: 1000000,

        square_foot: 0.09290304,

        acre: 4046.8564224,

        hectare: 10000

    },


    volume: {

        liter: 1,

        milliliter: 0.001,

        cubic_meter: 1000,

        gallon: 3.785411784,

        quart: 0.946352946,

        pint: 0.473176473

    },


    mass: {

        kilogram: 1,

        gram: 0.001,

        milligram: 0.000001,

        tonne: 1000,

        pound: 0.45359237,

        ounce: 0.028349523125

    },


    time: {

        second: 1,

        minute: 60,

        hour: 3600,

        day: 86400,

        week: 604800,

        year: 31557600

    },


    speed: {

        meter_per_second: 1,

        kilometer_per_hour:
            1000 / 3600,

        mile_per_hour:
            1609.344 / 3600,

        knot:
            1852 / 3600

    },


    pressure: {

        pascal: 1,

        kilopascal: 1000,

        bar: 100000,

        atmosphere: 101325,

        psi: 6894.757293,

        mmHg: 133.322387415

    },


    energy: {

        joule: 1,

        kilojoule: 1000,

        calorie: 4.184,

        kilocalorie: 4184,

        watt_hour: 3600,

        kilowatt_hour: 3600000,

        BTU: 1055.05585262

    },


    power: {

        watt: 1,

        kilowatt: 1000,

        megawatt: 1000000,

        horsepower: 745.699872

    },


    force: {

        newton: 1,

        kilonewton: 1000,

        pound_force: 4.4482216152605

    },


    data: {

        bit: 1 / 8,

        byte: 1,

        KB: 1024,

        MB: 1024 ** 2,

        GB: 1024 ** 3,

        TB: 1024 ** 4

    },


    frequency: {

        Hz: 1,

        kHz: 1000,

        MHz: 1000000,

        GHz: 1000000000

    },


    angle: {

        degree: Math.PI / 180,

        radian: 1,

        gradian: Math.PI / 200

    }

};


/* =========================================================
   TEMPERATURE
========================================================= */

function convertTemperature(
    value,
    from,
    to
) {

    let celsius;


    if (
        from === "Celsius"
    ) {

        celsius = value;

    }

    else if (
        from === "Fahrenheit"
    ) {

        celsius =
            (
                value - 32
            )
            *
            5 / 9;

    }

    else {

        celsius =
            value - 273.15;

    }


    if (
        to === "Celsius"
    ) {

        return celsius;

    }


    if (
        to === "Fahrenheit"
    ) {

        return (
            celsius * 9 / 5
        ) + 32;

    }


    return celsius + 273.15;

}