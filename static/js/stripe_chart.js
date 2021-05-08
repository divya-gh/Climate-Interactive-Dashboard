function stripe_chart (tempData) {

    //print data
    console.log('Strip chart Data', tempData)

    function color_choice(temp) {
        if (temp<-4) {
            return 'rgb(0, 0, 102)';
        }
        else if((-4<=temp)&&(temp<-3)) {
            return 'rgb(0, 0, 153)';
        }
        else if((-3<=temp)&&(temp<-2)) {
            return 'rgb(0, 0, 204)';
        }
        else if((-2<=temp)&&(temp<-1)) {
            return 'rgb(0, 0, 230)';
        }
        else if((-1<=temp)&&(temp<-0.8)) {
            return 'rgb(0, 0, 255)';
        }
        else if((-0.8<=temp)&&(temp<-0.6)) {
            return 'rgb(51, 51, 255)';
        }
        else if((-0.6<=temp)&&(temp<-0.4)) {
            return 'rgb(102, 102, 255)';
        }
        else if((-0.4<=temp)&&(temp<-0.2)) {
            return 'rgb(153, 153, 255)';
        }
        else if((-0.2<=temp)&&(temp<0)) {
            return 'rgb(179, 179, 255)';
        }
        else if ((0<=temp)&&(temp<0.2)) {
            return 'rgb(236, 70, 68)'
        }
        else if((0.2<=temp)&&(temp<0.4)) {
            return 'rgba(236, 43, 43, 0.1)';
        }
        else if((0.4<=temp)&&(temp<0.6)) {
            return 'rgba(236, 43, 43, 0.3)';
        }
        else if((0.6<=temp)&&(temp<0.8)) {
            return 'rgba(236, 43, 43, 0.4)';
        }
        else if((0.8<=temp)&&(temp<1)) {
            return 'rgba(236, 43, 43, 0.6)';
        }
        else if((1 <= temp)&&(temp < 2)) {
            return 'rgba(236, 43, 43, 0.7)';
        }
        else if((2<=temp)&&(temp<3)) {
            return 'rgba(236, 43, 43, 0.9)';
        }
        else if((3<=temp)&&(temp<4)) {
            return 'rgb(236, 43, 43)';
        }
        else if((4<=temp)&&(temp<5)) {
            return 'rgb(211, 18, 18)';
        }
        else if((5<=temp)&&(temp<6)) {
            return 'rgb(164, 14, 14)';;
        }
        else if((6<=temp)&&(temp<7)) {
            return 'rgb(117, 10, 10)'
        }
        else {
            return 'rgb(97, 4, 4)';
        }
    };
    
    function color(data) {
        var color_list = [];
    
        for (i = 0; i < tempData.length; i++) {
            var color = color_choice(data[i])
            color_list.push(color)
        };
        return color_list;
    }
    function y_data(data) {
        var y_list = [];
        for (i = 1; i < data.length; i++) {
            
            y_list.push(10)
        };
        return y_list;
    }

    function x_data(data){
        var x_list = [];
        for (i=0; i< data.length; i++) {
            x_list.push(i);
        };
        return x_list;
        
    }

<<<<<<< HEAD
=======

>>>>>>> 6c5546c80fb15ef6e44723f29fe678f39c6a2070
    var data = [{
        y: y_data(tempData),
        x: x_data(tempData), 
        type: 'bar',
<<<<<<< HEAD
        marker: {color: (color(tempData)),
            opacity: 1}
=======
        mode:markers,
        marker: {color: color(tempData),
                 showscale:True
                }
>>>>>>> 6c5546c80fb15ef6e44723f29fe678f39c6a2070
    }]
    var layout = {
        showlegend: false,
        height:100,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        
        xaxis: {
            visible:false
        },
        yaxis:{
            ticks: '',
            showticklabels: false,
            visible: false
        },
        bargap:0, 
    }
    Plotly.newPlot('warming-stripes', data, layout,{responsive : true})
}

//stripe_chart(avg_temp)

//-------------------------------------------------------//



