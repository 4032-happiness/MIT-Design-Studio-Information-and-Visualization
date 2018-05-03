 window.onload = function () { 

       
       document.getElementById("submit").addEventListener('click', function(event){
         createEvent(event);
       });
 }


    // add on change for dat handler
   



function createEvent(e){
    var happiness = document.getElementById("happiness_ladder").value;
    localStorage.setItem("happiness",happiness);
    var country = document.getElementById("country").value;
    localStorage.setItem("country",country);
    var enjoyment = document.getElementById("enjoyment").value;
    localStorage.setItem("enjoyment",enjoyment);
    var smile = document.getElementById("smile").value;
    localStorage.setItem("smile",smile);
    var worry = document.getElementById("worry").value;
    localStorage.setItem("worry",worry);
    var social_support = document.getElementById("social_support").value;
    localStorage.setItem("social_support",social_support);
    var generosity =document.getElementById("generosity").value;
    localStorage.setItem("generosity",generosity);
    var income = document.getElementById("income").value;
    localStorage.setItem("income",income);
    var life_expectancy = document.getElementById("life").value;
    localStorage.setItem("life_expectancy",life_expectancy);
    window.location.href='Scatter/scatter.html';
  }



