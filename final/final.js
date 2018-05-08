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
var sheet = document.createElement('style'),
  $rangeInput = $('.range input'),
  prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

document.body.appendChild(sheet);



function createEvent(e){
    happiness = document.getElementById("happiness_ladder").value;
    localStorage.setItem("happiness",happiness);
    country = document.getElementById("country").value;
    localStorage.setItem("country",country);
    positive_affect = document.getElementById("smile").value;
    localStorage.setItem("smile",smile);
    negative_affect = document.getElementById("worry").value;
    localStorage.setItem("worry",worry);
    social_support = document.getElementById("social_support").value;
    localStorage.setItem("social_support",social_support);
    generosity =document.getElementById("generosity").value;
    localStorage.setItem("generosity",generosity);
    console.log(generosity);
    window.location.href='final.html';
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
