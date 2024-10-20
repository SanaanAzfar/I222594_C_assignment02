function getweatherdata() {

    if(document.getElementById('time_0'))
    {
        for(j=0;j<10;j++)
        {
            document.getElementById("time_"+j).remove();
            document.getElementById("temperature_"+j).remove();
            document.getElementById("humidity_"+j).remove();
            document.getElementById("windspeed_"+j).remove();
            document.getElementById("description_"+j).remove();
            document.getElementById("icon_"+j).remove();
            document.getElementById("icon_id_"+j).remove();  
        }
    }

    let city = document.querySelector('#get_city_name').value;
    const apikey = '0c905850111d84aa73dd759abd77ad0b';
    const city_weather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&mode=xml&units=metric`;

    const myxhr = new XMLHttpRequest();
    myxhr.open('GET', city_weather, true);
    myxhr.onload = function () {
        if (myxhr.status == 200) {
            const data = myxhr.responseXML;
            let latitiude = data.getElementsByTagName('coord')[0].getAttribute('lat');
            let longitude = data.getElementsByTagName('coord')[0].getAttribute('lon');
            
            const weather_history = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitiude}&lon=${longitude}&appid=${apikey}&mode=xml&units=metric`;
            const myxhr2 = new XMLHttpRequest();
            myxhr2.open('GET', weather_history, true);

            myxhr2.onload = function () {
                if (myxhr2.status == 200) {
                    const data2 = myxhr2.responseXML;
                    for (let i = 0; i < 10; i++)
                    {r1=document.getElementById('time_row');
                    td1=document.createElement('td')
                    td1.textContent=(data2.getElementsByTagName('time')[i].getAttribute('from'));
                    td1.id="time_"+i;
                    r1.appendChild(td1);

                     r2=document.getElementById('temperature_row');
                     td2=document.createElement('td')
                    td2.textContent=(data2.getElementsByTagName('time')[i].getElementsByTagName('temperature')[0].getAttribute('value'))+"C";
                    td2.id="temperature_"+i;
                    r2.appendChild(td2);

                    r3=document.getElementById('humidity_row');
                    td3=document.createElement('td')
                    td3.textContent=(data2.getElementsByTagName('time')[i].getElementsByTagName('humidity')[0].getAttribute('value'))+"C";
                    td3.id="humidity_"+i;
                    r3.appendChild(td3);

                    r4=document.getElementById('windspeed_row');
                    td4=document.createElement('td')
                    td4.textContent=(data2.getElementsByTagName('time')[i].getElementsByTagName('windSpeed')[0].getAttribute('mps'))+"m/s";
                    td4.id="windspeed_"+i;
                    r4.appendChild(td4);

                    r5=document.getElementById('description_row');
                    td5=document.createElement('td')
                    td5.textContent=(data2.getElementsByTagName('time')[i].getElementsByTagName('symbol')[0].getAttribute('name'));
                    td5.id="description_"+i;
                    r5.appendChild(td5);

                    r6=document.getElementById('icon_id_row');
                    td6=document.createElement('td')
                    td6.textContent=(data2.getElementsByTagName('time')[i].getElementsByTagName('symbol')[0].getAttribute('var'));
                    td6.id="icon_id_"+i;
                    r6.appendChild(td6);

                    r7=document.getElementById('icon_row');
                    td7=document.createElement('td')
                    ig7=document.createElement('img')
                    ig7.src='https://openweathermap.org/img/w/'+data2.getElementsByTagName('time')[i].getElementsByTagName('symbol')[0].getAttribute('var')+'.png';
                    td7.appendChild(ig7);
                    td7.id="icon_"+i;
                    r7.appendChild(td7);
                    //src='https://openweathermap.org/img/w/'+data2.getElementsByTagName('weather').getAttribute('icon')+'.png'));
                }
                }
            };
            myxhr2.send();
        }
    };
    myxhr.send();
}

function sendtogem()
{
    let message_to_gem="";
    apikey='AIzaSyBIPBMNHn11yS2feCeSqhAcsFNyi9hFW7k';
 gem_url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apikey}`;
 const myxhr = new XMLHttpRequest();
 myxhr.open('POST', gem_url, true);
 myxhr.setRequestHeader('Content-Type', 'text/plain'); 
 myxhr.onload=function(){
if(myxhr.status==200)
{
document.getElementById('sent_message').textContent=myxhr.responseText;
}
};
if(document.querySelector('#get_gem_message').value!='')
    {
    message_to_gem+='question:'+document.querySelector('#get_gem_message').value+"\ntable of weather:";
    for(i=0;i<10;i++)
    {
     message_to_gem+=document.getElementById("time_"+i).textContent+"\n";
     message_to_gem+=document.getElementById("temperature_"+i).textContent+"\n";
     message_to_gem+=document.getElementById("humidity_"+i).textContent+"\n";
     message_to_gem+=document.getElementById("windspeed_"+i).textContent+"\n";
     message_to_gem+=document.getElementById("description_"+i).textContent+"\n";
    }
    message_to_gem+="\nif the following message does not contain anything realted to weather, just answer by saying, I'm sorry but I can't help you with that.";
    }
    console.log(message_to_gem);
myxhr.send(message_to_gem);

}