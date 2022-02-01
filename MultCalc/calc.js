var epikCounter = 4;
var mythCounter = 3;
var SetType = 0;

function Init(){
	for (var i = 0; i < 2; ++i){
		accForm.accs[i].hidden = false;
		accForm.accs[i].addEventListener("click", onclick);
	}
}

function onclick(e){
	var newSetType =  parseInt(e.target.value);
	if (SetType != newSetType)   clear_mults();
    SetType = newSetType;
}

function strat() {
	let rate    = parseFloat(document.getElementById('rate').value)/1000.0;
	let level   = parseFloat(document.getElementById('level').value);
	let library = parseFloat(document.getElementById('library').value);
	let graal   = 1.0 + parseFloat(document.getElementById('graal').value)/100.0;
	let baseMults = [];
	let graalMults = [];
	let coeff = SetType == 0 ? 1.4 : 1.3;
	let setCoeff = SetType == 0 ? 1.2 : 1.15;
	let currMult = rate*level*library*Math.pow(1.05,epikCounter)*Math.pow(1.07,mythCounter);
	baseMults[0] = Math.ceil(currMult);
	graalMults[0] = Math.ceil(currMult*graal);
	for (var i = 1; i < 4; i++){
		currMult *= coeff;
		baseMults[i] = Math.ceil(currMult);
		graalMults[i] = Math.ceil(currMult*graal);
	}
	baseMults[4] = Math.ceil(currMult*coeff*setCoeff);
	graalMults[4] = Math.ceil(currMult*coeff*setCoeff*graal);
	let baseStr = "";
	let graalStr = "";
	for (var i = 0; i < 4; i++){
		baseStr += String(baseMults[i]) + ", ";
		graalStr += String(graalMults[i]) + ", ";
	}
	baseStr += String(baseMults[4]);
	graalStr += String(graalMults[4]);
	document.getElementById("baseMults").value = baseStr;
	document.getElementById("graalMults").value = graalStr;
}

function setEpikNum() {
  epikCounter = parseInt(document.getElementById('epikNum').value);
}

function setEpikNum() {
  epikCounter = parseInt(document.getElementById('mythNum').value);
}
function downBonus(set){
  if (set == 1){
	let currVal = parseInt(document.getElementById('epikNum').value) ;
	let minVal = parseInt(document.getElementById('epikNum').min);
	if (currVal > minVal ) document.getElementById('epikNum').value = currVal - 1;
	epikCounter = parseInt(document.getElementById('epikNum').value);
  }
  else{
	let currVal = parseInt(document.getElementById('mythNum').value) ;
	let minVal = parseInt(document.getElementById('mythNum').min);
	if (currVal > minVal ) document.getElementById('mythNum').value = currVal - 1;
	mythCounter = parseInt(document.getElementById('mythNum').value);
  }
  clear_mults();
}

function upBonus(set){
  if (set == 1){
	let currVal = parseInt(document.getElementById('epikNum').value) ;
	let maxVal = parseInt(document.getElementById('epikNum').max);
	if (currVal < maxVal ) document.getElementById('epikNum').value = currVal + 1;
	epikCounter = parseInt(document.getElementById('epikNum').value);
  }
  else{
	let currVal = parseInt(document.getElementById('mythNum').value) ;
	let maxVal = parseInt(document.getElementById('mythNum').max);
	if (currVal < maxVal ) document.getElementById('mythNum').value = currVal + 1;
	mythCounter = parseInt(document.getElementById('mythNum').value);
  }
  clear_mults();
}

function clear_mults() {
	document.getElementById("baseMults").value = "";
	document.getElementById("graalMults").value = "";
}
