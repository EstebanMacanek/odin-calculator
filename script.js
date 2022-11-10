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
    // '1 + 1' -> ['1', '+', '1']
    let displayArray = display.split(' ');
    return displayArray
}

function translate (displayArray) {
    // ['1', '+', '1'] -> [1, add, 1]
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
        else {
            return Number(item);
        }
    });
    return translatedDisplayArray
}

function indexOfAll (array, item) {
    return array.reduce((a, e, i) => {
        if (e === item) {
            a.push(i)
        } 
        return a
    }, []);
}

function order (x) {
    // [1] -> [1]
    // [1, add, 1] -> [[1], add, [1]]
    // [1, add, 1, multiply, 2] -> [[1], add, [[1], multiply, [2]]]
    if (x.length === 1) {
        return x
    }
    else if (typeof(x) === 'number') {
        return [x]
    }
    else {
        for (let j of [add, subtract, multiply, divide]) {
            let listIndex = indexOfAll(x, j);
            for (let i of listIndex) {
                x = [order(x.slice(0, i)), j, order(x.slice(i+1))]
            }
        }
        return x
    }
}

function compute (orderedTranslatedDisplayArray) {
    // [1] -> 1
    // [[1], add, [1]] -> 2
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
    return compute(order(translate(separate(display))))
}

// function separate (str) {
//     let list = Array.from(str);
//     let r = list.reduce((accumulator, currentValue) => {
//         if (['.','0','1','2','3','4','5','6','7','8','9'].includes(currentValue)) {
//             if (accumulator[accumulator.length-1] === '-' && accumulator[accumulator.length-2] === undefined) {
//                 accumulator[accumulator.length - 1] += currentValue;
//             }
//             else if (accumulator.length === 0 || ['+', '-', '*', '/'].includes(accumulator[accumulator.length - 1])) {
//                 accumulator.push(currentValue);
//             }
//             else {
//                 accumulator[accumulator.length - 1] += currentValue;
//             }
//         }
//         else if (['+', '-', '*', '/'].includes(currentValue)) {
//             accumulator.push(currentValue);
//         }
//         return accumulator
//     }, []);
//     return r
// }
//
// function compute (str) {
//         let list = separate(str);
//         for (let [index, item] of list.entries()) {
//                 if (item === '*') {
//                         list[index] = multiply(+list[index-1], +list[index+1]);
//                         delete list[index-1];
//             list.splice(index+1, 1)
//         }
//     }
//     list = list.filter(a => a !== undefined);
//     for (let [index, item] of list.entries()) {
//             if (item === '/') {
//                     list[index] = divide(+list[index-1], +list[index+1]);
//                     delete list[index-1];
//                     list.splice(index+1, 1)
//                 }
//             }
//             list = list.filter(a => a !== undefined);
//             for (let [index, item] of list.entries()) {
//                     if (item === '+') {
//                             list[index] = add(+list[index-1], +list[index+1])
//                             delete list[index-1];
//                             list.splice(index+1, 1)
//                         }
//                     }
//                     list = list.filter(a => a !== undefined);
//                     for (let [index, item] of list.entries()) {
//                             if (item === '-'){
//                                     list[index] = subtract(+list[index-1], +list[index+1])
//                                     delete list[index-1];
//                                     list.splice(index+1, 1)
//                                 }
//     }
//     list = list.filter(a => a !== undefined);
//     return String(parseFloat((+list[list.length-1]).toFixed(3)))
// }

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