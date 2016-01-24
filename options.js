/*
 *  Copyright (C) 2013  AJ Ribeiro
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

var colorCodes = {
	"red"   : "ff3300",
	"green" : "008000",
	"blue"  : "00008B",
	"yellow": "FFFF00"
};

var colorNames = {
	"ff3300": "red",
	"008000": "green",
	"00008B": "blue",
	"FFFF00": "yellow"
};

var defaultGests = {
	"U" : "newtab",
	"R" : "forward",
	"L" : "back",
	"UD": "closetab"
};

var commandTrans = {
	"History Back"           : "back",
	"History Forward"        : "forward",
	"Reload"                 : "reload",
	"Stop Loading"           : "stop",
	"Open New Tab"           : "newtab",
	"Close Current Tab"      : "closetab",
	"Close Background Tabs"  : "closeback",
	"Close Window"           : "closeall",
	"Reload All Tabs"        : "reloadall",
	"Next Tab"               : "nexttab",
	"Previous Tab"           : "prevtab",
	"Scroll to Top"          : "scrolltop",
	"Scroll to Bottom"       : "scrollbottom",
	"Re-open Last Closed Tab": "lasttab"
};

function invertHash(hash) {
	var inv = {};
	for(var key in hash) {
		if(hash.hasOwnProperty(key)) {
			inv[hash[key]] = key;
		}
	}
	return inv;
}

function fillMenu() {
	var key, div, tr, td, inp;
	var gests = {};

	for(key in localStorage) {
		if(localStorage.hasOwnProperty(key)) {
			if(key === "colorCode" || key === "width") {
				continue;
			}
			gests[key] = localStorage[key];
		}
	}

	if(Object.keys(gests).length === 0) {
		gests = invertHash(defaultGests);
	}

	// availG = invertHash(gests)
	div = document.getElementById("optsTab");
	for(key in commandTrans) {
		if(commandTrans.hasOwnProperty(key)) {
			tr = div.insertRow(div.rows.length);
			td = document.createElement("td");
			td.appendChild(document.createTextNode(key));
			tr.appendChild(td);
			td = document.createElement("td");
			inp = document.createElement("input");
			inp.type = "text";
			if(gests[commandTrans[key]]) {
				inp.value = gests[commandTrans[key]];
			}
			td.align = "center";
			tr.appendChild(td);
			td.appendChild(inp);
		}
	}
}

// Saves options to localStorage.
function saveOptions() {
	var select = document.getElementById("color");
	var value = select.children[select.selectedIndex].value;
	localStorage.colorCode = colorCodes[value];

	select = document.getElementById("width");
	localStorage.width = select.children[select.selectedIndex].value;

	var rocker = document.getElementById("rocker");
	if(rocker.checked) {
		localStorage.rocker = true;
	} else {
		localStorage.rocker = false;
	}

	var trail = document.getElementById("trail");
	if(trail.checked) {
		localStorage.trail = true;
	} else {
		localStorage.trail = false;
	}

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Configuration Saved";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);

	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		var s = inputs[i].parentElement.parentElement.children[0].textContent;
		if(inputs[i].value.length > 0) {
			localStorage.setItem(commandTrans[s], inputs[i].value);
		} else {
			localStorage.removeItem(commandTrans[s]);
		}
	}

}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
	var select = document.getElementById("color");
	var value = colorNames[localStorage.colorCode];
	if(!value) {
		value = "red";
	}
	for(var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if(child.value === value) {
			child.selected = "true";
			break;
		}
	}

	select = document.getElementById("width");
	value = localStorage.width;
	if(!value) {
		value = 3;
	}
	for(var ii = 0; ii < select.children.length; ii++) {
		var child2 = select.children[ii];
		if(child2.value === value) {
			child2.selected = "true";
			break;
		}
	}
}

function loadInfo() {
	restoreOptions();
	fillMenu();
}

document.addEventListener("DOMContentLoaded", loadInfo);
document.querySelector("#save").addEventListener("click", saveOptions);
