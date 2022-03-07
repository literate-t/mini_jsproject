;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  class Caculator {
    constructor(display) {
      this.display = display;
      this.currentValue = '';
      this.prevValue = '';
      this.operation = null;
    }

    appendNumber(number) {
      if (number === '.' && this.currentValue.includes(".")) {
        return;
      }
      this.currentValue = this.currentValue + number.toString();
    }

    setOperation(operation) {
      this.resetOperation();
      this.operation = operation;
      this.prevValue = this.currentValue;
      this.currentValue = '';

      const operators = Array.from(getAll('.operation'));
      const operator = operators.filter(o=>
        o.innerText.includes(operation))[0]; // first child
      
      operator.classList.add('active');
    }

    updateDisplay() {
      if (this.currentValue) {
        this.display.value = this.currentValue;
      }
    }

    resetOperation() {
      this.operation = null;
      const operators = Array.from(getAll('.operation'));
      operators.forEach(operator=>{
        operator.classList.remove('active');
      });
    }
  }

  const numberButtons = getAll('.cell_button.number');
  const operationButtons = getAll('.cell_button.operation');
  const display = get('.display');

  const calculator = new Caculator(display);

  numberButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    })
  });

  operationButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
      calculator.setOperation(button.innerText);
      calculator.updateDisplay();
    });
  });
})()
