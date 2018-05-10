var hapiness;
var country;
var positive_affect;
var negative_affect;
var social_support;
var generosity;




window.onload = function () {

       setCountryDropDown();
       document.getElementById("submit").addEventListener('click', function(event){
         if (validate_form()){
            createEvent(event);
         }
       });

 }





function createEvent(e){
    
    happiness = getRadioValue("happiness_ladder");
    console.log(happiness);
    localStorage.setItem("happiness",happiness);
    
    country = document.getElementById("country").value;
    localStorage.setItem("country",country);
    
    positive_affect = getRadioValue("smile");//document.getElementById("smile").value;
    localStorage.setItem("positive_affect",positive_affect);
    
    negative_affect = getRadioValue("worry");//document.getElementById("worry").value;
    localStorage.setItem("negative_affect",negative_affect);
    
    social_support = getRadioValue("social_support");//document.getElementById("social_support").value;
    localStorage.setItem("social_support",social_support);
    
    generosity =getRadioValue("generosity");//document.getElementById("generosity").value;
    localStorage.setItem("generosity",generosity);
    console.log(generosity);
    window.location.href='final.html';
  }

function getRadioValue(name){
    var radios = document.getElementsByName(name);
    var value;
    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            value = radios[i].value;
        }
    }
    return value;
}   


function setCountryDropDown(){
    var dropdown = document.getElementById("country");
    d3.csv("WHR.csv", function(data) {
    var countries = [];
    for (var i = 0; i < data.length; i++) {
        if (countries.includes(data[i].country)){
            countries.push(data[i].country);
        }
        else{
            countries.push(data[i].country);
            var opt = document.createElement('option');
            opt.value = countries[i];
            opt.innerHTML = countries[i];
            dropdown.appendChild(opt);
        }


    }
    });

}

function validate_form(){
    return true;
}
