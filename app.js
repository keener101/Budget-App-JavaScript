//LOGIC FOR BACKGROUND CALCULATIONS

var budgetController = (function() {
    
    //add budget module here
    
})();


// UI HANDLING

var UIController = (function(){
    
    
    
    var DOMstrings = {
        inputType : '.add__type',
        desc : '.add__description',
        value : '.add__value',
        addInput : '.add__btn'
    }
    
    return {
        getinput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,                    //whether income or expense
                description : document.querySelector(DOMstrings.desc).value,                 // identifier
                value : document.querySelector(DOMstrings.value).value                        // amount
            }
        },
        
        getDOMstrings : function(){
            return DOMstrings;
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
        
        
         // get data from  input field
        
        var input = UICtrl.getinput();
        console.log(input);
        
        
        // update budget controller w/ item
        
        
        // update UI w/ item
        
        
        // calculate new budget
        
        
        // update UI with new budget
    }
    
    return {
        init: function(){
            setupListeners();
        }
    } 
     
    
})(budgetController, UIController);

controller.init(); 