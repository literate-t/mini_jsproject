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
        return;
      }

      if(this.prevValue) {
        this.display.value = this.prevValue;
        return;
      }

      this.display.value = '0';
    }

    resetOperation() {
      this.operation = null;
      const operators = Array.from(getAll('.operation'));
      operators.forEach(operator=>{
        operator.classList.remove('active');
      });
    }

    compute() {
      let result;
      const prev = parseFloat(this.prevValue);
      const curr = parseFloat(this.currentValue);
      if (Number.isNaN(prev)|| Number.isNaN(curr)) {
        return;
      }

      switch(this.operation)
      {
        case "+":
          result = prev + curr;
          break;
        case "-":
          result = prev - curr;
          break;
        case "*":
          result = prev * curr;
          break;
        case "÷":
          result = prev / curr;
          break;
        default:
          return;
      }
      this.currentValue = result.toString();
      this.prevValue = '';
      this.resetOperation();
    }

    clear() {
      // 현재 값이 입력됐을 때의 처리
      if (this.currentValue) {
        this.currentValue = '';
        return;
      }

      // 연산자가 클릭됐을 때의 처리
      if (this.operation) {
        this.resetOperation();
        this.currentValue = this.prevValue;
        return;
      }

      if(this.prevValue) {
        this.prevValue = '';
      }
    }

    reset() {
      this.currentValue = '';
      this.prevValue = '';
      this.resetOperation();
    }
  }

  const numberButtons = getAll('.cell_button.number');
  const operationButtons = getAll('.cell_button.operation');
  const computeButton = get('.cell_button.compute');
  const clearButton = get('.cell_button.clear');
  const allClearButton = get('.cell_button.all_clear');
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

  computeButton.addEventListener('click', ()=>{
    calculator.compute();
    calculator.updateDisplay();
  });

  clearButton.addEventListener('click', ()=>{
    calculator.clear();
    calculator.updateDisplay();
  })

  allClearButton.addEventListener('click', ()=>{
    calculator.reset();
    calculator.updateDisplay();
  });
})()
