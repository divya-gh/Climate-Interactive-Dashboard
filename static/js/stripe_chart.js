function stripe_chart (tempData) {

    //print data
    console.log('Strip chart Data', tempData)

    function color_choice(temp) {
        if (temp<-8.5) {
            return '#0b275b';
        }
        else if((-8.5<=temp)&&(temp<-7.5)) {
            return 'rgb(3, 22, 52)';
        }
        else if((-7.5<=temp)&&(temp<-6.5)) {
            return 'rgb(6, 42, 100)';
        }
        else if((-6.5<=temp)&&(temp<-5.5)) {
            return 'rgb(10, 65, 152)';
        }
        else if((-5.5<=temp)&&(temp<-4.5)) {
            return 'rgba(10, 65, 152, 0.8)';
        }
        else if((-4.5<=temp)&&(temp<-3.5)) {
            return 'rgba(10, 65, 152, 0.7)';
        }
        else if((-3.5<=temp)&&(temp<-2.5)) {
            return 'rgba(10, 65, 152, 0.5)';
        }
        else if((-2.5<=temp)&&(temp<-1.5)) {
            return 'rgba(10, 65, 152, 0.3)';
        }
        else if((-1.5<=temp)&&(temp<-0.5)) {
            return 'rgba(10, 65, 152, 0.1)';
        }
        else if((-0.5<=temp)&&(temp<0.5)) {
            return 'white';
        }
        else if((0.5<=temp)&&(temp<1.5)) {
            return 'rgba(236, 43, 43, 0.1)';
        }
        else if((1.5<=temp)&&(temp<2.5)) {
            return 'rgba(236, 43, 43, 0.3)';
        }
        else if((2.5<=temp)&&(temp<3.5)) {
            return 'rgba(236, 43, 43, 0.4)';
        }
        else if((3.5<=temp)&&(temp<4.5)) {
            return 'rgba(236, 43, 43, 0.6)';
        }
        else if((4.5 <= temp)&&(temp < 5.5)) {
            return 'rgba(236, 43, 43, 0.7)';
        }
        else if((5.5<=temp)&&(temp<6.5)) {
            return 'rgb(236, 43, 43, 0.9)';
        }
        else if((6.5<=temp)&&(temp<7.5)) {
            return 'rgb(236, 43, 43)';
        }
        else if((7.5<=temp)&&(temp<8.5)) {
            return 'rgb(211, 18, 18)';
        }
        else if((8.5<=temp)&&(temp<9.5)) {
            return 'rgb(164, 14, 14)';;
        }
        else if((10.5<=temp)&&(temp<11.5)) {
            return 'rgb(117, 10, 10)'
        }
        else {
            return 'rgb(97, 4, 4)';
        }
    };
    
    function color(data) {
        var color_list = [];
    
        for (i = 0; i < data.length; i++) {
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
    var data = [{
        y: y_data(tempData),
        x: x_data(tempData), 
        type: 'bar',
        marker: {color: (color(tempData))}
    }]
    var layout = {
        showlegend: false,
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
    Plotly.newPlot('warming-stripes', data, layout)
}

//stripe_chart(avg_temp)

//-------------------------------------------------------//



