//LOGIC FOR BACKGROUND CALCULATIONS

var budgetController = (function() {
    
    //add budget module here
    
})();


// UI HANDLING

var UIController = (function(){
    
    //add UI module here
    
})();

//GLOBAL CONTROLLER

var controller = (function(budgetCtrl, UICtrl){
    
    
    //controls adding item
    var addItem= function(){
        
        console.log('ding');
         // get data from  input field
        
        
        // update budget controller w/ item
        
        
        // update UI w/ item
        
        
        // calculate new budget
        
        
        // update UI with new budget
    }
    
    //calls addItem() on button press
    
    document.querySelector('.add__btn').addEventListener('click', addItem);
    
    
    
    document.addEventListener('keypress', function(event){
        
        if(event.keycode === 13 || event.which === 13){
            addItem();
        }
        
    });
    
})(budgetController, UIController);