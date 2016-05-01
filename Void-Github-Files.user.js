// ==UserScript==
// @name        Void-Github-Files
// @namespace   http://voidlinux.eu
// @include     https://github.com/*/void-packages/*
// @version     1
// @grant       none
// ==/UserScript==
Array.from(document.querySelectorAll('.file')).forEach(file => {
  var filename = (file.querySelector(".file-info .user-select-contain") || file.querySelector(".file-info")).title;
  if(!filename)
    filename = document.querySelector('.breadcrumb').innerText;
  
  if(!filename.endsWith("/template")) return;

  var btn = document.createElement("a");
  btn.innerText = "Resolve";
  btn.href = "#";
  btn.style.color = "orange";
  btn.onclick = function() {
    var isDiff = false
    var vars = { '+': {}, '-': {}, ' ': {} };
    Array.from(file.querySelectorAll('.blob-code')).forEach(line => {
      var ns = '';
      var text = line.innerText;
      var m, replaced = false;
      if(text[0] === "+" || text[0] === "-")
        isDiff = true;
    
      if(isDiff) {
        ns = line.innerText[0];
        text = text.substr(1);
      }

      text = text.replace(/\$({\w+[^}]*}|\w+)/g, (v, name) => {
        if(m = name.match(/^\{(\w*)\}$/, "\1")) {
          name = m[1];
        }
        if(vars[ns][name]) {
          replaced = true;
          return vars[ns][name];
        }
        return v;
      });
      if(replaced) {
        line.title = line.innerText;
        line.innerText = ns + text;
        line.style.background = "#f0f0f0";
      }
    
    if(m=text.match(/^\s*(\w*)=((["']).*(\\\3.*)*\3|[^ ]*)\s*$/)) {
        var name = m[1];
        var value = m[2];
        switch(ns) {
        case '+':
          vars['+'][name] = vars[' '][name] = value;
          break;
        case '-':
          vars['-'][name] = value;
          break;
        case ' ':
        case '':
          vars['+'][name] = vars['-'][name] = vars[' '][name] = value;
          break;
        }
      }
    });

    this.parentNode.removeChild(this);
    return false;
  }
  btn.className = "btn btn-sm";
  (file.querySelector(".btn-group") || file.querySelector(".file-header")).appendChild(btn);
});