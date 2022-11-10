function add (num1, num2) {
    return num1 + num2
}

function subtract (num1, num2) {
    return num1 - num2
}

function multiply (num1, num2) {
    return num1*num2
}

function divide (num1, num2) {
    return num1/num2
}

function operate (operator, num1, num2) {
    return operator(num1, num2)
}

function separate (display) {
    let displayArray = display.trim().split(/\s+/);
    return displayArray
}

function translate (displayArray) {
    let translatedDisplayArray = displayArray.map(item => {
        if (item === '+') {
            return add;
        }
        else if (item === '-') {
            return subtract;
        }
        else if (item === '*') {
            return multiply;
        }
        else if (item === '/') {
            return divide;
        }
        else if (item === '(') {
            return '('
        }
        else if (item === ')') {
            return ')'
        }
        else {
            return Number(item);
        }
    });
    return translatedDisplayArray
}

function computeParenthesis (x) {
    let lvl = 0;
    return x.reduce((a, e) => {
        if  (e === '(') {
            lvl += 1;
            if (lvl === 1) {
                a.push([]);
            }
            else {
                a[a.length - 1].push(e);
            }
        }
        else if (e === ')') {
            lvl -= 1;
            if (lvl === 0) {
                a[a.length - 1] = compute(order(a[a.length - 1]));
            }
            else {
                a[a.length - 1].push(e);
            }
        }
        else if (lvl >= 1) {
            a[a.length - 1].push(e);
        }
        else {
            a.push(e);
        }
        return a
    }, [])
}

function order (x) {
    x = computeParenthesis(x);
    if (x.length === 1) {
        return x
    }
    else if (typeof(x) === 'number') {
        return [x]
    }
    else {
        for (let operator of [add, subtract, multiply, divide]) {
            let index = x.lastIndexOf(operator);
            if (index !== -1) {
                x = [order(x.slice(0, index)), operator, order(x.slice(index + 1))]
            }
        }
        return x
    }
}

function compute (orderedTranslatedDisplayArray) {
    if (orderedTranslatedDisplayArray.length === 1) {
        let num = orderedTranslatedDisplayArray[0];
        return num
    }
    else {
        let operator = orderedTranslatedDisplayArray[1];
        let num1 = compute(orderedTranslatedDisplayArray[0]);
        let num2 = compute(orderedTranslatedDisplayArray[2]);
        return operate(operator, num1, num2)
    }
}

function calculate (display) {
    let result = compute(order(translate(separate(display))));
    let roundedResult = parseFloat(result.toFixed(2));
    return roundedResult.toString()
}

let screen = document.querySelector('.screen');
let display = '';

let numbers = document.querySelectorAll('.numbers > button');
numbers.forEach(button => {
    button.addEventListener('click', element => {
        if (display.length < 30) {
            display += element.target.textContent;
            screen.textContent = display;
        }
    });
});

let operators = document.querySelectorAll('.operators > button');
operators.forEach(button => {
    button.addEventListener('click', element => {
        display += ` ${element.target.textContent} `
        screen.textContent = display;
    });
});

let equals = document.querySelector('.equals');
equals.addEventListener('click', () => {
    display = calculate(display);
    screen.textContent = display;
});

let clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
    display = '';
    screen.textContent = display;
});

let del = document.querySelector('.del');
del.addEventListener('click', () => {
    display = display.slice(0, -1);
    screen.textContent = display;
});