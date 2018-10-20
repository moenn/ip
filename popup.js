"use strict";
var MYAPP = {};
MYAPP.specific_ip = null;
var ownIpQueryUrl = "https://api.ip.sb/geoip";
var speIpQueryBaseurl = `https://api.ip.sb/geoip/${MYAPP.specific_ip}`;

function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}


function copyTextToClipboard(text) {

  console.log(text);
  var copyFrom = document.createElement("textarea");

  copyFrom.contentEditable = true;
  copyFrom.setAttribute("style","position:absolute; left: 0; top: 0; height: 0; visability: hidden;");
  copyFrom.textContent = text;

  document.body.appendChild(copyFrom);

  copyFrom.select();
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  document.body.removeChild(copyFrom);

}

function handleCp(){
  var btn = document.getElementsByClassName('copy')[0];
  btn.addEventListener('click', function(){
    var copyText = document.getElementById('ip-address').innerText;
    copyTextToClipboard(copyText);

  })

}

function handleInstantCp(){
  var instant_cp = document.getElementById('instant-cp');
  if(localStorage['instant_cp_enable'] === 'true'){
    instant_cp.checked = true;

  } else{
    instant_cp.checked = false;
  }

  instant_cp.addEventListener('change', function(){
    localStorage['instant_cp_enable'] = instant_cp.checked ? "true" : "false";
  })
}

function handleHideButton(){
  var button = document.getElementById('hide-specific-ip-input');
  var toHide = document.getElementById('specific-ip-wrapper');
  if(localStorage["hide-specific-ip-input"] === "true"){
    toHide.style.display = 'none';
  }else{
    toHide.style.display = 'block';
  }

  button.addEventListener('click', function(){
    if(toHide.style.display == 'block'){
      toHide.style.display = 'none';
      localStorage['hide-specific-ip-input'] = 'true';
    }else{
      toHide.style.display = 'block';
      localStorage['hide-specific-ip-input'] = 'false';
    }
  }, false)
}

function handleSpecificIp(){
  function ip(){
      var ip = document.getElementById('specific-ip').value;
      MYAPP.specific_ip = ip;
      speIpQueryBaseurl = `https://api.ip.sb/geoip/${MYAPP.specific_ip}`;
      showIp(speIpQueryBaseurl);
  }


  var el = document.getElementById('specific-ip');
  el.addEventListener('keypress', (event) => {
    if(event.key == 'Enter'){
      ip();
    }
  });

  var el = document.getElementById('specific-ip-submit');
  el.addEventListener('click', ip);
}


function showIp(url){
  httpRequest(url, function(ip){
    var ip_address = ip.ip;
    document.getElementById('ip-address').innerHTML = ip_address;
    var position = ip.city + ',' + ip.region + ',' + ip.country;
    document.getElementById('ip-position').innerText = position;
    var organization = ip.organization;
    document.getElementById("ip-organization").innerText = organization;

    if (localStorage['instant_cp_enable'] === "true"){
        copyTextToClipboard(ip_address);
    }
  }); 
}


handleCp();
handleInstantCp();
handleHideButton();
handleSpecificIp();

showIp(ownIpQueryUrl);
