function stripe_chart (tempData, country) {

    //print data
    //console.log('Strip chart Data', tempData)

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
            return 'rgb(255, 179, 179)'
        }
        else if((0.2<=temp)&&(temp<0.4)) {
            return 'rgb(255, 153, 153)';
        }
        else if((0.4<=temp)&&(temp<0.6)) {
            return 'rgb(255, 102, 102)';
        }
        else if((0.6<=temp)&&(temp<0.8)) {
            return 'rgb(255, 77, 77)';
        }
        else if((0.8<=temp)&&(temp<1)) {
            return 'rgb(255, 0, 0)';
        }
        else if((1 <= temp)&&(temp < 2)) {
            return 'rgb(230, 0, 0)';
        }
        else if((2<=temp)&&(temp<3)) {
            return 'rgb(179, 0, 0)';
        }
        else if((3<=temp)&&(temp<4)) {
            return 'rgb(128, 0, 0)';
        }
        else {
            return 'rgb(77, 0, 0)';
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
    

    var data = [{
        y: y_data(tempData),
        x: x_data(tempData), 
        type: 'bar',        
        marker: {color: color(tempData)                
                }
    }]
    var layout = {
        showlegend: false,
        autosize: true,
        height:100,         
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        annotations: [{
            x: (tempData.length/2),
            y: 6,
            xref: 'x',
            yref: 'y',
            text: country,
            showarrow: false,
            font: {
                family: 'Arial',
                size: 60,
                color: 'rgb(11,47,71)'
            },
            align: 'center',
            // borderpad: 4,
            // bgcolor: 'rgb(11,47,71)'
        }],
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



