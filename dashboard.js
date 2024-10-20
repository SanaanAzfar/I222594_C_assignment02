let generator,generator2,generator3;
function update_chart(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}

function remove_chart(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function getweather()
{

    let city =document.querySelector('#get_city_name').value;
    const apikey='0c905850111d84aa73dd759abd77ad0b';
const city_weather= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&mode=xml&units=metric`;

const myxhr = new XMLHttpRequest();
myxhr.open('GET',city_weather,true);
myxhr.onload=function()
{
    if(myxhr.status==200)
    {
        const data =myxhr.responseXML;
        document.querySelector('#setcity_name').textContent='City Name: '+data.getElementsByTagName('city')[0].getAttribute('name');
        document.querySelector('#settemperature').textContent='Temperature: '+data.getElementsByTagName('temperature')[0].getAttribute('value')+'C';
        document.querySelector('#sethumidity').textContent='Humidity: '+data.getElementsByTagName('humidity')[0].getAttribute('value');
        document.querySelector('#setwindspeed').textContent='Wind Speed: '+data.getElementsByTagName('speed')[0].getAttribute('value');
        let desc=data.getElementsByTagName('weather')[0].getAttribute('value');
        document.querySelector('#setweatherdescription').textContent='Description: '+desc;
        document.querySelector('#setweathericon').textContent='Icon: '+data.getElementsByTagName('weather')[0].getAttribute('icon');
        document.querySelector('#icon_weather').src='https://openweathermap.org/img/w/'+data.getElementsByTagName('weather')[0].getAttribute('icon')+'.png'
        
        if(desc.includes('clear'))
        {document.querySelector('#back_widget').src='./images/clear.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else if(desc.includes('rain'))
        {document.querySelector('#back_widget').src='./images/rain.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else if(desc.includes('drizzle'))
        {document.querySelector('#back_widget').src='./images/drizzle.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else if(desc.includes('cloud'))
        {document.querySelector('#back_widget').src='./images/cloud.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else if(desc.includes('snow'))
        {document.querySelector('#back_widget').src='./images/snow.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else if(desc.includes('thunderstorm'))
        {document.querySelector('#back_widget').src='./images/thunderstorm.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        else
        {document.querySelector('#back_widget').src='./images/skull.jpg';
            document.querySelector('#back_widget').style.visibility='visible';
        }
        //chart part
        let latitiude=data.getElementsByTagName('coord')[0].getAttribute('lat');
        let longitude=data.getElementsByTagName('coord')[0].getAttribute('lon');
        const weather_history=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitiude}&lon=${longitude}&appid=${apikey}&mode=xml&units=metric`;
    
        const myxhr2 = new XMLHttpRequest();
        myxhr2.open('GET',weather_history,true);
        myxhr_forcast=myxhr2;
        myxhr2.onload=function()
        { if(myxhr2.status==200)
            {const data2=myxhr2.responseXML;
                 let alltimes =Array.from(data2.getElementsByTagName('time')).map(time=>time.getAttribute('from'));
                let temp =Array.from(data2.getElementsByTagName('temperature')).map(temper=>temper.getAttribute('value'));
                if(generator)
                    {
                        update_chart(generator,alltimes,temp);
                    }
                generator =document.querySelector('#line_chart').getContext('2d'); 
                new Chart(generator,{
                type:'line',
                data:
                    {labels:alltimes,
                        datasets:[{
                            label: 'Average Temperature',
                            data: temp,
                            backgroundColor: 'red',
                            borderColor: 'blue',
                            borderWidth: 2,
                        }]
                    },
                    options:{
                        scales:{
                            y:{
                                beginAtZero: false,
                                easing: 'easeInOutElastic',
                                from: (ctx) => {
                                  if (ctx.type === 'data') {
                                    if (ctx.mode === 'default' && !ctx.dropped) {
                                      ctx.dropped = true;
                                      return 0;}
                                    }
                                }
                            }
                        }
                    },
            });
            if(generator2)
                {
                    update_chart(generator2,alltimes,temp);
                }
                let delayed;
                generator2 =document.querySelector('#bar_chart').getContext('2d');
                new Chart(generator2,{
                type:'bar',
                data:
                    {labels:alltimes,
                        datasets:[{
                            label: 'Average Temperature',
                            data: temp,
                            backgroundColor: 'red',
                            borderColor: 'blue',
                            borderWidth: 2,
                        }]
                    },
                    options:{
                        animation: {
                            onComplete: () => {
                              delayed = true;
                            },
                            delay: (context) => {
                              let delay = 0;
                              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                              }
                              return delay;
                            },
                          },
                        scales:{
                            y:{
                                beginAtZero: false,
                            }
                        }
                    },
            });
            
            //calucations for doughnut chart
            let descrip =Array.from(data2.getElementsByTagName('symbol')).map(w=>w.getAttribute('name'));
            console.log(descrip);
            const all_weather_conditions = ['clear','clouds', 'rain','drizzle', 'thunderstorm','snow','sleet','mist','fog','haze','dust','sand','volcanic ash','tornado','tropical storm','hurricane','cold','hot','windy','smoke','squall'];
            let all_weather_condition_day= new Array(all_weather_conditions.length).fill(0);
            descrip.forEach(de=>{
                all_weather_conditions.forEach(we=>{
                    if(de==we||de.includes(we))
                    {all_weather_condition_day[all_weather_conditions.indexOf(we)]+=1;}
                });
            });
            let all_weather_conditions_final=all_weather_conditions.filter((val,indx)=>all_weather_condition_day[indx]!==0);
            let all_weather_condition_day_final=all_weather_condition_day.filter(val=>val!==0)
            
            let colors=['#87CEEB','#B0C4DE','#4682B4','#5F9EA0','#800080','#FFFFFF','#D3D3D3','#A9A9A9','#808080','#F0E68C','#DEB887','#C2B280','#8B4513','#FF4500','#FFD700','#00BFFF','#FF69B4','#FF8C00','#A52A2A','#708090','#ADD8E6' ];

            if(generator3)
                {
                    update_chart(generator3,all_weather_conditions_final,all_weather_condition_day_final);
                }
             generator3 =document.querySelector('#dough_chart').getContext('2d');
            new Chart(generator3,{
            type:'doughnut',
            data:
                {labels:all_weather_conditions_final,
                    datasets:[{
                        label: 'Weather days percent(%)',
                        data: all_weather_condition_day_final,
                        backgroundColor: colors.slice(0, all_weather_condition_day_final.length),
                        borderColor: 'black',
                        borderWidth: 2,
                    }]
                },
                options:{
                    animation: {
                        onComplete: () => {
                          delayed = true;
                        },
                        delay: (context) => {
                          let delay = 0;
                          if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                          }
                          return delay;
                        },
                      },
                    scales:{
                        y:{
                            beginAtZero: false
                        }
                    }
                },
        });
        }
        }
        
        myxhr2.send();
    }
    else
    {
        document.querySelector('#setcity_name').textContent='City Name: NONE';
        document.querySelector('#settemperature').textContent='Temperature: NONE';
        document.querySelector('#sethumidity').textContent='humidity: NONE';
        document.querySelector('#setwindspeed').textContent='Wind Speed: NONE';
        document.querySelector('#setweatherdescription').textContent='Description: NONE';
        document.querySelector('#setweathericon').textContent='Icon: NONE';

    }
};
myxhr.send();
}