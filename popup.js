"use strict";
var MYAPP = {};
MYAPP.specific_ip = null;
// url = "https://ip.cn/";
var ownIpQueryUrl = "https://ipapi.co/json/";
var speIpQueryBaseurl = `https://ipapi.co/${MYAPP.specific_ip}/json/`;

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

  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  document.body.removeChild(copyFrom);
  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  // document.body.removeChild(copyFrom);
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
  var el = document.getElementById('specific-ip-submit');
  el.addEventListener('click', function(){
    var ip = document.getElementById('specific-ip').value;
    // console.log(ip);
    MYAPP.specific_ip = ip;
    speIpQueryBaseurl = `https://ipapi.co/${MYAPP.specific_ip}/json/`;
    // console.log(speIpQueryBaseurl);
    showIp(speIpQueryBaseurl);
  }, false);


}

function showIp(url){
  httpRequest(url, function(ip){
    var ip_address = ip.ip;
    document.getElementById('ip-address').innerHTML = ip_address;
    var position = ip.city + ',' + ip.region + ',' + ip.country_name;
    document.getElementById('ip-position').innerText = position;
    var organization = ip.org;
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
