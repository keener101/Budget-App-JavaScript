//LOGIC FOR BACKGROUND CALCULATIONS

var budgetController = (function() {
    
    var Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
        
    };
    
    Expense.prototype.calcPercLogic = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100); 
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
        
        data.allItems[type].forEach(function(cur){

            sum = sum + cur.value;

        });
        
        data.totals[type] = sum;
        
    };
    
    return {
        addItemLogic : function(type, desc, val){
            
            var newItem, ID;
            
            
            if(data.allItems[type].length > 0){
                
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                

            } else {
                ID = 0;
            }
            
            if (type === 'exp'){ 
                newItem = new Expense(ID, desc, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, desc, val);
            }
            
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type, id){
            
            var index, idArray;
            
            
            
            idArray = data.allItems[type].map(function(current){
            
                return current.id;
                                               
            });
            
            index = idArray.indexOf(id);
            
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
              
        },
        
        testing: function(){
            console.log(data);
    
        },
        
        calcBudget : function(){
            calcTotal('inc');
            calcTotal('exp');
                      
            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
                      
        },
        
        calcPercentLogic : function(){
            
            data.allItems.exp.forEach(function(current){
                current.calcPercLogic(data.totals.inc); 
            });
            
            
        },
        
        getPercentages: function(){
            var allPer = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            
            return allPer; 
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
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        containers: '.container',
        expensePercentLabel : '.item__percentage'
        
    }
    
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,                    //whether income or expense
                description : document.querySelector(DOMstrings.desc).value,                 // identifier
                value : parseFloat(document.querySelector(DOMstrings.value).value)                       // amount
            }
        },
        
        displayPercentages : function(percentageArray){
            var fields = document.querySelectorAll(DOMstrings.expensePercentLabel);
            
            var nodeListForEach = function(nodeList, callback){
                for (var i = 0; i < nodeList.length; i++){
                    callback(nodeList[i], i)
                }
            };
            
            nodeListForEach(fields, function(current, index){
               
                if (percentageArray[index] > 0){
                    current.textContent = percentageArray[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            });
            
        },
        
        getDOMstrings : function(){
            return DOMstrings;
        },
        
        addListItem : function (obj, type){
            var html, element, newHtml;
            
            //create HTML string w/ placeholder
            
            if(type === 'inc'){
                
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                
                element = DOMstrings.expenseContainer;
            
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            }
            
            // replace placeholder
            
           
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);
            
            
            //insert HTML into DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        
            
        },
        
        deleteListItem : function(itemID){
            
            var item = document.getElementById(itemID);
            
            item.parentElement.removeChild(item);
            
        },
        
        clearFields : function(){
            var fields, fieldArray;
        
            fields =  document.querySelectorAll(DOMstrings.desc + ' ,' + DOMstrings.value);
            
            fieldArray = Array.prototype.slice.call(fields);
            
            fieldArray.forEach(function(current){
                current.value = '';
                
            });
            
            fieldArray[0].focus();
        },
        
        displayBudget : function(obj){
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.incTotal
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.expTotal;

            
            if(obj.per > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.per + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
            
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
        
            
        
        document.querySelector(DOM.containers).addEventListener('click', ctrlDeleteItem);
            
        

    };
    
    
    //controls adding item
    var addItem= function(){
        
        var input, newItem;
        
        
         // 1) get data from  input field
        
        
        input = UICtrl.getInput();
        
        
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
        
        
        // 2) update budget controller w/ item
        
        
            newItem = budgetCtrl.addItemLogic(input.type, input.description, input.value);


            

            // 3) update UI w/ item

            UICtrl.addListItem(newItem, input.type);

            //4 clear fields

            UICtrl.clearFields();

            //5 update budget

            updateBudget();
            
            //update percentages
        
            updatePercentages();
            

        }
        
        
    };
    
    var updatePercentages = function(){
        
        //calculate percentages
        budgetCtrl.calcPercentLogic(0);
        
        
        
        //read percentages from budgetController
        
        var percentages = budgetCtrl.getPercentages();
        
        
        // Update the UI
        
        UICtrl.displayPercentages(percentages);
        
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, IDnum;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            IDnum = parseInt(splitID[1]);
        }
        
        //delete from data structure
        
        budgetCtrl.deleteItem(type, IDnum);
        
        //delete from UI
        
        UICtrl.deleteListItem(itemID);
        
        //update budget and budget UI 
        
        updateBudget();
        
        //update percentages
        
        updatePercentages();
        
    };
    
    var updateBudget = function(){
         // calculate the budget
        
        budgetCtrl.calcBudget();
        
        // return the budget
        
        budget = budgetCtrl.getBudget();
        
        //display the budget
        
        UICtrl.displayBudget(budget);
    };
    
    
    
    return {
        init: function(){
            setupListeners();
            
            UICtrl.displayBudget({
                budget: 0,
                incTotal : 0,
                expTotal : 0,
                per : -1
            });

        }
    };
     
    
})(budgetController, UIController);

controller.init(); 