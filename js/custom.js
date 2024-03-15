function fAll(value) {
	var rows = document.getElementsByClassName(("filterTr"));
  
	if (value == "all") value = "";
   
	for (let i = 0; i < rows.length; i++) {
	  w3RemoveClass(rows[i]," showTr");    
	  var text = rows[i].className;
	  if (text.indexOf(value) > -1) w3AddClass(rows[i], " showTr");
	}
}

function f1(table,value) {
	var rows = document.getElementById(table).getElementsByClassName(("filterTr"));
  
	if (value == "all") value = "";
   
	for (let i = 0; i < rows.length; i++) {
	  w3RemoveClass(rows[i]," showTr");    
	  var text = rows[i].className;
	  if (text.indexOf(value) > -1) w3AddClass(rows[i], " showTr");
	}
}

function f2(fil1,table,value) {
	var rows = document.getElementById(table).getElementsByClassName(("filterTr"));

	var currentTeam = document.getElementById(fil1).getElementsByClassName("active");
	var team = currentTeam[0].getAttribute('onclick').split('\'')[3];
	if (team == "all") team = ""; 
	if (value == "all") value = ""; 

	for (let i = 0; i < rows.length; i++) {
    w3RemoveClass(rows[i], "showTr");
    var text = rows[i].className;   
	if (text.indexOf(team) > -1 & text.indexOf(value) > -1) w3AddClass(rows[i], "showTr");
  }
}

function fR(value) {
	var cols = document.getElementsByClassName(("filterTd"));

	if (value == "all") value = "";

	for (let i = 0; i < cols.length; i++) {
		w3RemoveClass(cols[i], "showTd");
		var text = cols[i].className;
		if (text.indexOf(value) > -1) w3AddClass(cols[i], "showTd");
	}
}

function findRank(array,team) {
	for (let i = 0; i<array.length; i++){
		if(array[i] == team){
			return i;
		}
	}
	return -1;
}


function showAll(table,team,rookie) {
	rows = document.getElementById(table).getElementsByClassName("filterTr");	
	for (let i = 0; i<rows.length; i++){
		text = rows[i].className;
		is_team = text.indexOf(team) > -1;
		is_rookie = text.indexOf(rookie) > -1;
		is_showing = text.indexOf("showTr") > -1;

		if(is_team & is_rookie & !is_showing){
			w3AddClass(rows[i]," showTr");
		}else if( (!is_team | !is_rookie) & is_showing){
			w3RemoveClass(rows[i]," showTr");
		}
	}
}

function fC(table,teamFilter,rookieFilter,value) {
	cbs = document.querySelectorAll('.form-check-input:not(#checkSwitch)');
	rows = document.getElementById(table).getElementsByClassName("filterTr");
	currentTeam = document.getElementById(teamFilter).getElementsByClassName("active");
	team = currentTeam[0].getAttribute('onclick').split('\'')[3];
	currentRookie = document.getElementById(rookieFilter).getElementsByClassName("active");
	rookie = currentRookie[0].getAttribute('onclick').split('\'')[5];

	if (team == "all") team = "";
	if (rookie == "all") rookie = "";

	showAll(table,team,rookie);

	for (let i = 0; i < cbs.length; i++) {
		cb = cbs[i].getAttribute('onclick').split('\'')[7];

		for (let j = 0; j < rows.length; j++) {
			text = rows[j].className;
			is_value = text.indexOf(cb) > -1;
			is_showing = text.indexOf("showTr") > -1;
			
			if (cb == "current" | cb == "active") {
				if (cbs[i].checked) {
					if ( !is_value & is_showing) w3RemoveClass(rows[j], " showTr");
				}
			} else if(!cbs[i].checked) {
				if (is_value & is_showing) w3RemoveClass(rows[j], " showTr");			
			}
		}
	}	
}

function switchAvgTotal(value) {
	$("#stats_tb tbody td").each(function () {
		$(this).html($(this).data(value));
		$(this).attr("data-order", $(this).data(value));
	});
};

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}