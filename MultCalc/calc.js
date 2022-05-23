var epikCounter = 4;
var mythCounter = 3;
var onePctCounter = 0;
var twoPctCounter = 0;
var SetType = 0;
var lev_count = [7,7];
var lev_coeff = [[1.4,1.4168,1.434,1.451,1.468,1.486,1.504],[1.3,1.31,1.32,1.33,1.34,1.35,1.36]];
var set_coeff = [1.2,1.15];
var names = ["shapka","parik","predmet","aura"];
var baseMults = [];
var graalMults = [];

function Init(){
	for (var i = 0; i < 2; ++i){
		accForm.accs[i].hidden = false;
		accForm.accs[i].addEventListener("click", onclick);
	}
	for (var i = 0; i < 4; ++i){
		document.getElementById(names[i]).max = lev_count[SetType];
	}
}

function onclick(e){
	var newSetType =  parseInt(e.target.value);
	if (SetType != newSetType)   clear_mults();
    SetType = newSetType;
	for (var i = 0; i < 4; ++i){
		document.getElementById(names[i]).value = 1;
		document.getElementById(names[i]).max = lev_count[SetType];
	}
}

function strat() {
	let rate    = parseFloat(document.getElementById('rate').value)/1000.0;
	let level   = parseFloat(document.getElementById('level').value);
	let library = parseFloat(document.getElementById('library').value);
	let graal   = 1.0 + parseFloat(document.getElementById('graal').value)/100.0;
	epikCounter   = parseInt(document.getElementById('epikNum').value);
	mythCounter   = parseInt(document.getElementById('mythNum').value);
	onePctCounter = parseInt(document.getElementById('oneNum').value);
	twoPctCounter = parseInt(document.getElementById('twoNum').value);
	baseMults = [];
	graalMults = [];
	let coeff = SetType == 0 ? 1.4 : 1.3;
	let currMult = rate*level*library*Math.pow(1.05,epikCounter)*
			Math.pow(1.07,mythCounter)*Math.pow(1.01,onePctCounter)*Math.pow(1.02,twoPctCounter);
/*	baseMults[0] = Math.ceil(currMult);
	graalMults[0] = Math.ceil(currMult*graal);
	for (var i = 1; i < 4; i++){
		currMult *= coeff;
		baseMults[i] = Math.ceil(currMult);
		graalMults[i] = Math.ceil(currMult*graal);
	}
	baseMults[4] = Math.ceil(currMult*coeff*set_coeff[SetType]);
	graalMults[4] = Math.ceil(currMult*coeff*set_coeff[SetType]*graal);*/
	calcMults(currMult,0);
	baseMults = [...new Set(baseMults)]
	baseMults.sort(function(a,b){return b-a;});
	graalMults = [...new Set(graalMults)]
	graalMults.sort(function(a,b){return b-a;});
	baseMults[0] *= set_coeff[SetType];
	graalMults[0] *= set_coeff[SetType];
	let baseStr = "";
	let graalStr = "";
	for (var i = 0; i < baseMults.length-1; i++){
		baseStr += String(Math.ceil(baseMults[i])) + ",";
		graalStr += String(Math.ceil(graalMults[i])) + ",";
	}
	baseStr += String(Math.ceil(baseMults[baseMults.length-1]));
	graalStr += String(Math.ceil(graalMults[graalMults.length -1]));
	document.getElementById("baseMults").value = baseStr;
	document.getElementById("graalMults").value = graalStr;
}

function calcMults(curr,lev){
	for (var i = 0; i < 2; ++i){
		if (i == 0){
			if (lev < 3) calcMults(curr,lev+1);
			else {
				baseMults.push(curr);
				graalMults.push(curr*(1.0 + parseFloat(document.getElementById('graal').value)/100.0));
			}
		}
		else{
			let coeff = lev_coeff[SetType][parseInt(document.getElementById(names[lev]).value)-1];
			if (lev < 3)  calcMults(coeff*curr,lev+1);
			else {
				baseMults.push(coeff*curr);
				graalMults.push(coeff*curr*(1.0 + parseFloat(document.getElementById('graal').value)/100.0));
			}
		}
	}
}

function calcMult(curr){
	let allChk = true;
	let mult = curr;
	for (var i = 0; i < 4; i++){
		let chkStr = "chk" + String(i+1);
		if (document.getElementById(chkStr).checked){
			mult *= lev_coeff[SetType][parseInt(document.getElementById(names[i]).value)-1];
		}
		else{
			allChk = false;
		}
	}
	if (allChk){
		mult *= set_coeff[SetType];
	}
	return mult;
}

function clear_mults() {
	document.getElementById("baseMults").value = "";
	document.getElementById("graalMults").value = "";
}

function comb() {
	let rate    = parseFloat(document.getElementById('rate').value)/1000.0;
	let level   = parseFloat(document.getElementById('level').value);
	let library = parseFloat(document.getElementById('library').value);
	let graal   = 1.0 + parseFloat(document.getElementById('graal').value)/100.0;
	epikCounter   = parseInt(document.getElementById('epikNum').value);
	mythCounter   = parseInt(document.getElementById('mythNum').value);
	onePctCounter = parseInt(document.getElementById('oneNum').value);
	twoPctCounter = parseInt(document.getElementById('twoNum').value);
	let coeff = SetType == 0 ? 1.4 : 1.3;
	let currMult = rate*level*library*Math.pow(1.05,epikCounter)*
			Math.pow(1.07,mythCounter)*Math.pow(1.01,onePctCounter)*Math.pow(1.02,twoPctCounter);
	currMult = calcMult(currMult);
	let baseStr = String(Math.ceil(currMult));
	let graalStr = String(Math.ceil(currMult*(1.0 + parseFloat(document.getElementById('graal').value)/100.0)));
	document.getElementById("baseMults").value = baseStr;
	document.getElementById("graalMults").value = graalStr;
}
