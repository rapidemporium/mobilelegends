var items = [{quantity: "14 💎", price:"14"},
{quantity: "28 💎", price:"1"},
{quantity: "42 💎", price:"42"},
{quantity: "70 💎", price:"70"},
{quantity: "84 💎", price:"84"},
{quantity: "140 💎", price:"0"},
{quantity: "284 💎", price:"100"},
{quantity: "355 💎", price:"1080"},
{quantity: "429 💎", price:"450"},
{quantity: "716 💎", price:"440"},
{quantity: "1446 💎", price:"40"},
{quantity: "2976 💎", price:"450"},
{quantity: "1446 💎", price:"890"},
{quantity: "7502 💎", price:"5250"}
]

//print items-----
items.forEach(function(item){
    document.querySelector(".items").innerHTML += `
    <div class="item-card">${item.quantity}</div>`
})
//--------------------

var itemList = document.querySelectorAll(".item-card");
var rs = document.querySelector(".rs");
var choosed = document.querySelector("#choosed");
var priceCard = document.querySelector(".wrapper");
var clear = document.querySelector(".clear");
var buyButton = document.getElementById("rzp-button1");

// Form Validation ----------->
var userIdInput = document.getElementById("exampleInputEmail1");
var serverIdInput = document.getElementById("exampleInputPassword1");
var emailInput = document.getElementById("exampleInputPassword2");
var warn = document.getElementById("warn");



//on click find item ----- >
itemList.forEach(function(itemcard, index){
     itemcard.addEventListener("click", function(event){
        var clickedItem = items[index];
         rs.innerHTML = clickedItem.price;
         choosed.innerHTML = clickedItem.quantity;
         console.log(clickedItem.price);
         priceCard.style.display = "flex";


         // Check if the form fields are filled
        if (userIdInput.value !== "" && serverIdInput.value !== "" && emailInput.value !== "") {
            // Set the data-final attribute of the "Buy" button to the item's price
            buyButton.setAttribute("data-final", clickedItem.price);
            warn.style.display = "none";
            console.log("filled");
        } else {
            // If the form fields are empty, set the data-final attribute to 0
            buyButton.setAttribute("data-final", "0");
            userIdInput.style.border = "2px solid red";
            serverIdInput.style.border = "2px solid red";
            emailInput.style.border = "2px solid red";
            warn.style.display = "initial";
            rs.innerHTML = "0";
            choosed.innerHTML = "0";
            priceCard.style.display = "none";

        }
         
         //Setting Attribute to purchase button-------------->
        //  buyButton.setAttribute("data-final", clickedItem.price);
     })
    
})

//------------------------------

clear.addEventListener("click", function(){
    rs.innerHTML = "0";
    choosed.innerHTML = "0";
    priceCard.style.display = "none";
       //Setting Attribute to purchase button-------------->
       buyButton.setAttribute("data-final", 0);
})


userIdInput.addEventListener("input", function(){
    if(userIdInput.value.length > 0){
        userIdInput.style.border = "1px solid #000";
    }else{
        userIdInput.style.border = "2px solid red";
    }
})
serverIdInput.addEventListener("input", function(){
    if(serverIdInput.value.length > 0){
        serverIdInput.style.border = "1px solid #000";
    }else{
        serverIdInput.style.border = "2px solid red";
    }
})
emailInput.addEventListener("input", function(){
    if(emailInput.value.length > 0){
        emailInput.style.border = "1px solid #000";
    }else{
        emailInput.style.border = "2px solid red";
    }
})


//setting atribute for email -------->





