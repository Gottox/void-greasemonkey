// ==UserScript==
// @name        Void-Updates
// @namespace   http://voidlinux.eu
// @include     https://repo.voidlinux.eu/void-updates/void-updates.txt
// @version     1
// @grant       none
// ==/UserScript==
var e = document.body.getElementsByTagName("pre")[0];
e.innerHTML=e.innerHTML.replace(/^(\S+) +(\S+) [^ ]+ ([^ ]+) +(([^ ]+) +|)([^ ]+)$/gm, function(all, name, oVer, nVer) {
  var id=name+"-"+nVer;
	return "<input type='checkbox' onclick='localStorage[this.id]=this.checked?1:0' id='"+id+"' " + (localStorage[id]==1 ? "checked>" : ">") + "<label for='"+id+"'>" + all +"</label>";
});
