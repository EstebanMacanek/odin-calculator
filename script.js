function add (x, y) {
    return x + y
}

function subtract (x, y) {
    return x - y
}

function multiply (x, y) {
    return x*y
}

function divide (x, y) {
    return x/y
}

function operate (operator, x, y) {
    return operator(x, y)
}

let screen = document.querySelector('.screen');
let numbers = document.querySelectorAll('.numbers > button, .operators > button');
let display = '';
numbers.forEach(button => {
    button.addEventListener('click', element => {
        display += element.target.textContent;
        screen.value = display;
    });
});