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
        else if (['(', ')'].includes(item)) {
            return item
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

let numbers = document.querySelectorAll('.numbers');
numbers.forEach(button => {
    button.addEventListener('click', element => {
        display += element.target.textContent;
        screen.textContent = display;
    });
});

let operators = document.querySelectorAll('.operators');
operators.forEach(button => {
    button.addEventListener('click', element => {
        display += ` ${element.target.textContent} `
        screen.textContent = display;
    });
});

let equals = document.querySelector('#equals');
equals.addEventListener('click', () => {
    display = calculate(display);
    screen.textContent = display;
});

let clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    display = '';
    screen.textContent = display;
});

let del = document.querySelector('#del');
del.addEventListener('click', () => {
    display = display.trim().slice(0, -1);
    screen.textContent = display;
});

let sign = document.querySelector('#sign');
sign.addEventListener('click', () => {
    if (display.at(-1) === '-') {
        display = display.slice(0, -1);
    }
    else {
        display += '-';
    }
    screen.textContent = display;
});

function findButtonUsingInnerText (text) {
    let buttons = document.querySelectorAll('button');
    for (let i of buttons) {
        if (i.textContent === text) {
            return i
        }
    }
}

document.addEventListener('keydown', event => {
    console.log(event)
    event.preventDefault()
    let keyName = event.key;
    let hasCtrlKey = event.ctrlKey;
    let relatedButton;
    if (['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(keyName)) {
        display += keyName;
        relatedButton = findButtonUsingInnerText(keyName);
    }
    else if (['+', '*', '/', '(', ')'].includes(keyName)) {
        display += ` ${keyName} `;
        relatedButton = findButtonUsingInnerText(keyName);
    }
    else if (keyName === '-') {
        if (hasCtrlKey) {
            if (display.at(-1) === '-') {
                display = display.slice(0, -1);
                relatedButton = findButtonUsingInnerText('-/+');
            }
            else {
                display += '-';
                relatedButton = findButtonUsingInnerText('-/+');
            }
        }
        else {
            display += ` ${keyName} `;
            relatedButton = findButtonUsingInnerText(keyName);
        }
    }
    else if (['=', 'Enter'].includes(keyName)) {
        display = calculate(display);
        relatedButton = findButtonUsingInnerText('=');
    }
    else if (keyName === 'Backspace') {
        if (hasCtrlKey) {
            display = '';
            relatedButton = findButtonUsingInnerText('C');
        }
        else {
            display = display.trim().slice(0, -1);
            relatedButton = findButtonUsingInnerText('AC');
        }
    }
    screen.textContent = display;
    if (relatedButton) {
        relatedButton.classList.toggle('active');
    }
});

document.addEventListener('keyup', event => {
    event.preventDefault()
    let keyName = event.key;
    let hasCtrlKey = event.ctrlKey;
    let relatedButton;
    if (['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9','+', '*', '/', '(', ')'].includes(keyName)) {
        relatedButton = findButtonUsingInnerText(keyName);
    }
    else if (keyName === '-') {
        if (hasCtrlKey) {
            relatedButton = findButtonUsingInnerText('-/+');
        }
        else {
            relatedButton = findButtonUsingInnerText('-');
        }
    }
    else if (['=', 'Enter'].includes(keyName)) {
        relatedButton = findButtonUsingInnerText('=');
    }
    else if (keyName === 'Backspace') {
        if (hasCtrlKey) {
            relatedButton = findButtonUsingInnerText('C');
        }
        else {
            relatedButton = findButtonUsingInnerText('AC');
        }
    }
    if (relatedButton) {
        relatedButton.classList.remove('active');
    }
});