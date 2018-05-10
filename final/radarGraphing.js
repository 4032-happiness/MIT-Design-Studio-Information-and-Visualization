var input = document.getElementById("input");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("myBtn").click();
        }
    });
    function doWhatIWant() {
        var data2;
        var country = document.getElementById("input").value

        d3.csv("data.csv", function(error, data){
            if (error) {
                throw error;
            }
            var you = {"Country": "You", "Life Ladder":"1.8", "Healthy Life Expectancy/10":"5.2", "Social Support":"3.6", "Generosity":"3.7", "Positive Affect":"5.0", "Negative Affect":"5.3"};
            data.unshift(you);
            //console.log(data);
            showRadar(data);
        });

        function showRadar(data2){
            var data = [];
            var chart = RadarChart.chart();
            var w = 600,
              h = 600,
              headers = []
            data2.forEach(function(item, i){
                if (data2[i]["Country"] == "You" || data2[i]["Country"] == country) {
            console.log(data2);
              newSeries = {};
              for(var j in item) {
                let v = item[j];
                console.log(j);
                  console.log(v);
                if(j=="Country"){
                  newSeries.className = v;
                  newSeries.axes = [];
                }else{
                  newSeries.axes.push({"axis":[j], "value": [v]});//parseFloat(v)});
                }
              }
              data.push(newSeries);
              console.log(newSeries);

                }
            });

            RadarChart.defaultConfig.radius = 4;
            RadarChart.defaultConfig.w = w;
            RadarChart.defaultConfig.h = h;
            RadarChart.draw("#chart-container", data);
            // function animate(elem,time) {
            //     if( !elem) return;
            //     var to = elem.offsetTop;
            //     var from = window.scrollY;
            //     var start = new Date().getTime(),
            //         timer = setInterval(function() {
            //             var step = Math.min(1,(new Date().getTime()-start)/time);
            //             window.scrollTo(0,(from+step*(to-from))+1);
            //             if( step == 1){ clearInterval(timer);};
            //         },25);
            //         window.scrollTo(0,(from+1));
            // }
            // var divVal = document.getElementById('chart-container');
            // animate(divVal,600);
        }
    }
