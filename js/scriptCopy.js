document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let data = document.querySelector('.data'),
        result = document.querySelector('.result'),
        buttonStart = document.getElementById('start'),
        btnPlus = data.getElementsByTagName('button'),
        incomePlus = btnPlus[0],
        expensesPlus = btnPlus[1],
        checkBox = data.querySelector('#deposit-check'),
        additional = data.querySelectorAll('.additional_expenses-item'),
        valueBudgetDay = result.getElementsByClassName('result-total')[1],
        valueExpensesMonth = result.getElementsByClassName('result-total')[2],
        valueAdditionalIncome = result.getElementsByClassName('result-total')[3],
        valueAdditionalExpenses = result.getElementsByClassName('additional_expenses-value')[0],
        valueIncomePeriod = result.getElementsByClassName('income_period-value')[0],
        valueTargetMonth = result.getElementsByClassName('target_month-value')[0],
        valueBudgetMonth = result.querySelector('.budget_month-value'),
        inputMonthSum = data.querySelector('.salary-amount'),
        incomeItems = data.querySelectorAll('.income-items'),
        possibleIncome = data.querySelectorAll('.additional_income-item'),
        additionalIncomeValue = result.querySelector('.additional_income-value'),
        expensesItems = data.querySelectorAll('.expenses-items'),
        possibleCost = data.querySelector('.additional_expenses-item'),
        target = data.querySelector('.target-amount'),
        periodAmount = data.querySelector('.period-amount'),
        range = data.querySelector('.period-select'),
        countIncome = 0;

    let isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    let appData = {

        targetMonth: 0,
        dayInMonth: 30,
        expensesMonth: 0,
        budgetMonth: 0,
        budgetDay: 0,
        budget: 0,
        income: {}, //* доп. доходы.
        incomeMonth: 0,
        addIncome: [], //? тут мы будем перечислять дополнительные доходы
        expenses: {}, //!содержит доп. расходы
        addExpenses: [], //** массив с возможными расходами
        deposit: false,
        percentDeposit: 0,
        moneyDeposit: 0,
        
        showBudget: function () { // TODO Ключ 
            if (isNumber(inputMonthSum.value) && inputMonthSum.value !== "") {
                appData.budget = +inputMonthSum.value;
                appData.start();
            } else {
                alert('not a number');
            }
        },
        start: function () {
            appData.getExpenses(); //? Отправляет со  страницы данные обязательного расхода пользователя в Data
            appData.getIncome(); //! отправляет со страницы дополнительный доход пользователя в Data
            appData.getExpensesMonth(); //? суммирует обязательные расходы
            appData.getBudget(); //!вычисляем бюджет на месяц
            appData.getBudgetDay(); //? Получаем дневной бюджет
            appData.getTargetMonth(); //* Высчитываем за сколько накопим
            appData.getAddExpenses(); //! Возможные расходы
            appData.getAddIncome(); //? Дополнительный доход
            appData.showResult(); //* Показываем результат
        },
        showResult: function () {
            valueBudgetMonth.value = appData.budgetMonth;
            valueBudgetDay.value = Math.ceil(appData.budgetDay);
            valueExpensesMonth.value = appData.expensesMonth;
            valueAdditionalExpenses.value = appData.addExpenses.join(', ');
            additionalIncomeValue.value = appData.addIncome.join(', ');
            valueTargetMonth.value = Math.ceil(appData.targetMonth);
            valueIncomePeriod.value = appData.calcSavedMoney();
            range.addEventListener('change', appData.valueIncomePeriod);
        },
        addExpensesBlock: function () { //? Обязательные расходы button +
            let cloneExpensesItem = expensesItems[0].cloneNode(true);
            cloneExpensesItem.children[0].value = '';
            cloneExpensesItem.children[1].value = '';
            expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
            expensesItems = data.querySelectorAll('.expenses-items');
            if (expensesItems.length === 3) {
                expensesPlus.style.display = 'none';
            }
        },
        addIncomeBlock: function () { //? Дополнительные доходы button +
            let cloneIncomeItem = incomeItems[0].cloneNode(true);
            cloneIncomeItem.children[0].value = '';
            cloneIncomeItem.children[1].value = '';
            incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
            incomeItems = data.querySelectorAll('.income-items');
            if (incomeItems.length === 3) {
                incomePlus.style.display = 'none';
            }
        },
        getExpenses: function () { //? Отправляет со  страницы данные обязательного расхода пользователя в Data
            expensesItems = data.querySelectorAll('.expenses-items');
            expensesItems.forEach(function (item) {
                let itemExpenses = item.querySelector('.expenses-title').value;
                let cashExpenses = item.querySelector('.expenses-amount').value;
                if (itemExpenses !== '' && cashExpenses !== '') {
                    appData.expenses[itemExpenses] = cashExpenses;
                }
            });
        },
        getIncome: function () { //! отправляет со страницы дополнительный доход пользователя в Data
            incomeItems = data.querySelectorAll('.income-items');
            incomeItems.forEach(function (item) {
                let incomeName = item.querySelector('.income-title').value;
                let incomeSum = item.querySelector('.income-amount').value;
                if (incomeName !== '' && incomeSum !== '') {
                    appData.income[incomeName] = incomeSum;
                }
                if (countIncome === 0) {
                    for (let key in appData.income) {
                        appData.incomeMonth += parseFloat(appData.income[key]);
                        countIncome++;
                    }
                }
            });
        },
        getAddExpenses: function () {
            let addExpenses = possibleCost.value.split(', '); //! Возможные расходы
            appData.addExpenses = [];
            addExpenses.forEach(function (item) {
                item = item.trim();
                if (item !== '') {
                    appData.addExpenses.push(item);
                }
            });
        },
        getAddIncome: function () {
            appData.addIncome = [];
            possibleIncome.forEach(function (item) { //? Дополнительный доход
                let itemValue = item.value.trim();
                if (itemValue !== '') {
                    appData.addIncome.push(itemValue);
                }
            });
        },
        getExpensesMonth: function () { //? суммирует обязательные расходы
            let sumMonth = 0;
            for (let key in appData.expenses) {
                sumMonth += parseFloat(appData.expenses[key]);
            }
            appData.expensesMonth = sumMonth;
        },
        getBudget: function () { //!вычисляем бюджет на месяц
            appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
            return appData.budgetMonth;
        },
        getTargetMonth: function () { //! за сколько накопим
            appData.targetMonth = target.value / appData.budgetMonth;
            return appData.targetMonth;
        },
        getBudgetDay: function () { //! Дневной бюджет
            appData.budgetDay = appData.budgetMonth / appData.dayInMonth;
            return appData.budgetDay;
        },
        calcSavedMoney: function () {
            return appData.budgetMonth * range.value;
        },
        getValueRange: function () {
            if (range.value) {
                periodAmount.innerHTML = range.value;
            }
        }
    };
    
    buttonStart.addEventListener('click', appData.showBudget);
    expensesPlus.addEventListener('click', appData.addExpensesBlock);
    incomePlus.addEventListener('click', appData.addIncomeBlock);
    range.addEventListener('change', appData.getValueRange);
});