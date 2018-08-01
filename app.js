//LOGIC FOR BACKGROUND CALCULATIONS

var budgetController = (function() {
    
    var Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
        
    };
    
    var Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        } ,    
    
        totals : {
            exp : 0,
            inc : 0
        },
        
        budget : 0,
        
        percentage: -1
    };
    
    var calcTotal = function(type){
        var sum = 0;
        
        data.allItems[type].forEach(function(val){
            sum = sum + val;
        });
        
        data.totals[type] = sum;
        
    };
    
    return {
        addItem : function(type, desc, val){
            
            var newItem, ID;
            
            
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;
            }
            
            if (type === 'exp'){ 
                newItem = new Expense(data.allItems.exp[data.allItems.exp.length] + 1, desc, val);
            } else if (type === 'inc'){
                newItem = new Income(data.allItems.inc[data.allItems.inc.length] + 1, desc, val);
            }
            
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        },
        
        calcBudget : function(){
            calcTotal('inc');
            calcTotal('exp');
                      
            data.budget = data.totals.inc - data.totals.exp;
                      
            data.percentage = (data.totals.exp / data.totals.inc) * 100;
        },
        
        getBudget : function(){
            return {
                budget: data.budget,
                incTotal : data.totals.inc,
                expTotal : data.totals.exp,
                per : data.percentage
            };
        }
    }
    
    
    
})();


// UI HANDLING

var UIController = (function(){
    
    
    
    var DOMstrings = {
        inputType : '.add__type',
        desc : '.add__description',
        value : '.add__value',
        addInput : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
    }
    
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,                    //whether income or expense
                description : document.querySelector(DOMstrings.desc).value,                 // identifier
                value : parseFloat(document.querySelector(DOMstrings.value).value)                       // amount
            }
        },
        
        getDOMstrings : function(){
            return DOMstrings;
        },
        
        addListItem : function (obj, type){
            var html, element;
            
            //create HTML string w/ placeholder
            
            if(type === 'inc'){
                
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                
                element = DOMstrings.expenseContainer;
            
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            }
            
            // replace placeholder
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //insert HTML into DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        
            
        },
        
        clearFields : function(){
            var fields, fieldArray;
        
            fields =  document.querySelectorAll(DOMstrings.desc + ' ,' + DOMstrings.value);
            
            fieldArray = Array.prototype.slice.call(fields);
            
            fieldArray.forEach(function(current){
                current.value = '';
                
            });
            
            fieldArray[0].focus();
        }
    }
    
})();

//GLOBAL CONTROLLER

var controller = (function(budgetCtrl, UICtrl){
    
  
    
    
    var setupListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.addInput).addEventListener('click', addItem);
        
        document.addEventListener('keypress', function(event){

         if(event.keycode === 13 || event.which === 13){
                addItem();
            }
        
        });

    }
    
    
    //controls adding item
    var addItem= function(){
        
        var input, newItem;
        
        
         // 1) get data from  input field
        
        
        input = UICtrl.getInput();
        
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
        
        
        
        // 2) update budget controller w/ item
        
        
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);


            // 3) update UI w/ item

            UICtrl.addListItem(newItem, input.type);

            //4 clear fields

            UICtrl.clearFields();

            //5 update budget

            updateBudget();
            

        }
        
        
    }
    
    var updateBudget = function(){
         // calculate the budget
        
        budgetCtrl.calcBudget();
        
        // return the budget
        
        budget = budgetCtrl.getBudget();
        
        //display the budget
        
        console.log(budget);
    }
    
    
    
    return {
        init: function(){
            setupListeners();
        }
    } 
     
    
})(budgetController, UIController);

controller.init(); 