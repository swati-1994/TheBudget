var budgetController=(function(){

var Expense=function (id,description,value) {

    this.id=id;
    this.description=description;
    this.value=value;
};

    var Income=function (id,description,value) {

        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var swati;
    var calculateTotal=function (type) {
        var sum=0;
        data.allItems[type].forEach(function (cur) {
            sum+=cur.value;
        })
        data.totals[type]=sum;
    }

    var allExpenses=[];
    var allIncomes=[];

    var totalExpenses=0;

    var data={
allItems:{
exp:[],
    inc:[]
},
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1

    }

    return{

        addItem:function (type,des,val) {
            var newItem,ID;

            if(data.allItems[type].length>0){

                ID=data.allItems[type][data.allItems[type].length-1].id+1;

            }

            else{
                ID:0;
            }


            // ID=data.allItems[type][data.allItems[type].length-1].id+1;

            if(type==='exp'){

                newItem=new Expense(ID,des,val);
            }

            else if (type==='inc'){

                newItem=new Income(ID,des,val);
            }
//push it into data structure
            data.allItems[type].push(newItem);
            //return new item
            return newItem;
            
        },

        deleteItem:function (type,id) {

            var ids,index;

            ids=data.allItems[type].map(function (current) {
                return current.id;
            })

            index=ids.indexOf(id);

            if(index!==-1){

                data.allItems[type].splice(index,1);
            }
        },


        calculateBudget:function(){

            calculateTotal('exp');
            calculateTotal('inc');

            if(data.totals.inc>0){

                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);

            }

            else{
                data.percentage=-1;
            }
            data.budget=data.totals.inc-data.totals.exp;


        },

        getBudget:function () {

            return{

                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };

        },

        testing:function () {
            console.log(data);

        }

    }



})();

var UIController=(function(){

var DOMstrings={

    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn:'.input__btn',
    incomeContainer:'.income__list',
    expensesContainer:'.expenses__list',
    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expenseLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage'
}


    return{
        getInput:function () {

            return{

                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },

        addListItem:function(obj,type){
var html,newHtml,element;

if(type==='inc'){

    element=DOMstrings.incomeContainer;

    html=' <div class="item clearfix" id="income-%d%"> <div class="item__description">%description%</div>' +
        '<div class="right clearfix"> <div class="item__value">+ %value%</div>'+
    '<div class="item__delete">'+
       ' <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
        '</div>'+
       ' </div>'+
        '</div>'
}

else if(type==='exp'){
    element=DOMstrings.expensesContainer;

    html=' <div class="item clearfix" id="expense-%d%">'+
        '<div class="item__description">%description%</div>'+
    '<div class="right clearfix">'+
        '<div class="item__value">%value%</div>'+
        '<div class="item__percentage">21%</div>'+
        '<div class="item__delete">'+
       ' <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
        '</div>'+
       ' </div>'+
        '</div>'
}

//replace the placeholder text with some actual data
            newHtml=html.replace('%d%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);

document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
        },

        deleteListItem:function(selectorID){
          var el=  document.getElementById(selectorID);
          el.parentNode.removeChild(el);


        },


        displayBudget:function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent=obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage;


        },

        getDOMstrings:function(){
            return DOMstrings;

        }

    }


})();


var ctrlAddItem=function(){



var input=UIController.getInput();
console.log(input)

    console.log("it works");
}




var controller=( function(bCtrl,UIctrl){


    var setupEventListeners=function(){

        var DOM=UIctrl.getDOMstrings();

        document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function (event) {

                if(event.keyCode===13){

                    ctrlAddItem();
                }

            }

        )

    }

    var updateBudget=function () {

        budgetController.calculateBudget();
        var budget=budgetController.getBudget();

       UIctrl.displayBudget(budget);
        
    }

    var ctrlAddItem=function () {

        var input,newItem;
        input=UIctrl.getInput();

        if(input.description !=="" && !isNaN(input.value)&&input.value>0) {

            newItem = budgetController.addItem(input.type, input.description, input.value);

            UIctrl.addListItem(newItem, input.type);

            updateBudget();

        }
        
    }

    var ctrlDeleteItem=function (event) {
        var itemID,splitID,type,ID;

        itemID:event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){

            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            budgetController.deleteItem(type,ID);

            UIctrl.deleteListItem(itemID);
            updateBudget();


        }

    }

return{

        init:function(){

            console.log("event has started");
            setupEventListeners()
        }
}




})(budgetController,UIController);
controller.init();




