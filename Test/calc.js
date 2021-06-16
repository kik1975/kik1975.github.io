var currDate = new Date();
var curracc = 0;
var videoBonus = videoBonuses[curracc];
var begDate = new Date(begDates[curracc][0],begDates[curracc][1],begDates[curracc][2])
var diffDays;
var combinations = [];
var nComb;
var strat1 = "";
var currComb = 0;
var currSubComb  = 0;
var stratcalced = false;


function diffDates() {
    return (currDate - begDate) / (60 * 60 * 24 * 1000);
};

function setComb(comb,subcomb){
	if (comb != 0){
		currComb += comb;
		currSubComb = 0;
	}
	else{
		currSubComb += subcomb;
	}
	altComb();
	document.getElementById("cpy").disabled = false;
};

function altComb(){
	if(!stratcalced) return;
	var checkbox=document.getElementById('myAlt');
	if(checkbox.checked){
		if (currComb > 0) document.getElementById('downComb').style.visibility='visible';
		else document.getElementById('downComb').style.visibility='hidden';
		if (currComb < combinations.length-1) document.getElementById('upComb').style.visibility='visible';
		else document.getElementById('upComb').style.visibility='hidden';
		if (currSubComb > 0) document.getElementById('leftComb').style.visibility='visible';
		else document.getElementById('leftComb').style.visibility='hidden';
		if (currSubComb < combinations[currComb].length-1) document.getElementById('rightComb').style.visibility='visible';
		else document.getElementById('rightComb').style.visibility='hidden';
	}
	else{
		currComb = 0;
		currSubComb  = 0;
		document.getElementById('upComb').style.visibility='hidden';
		document.getElementById('downComb').style.visibility='hidden';
		document.getElementById('leftComb').style.visibility='hidden';
		document.getElementById('rightComb').style.visibility='hidden';
	}
	if (stratcalced) showstrat();
};

function onclick(e){
    curracc = parseInt(e.target.value);
	videoBonus = videoBonuses[curracc];
	begDate = new Date(begDates[curracc][0],begDates[curracc][1],begDates[curracc][2])
	Init();
}

function isUnlikely(x){
	if ( x < 3 || x == 4 || x == 5 || x == 7 || x == 8 || x == 11 || x == 14 || x == 17) return true;
	return false;
}

function Init(){
	if (typeof userComb === 'undefined' || isNaN(parseInt(userComb))){
		nComb = 6;
	}
	else{
		nComb = parseInt(userComb);
	}
	if (typeof isAlt === 'undefined' || isAlt == false){
		document.getElementById('myAlt').checked == false;
	}
	else{
		document.getElementById('myAlt').checked == true;
	}
	document.getElementById('upComb').style.visibility='hidden';
	document.getElementById('downComb').style.visibility='hidden';
	document.getElementById('leftComb').style.visibility='hidden';
	document.getElementById('rightComb').style.visibility='hidden';
	document.getElementById('videoBonus').value = videoBonus;
	document.getElementById("needval").value = "";
	if (isAutoLevel[curracc]){
		diffDays = parseInt(diffDates());
		document.getElementById("level").value = range[curracc]+diffDays*3;
		calcSafe();
	}
	else{
		document.getElementById("level").value = "";
		document.getElementById("code1").value = "";
		document.getElementById("code2").value = "";
		document.getElementById("code3").value = "";
	}
    document.getElementById("Graal").hidden = isLiteVersion;
    document.getElementById("noGraal").hidden = isLiteVersion;
    if (accs > 1 && accs < 5){
        for (var i = 0; i < accs; ++i){
            accForm.accs[i].hidden = false;
            accForm.accs[i].addEventListener("click", onclick);
			let nm = "nm" + String(i);
            document.getElementById(nm).innerHTML = String(accNames[i]);
        }
    }
}

function strat() {
	stratcalced = true;
	document.getElementById("cpy").disabled = false;
	document.getElementById("result").innerHTML = "";
     let enableCopy = false;
		currComb = 0;
		currSubComb  = 0;
     let start = parseInt(document.getElementById("currval").value);
     let end = parseInt(document.getElementById("needval").value);
	 if (start >= end){
	    document.getElementById("result").innerHTML = "Цель меньше текущего результата";
		return;
	 }
	let multstr = document.getElementById("mults").value.split(' ').join(',').split('.').join(',').split(',');
	 if (multstr.length == 0){
	     document.getElementById("result").innerHTML = "Отсутствуют множители";
    	 return;
	 }
	 let vbonus = 0;
	 if (document.getElementById('videoCheck').checked == true && !isNaN(parseInt(document.getElementById('videoBonus').value))){
	      vbonus = parseInt(document.getElementById('videoBonus').value);
	 }
	let multnum = new Array()
	let j = 0;
	for (var i = 0; i < multstr.length; i++){
		if(isNaN(parseInt(multstr[i]))) continue;
		multnum[j] = [];
		multnum[j][0] = parseInt(multstr[i]);
		multnum[j][1] = 0;
		j++;
		if (vbonus > 0){
			multnum[j] = [];
			multnum[j][0] = parseInt(multstr[i])+parseInt(vbonus);
			multnum[j][1] = parseInt(vbonus);
			j++;
		}
	}
	 if (multnum.length == 0){
		document.getElementById("result").innerHTML = "Отсутствуют множители";
		return;
	 }
	multnum.sort(function(a, b) {
		return b[0] - a[0];
	});
	 diff = end - start;
	 if (diff < multnum[multnum.length-1][0]*3){
		document.getElementById("result").innerHTML = "Слишком большие множители";
		return;
	 }
	 combinations = [];
	 strat1 = strat1mult(multnum, diff);
	 let str2 = strat2mult(multnum, diff);
	 if (strat1 == "" && combinations.length == 0){
		strat1 = strat3mult(multnum, diff);
	 }
	 altComb();
  }
 function strat1mult(multnum, diff){
	 let checkBox = document.getElementById("myCheck");
	 for (var i = 0; i < multnum.length; i++){
		let up = Math.floor(diff/multnum[i][0]);
		let rest = diff%multnum[i][0];
		if (up < 3) continue;
		if (checkBox.checked == true && isUnlikely(up)) continue;
		if(rest == 0){
			if (multnum[i][1] == 0)
				return '<font color="blue">' + String(multnum[i][0]) + '</font>' + "x" + String(up);
			else
				return '<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>x" + String(up);
		}
	}
	return "";
 }

function strat2mult(multnum, diff){
	combinations = [];
	let checkBox = document.getElementById("myCheck");
	let pair = new Array();
	let pn = 0;
	for (var i = 0; i < multnum.length; i++){
		for (var j = i+1; j < multnum.length; j++ ){
			if (diff % nod2(multnum[i][0],multnum[j][0]) != 0) continue;
			pair[pn] = [];
			pair[pn][0] = multnum[i][0] + multnum[j][0];
			pair[pn][1] = i;
			pair[pn][2] = j;
			pn++;
		}
	}
	if (pair.length == 0) return "";
	pair.sort(function(a, b) {
		return b[0] - a[0];
	});
	let str1, str2;
	let combCount = 0;
	for (pn = 0; pn < pair.length, combCount < nComb; pn++){
		let i = pair[pn][1];
		let j = pair[pn][2];
		let maxmult = multnum[i][0];
		let minmult = multnum[j][0];
		let arr = gcd (maxmult, minmult, s1=1, s2=0, t1=0, t2=1);
		if (arr[1] < 0 && arr[2] < 0) continue;
		let k = diff / arr[0];
		let x0 = k*arr[1];
		let y0 = k*arr[2];
		let alpha = minmult / arr[0];
		let beta = maxmult / arr[0];
		let t = Math.floor(y0/beta);
		x0 = x0 + t*alpha;
		y0 = y0 - t*beta;
		while (y0 < 3){
			y0 += beta;
			x0 -= alpha;
		}
		if (checkBox.checked == true){
			while (isUnlikely(y0)){
				y0 += beta;
				x0 -= alpha;
			}
		}
		if (x0 < 3) continue;
		if (checkBox.checked == true && isUnlikely(x0)) continue;
		if (multnum[i][1] == 0)
			str1 = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(x0);
		else 
			str1 ='<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(x0);
		if (multnum[j][1] == 0)
			str2 = '<font color="blue">' + String(multnum[j][0]) + '</font>' + "&#215;" + String(y0);
		else 
			str2 ='<font color="red">' +  "(" +  String(multnum[j][0]-multnum[j][1]) + "+" + String(multnum[j][1]) + ")</font>&#215;" + String(y0);
		combinations[combCount] = [];
		combinations[combCount].push( str1  + "+" +  str2);
		while(x0 >= 3 && combinations[combCount].length < nComb){
			y0 += beta;
			x0 -= alpha;
			if (isUnlikely(x0) || isUnlikely(y0)) continue;
			if (multnum[i][1] == 0)
				str1 = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(x0);
			else 
				str1 ='<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(x0);
			if (multnum[j][1] == 0)
				str2 = '<font color="blue">' + String(multnum[j][0]) + '</font>' + "&#215;" + String(y0);
			else 
				str2 ='<font color="red">' +  "(" +  String(multnum[j][0]-multnum[j][1]) + "+" + String(multnum[j][1]) + ")</font>&#215;" + String(y0);
			combinations[combCount].push( str1  + "+" +  str2);
		}
		combCount++;
	}
	return "";
 }
 
 
 function strat3mult(multnum, diff){
	if (multnum.length < 3) return "";
	let checkBox = document.getElementById("myCheck");
	let three = new Array();
	let pn = 0;
	for (var i = 0; i < multnum.length; i++){
		for (var j = i+1; j < multnum.length; j++ ){
			for (var k = j+1; k < multnum.length; k++) {
				if (diff % nod3(multnum[i][0],multnum[j][0],multnum[k][0]) != 0) continue;
				three[pn] = [];
				three[pn][0] = multnum[i][0] + multnum[j][0]  + multnum[k][0];
				three[pn][1] = i;
				three[pn][2] = j;
				three[pn][3] = k;
				pn++;
			}
		}
	}
	if (three.length == 0) return "";
	three.sort(function(a, b) {
		return b[0] - a[0];
	});
	let str1, str2;
	for (pn = 0; pn < three.length; pn++){
		let i = three[pn][1];
		let j = three[pn][2];
		let k = three[pn][3];
		let mult1 = multnum[i][0];
		let mult2 = multnum[j][0];
		let mult3 = multnum[k][0];
		let base_x = Math.floor(diff / mult1);
		if (base_x < 3) continue;
		for (var x0 = base_x; x0 >= 3; x0--){
			if (checkBox.checked == true && isUnlikely(x0)) continue;
			let diff1 = diff - mult1*x0;
			let multnum1 = new Array();
			multnum1[0] = [];
			multnum1[0][0] = multnum[j][0];
			multnum1[0][1] = multnum[j][1];
			multnum1[1] = [];
			multnum1[1][0] = multnum[k][0];
			multnum1[1][1] = multnum[k][1];
			str2 = strat2mult(multnum1, diff1);
			if (str2 != ""){
				if (multnum[i][1] == 0)
					str1 = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(x0);
				else 
					str1 ='<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(x0);
				return str1  + "+" +  str2;
			}
		}
	}
	return "";
 }
function showstrat(){
	if (strat1 != "" || combinations.length > 0){
		let str = "";
		if (strat1 != ""){
			str += '<p>' + strat1 + '</p>';
		}
		if (combinations.length > 0){
			str += '<p>' + combinations[currComb][currSubComb] + '</p>';
		}
		document.getElementById("result").innerHTML = str;
		return;
	}
	document.getElementById("result").innerHTML = "Стратегия не найдена";
};

function gcd (x, y, s1=1, s2=0, t1=0, t2=1) {
	let q = Math.floor(x/y),
	s1copy = s1,
	t1copy = t1;
	return (x % y === 0) ? [y,s2,t2] : gcd(y, x%y, s1=s2, s2=s1copy-q*s2, t1=t2, t2=t1copy-q*t2);
}
 function nod2(a,b){
	if (!b) {
		return a;
	}
	return nod2(b, a % b);
 }

 function nod3(a,b,c){
	return nod2(nod2(a,b), c);
 }
 
function checkVB() {
  var checkbox=document.getElementById('videoCheck');
  if(checkbox.checked == true)
  {
	document.getElementById('videoBonus').value = videoBonus;
	document.getElementById('videoBlock').style.visibility='visible';
  }
  else{
  	document.getElementById('videoBlock').style.visibility='hidden';
  }
}
function setBonus() {
  videoBonus = parseInt(document.getElementById('videoBonus').value);
}

function downBonus(){
  let currVal = parseInt(document.getElementById('videoBonus').value) ;
  let minVal = parseInt(document.getElementById('videoBonus').min);
  if (currVal > minVal ) document.getElementById('videoBonus').value = currVal - 1;
  videoBonus = parseInt(document.getElementById('videoBonus').value);
}

function upBonus(){
  let currVal = parseInt(document.getElementById('videoBonus').value) ;
  let maxVal = parseInt(document.getElementById('videoBonus').max);
  if (currVal < maxVal ) document.getElementById('videoBonus').value = currVal + 1;
  videoBonus = parseInt(document.getElementById('videoBonus').value);
}
function copystrat() {
	var range = document.createRange();
	range.selectNode(document.getElementById("result"));
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	document.getElementById("cpy").disabled = true;
}

function setmulty(mode) {
	if (mode == 1) document.getElementById("mults").value = graalStr[curracc];
	else document.getElementById("mults").value = baseStr[curracc];
}


function clearmulty() {
	document.getElementById("mults").value = "";
}

function calcKZ(level){
	level = parseInt(level);
	if (level < 1) return 0;
	let baselevel;
	let add;
	let val; 
	let diff;
	if (level < 300){
		baselevel = 1;
		add = 110;
		val = 74999; 
		diff = 28758;
	}
	else {
		baselevel = 300;
		add = 136;
		val = 14744251; 
		diff = 69461;
	}
	if (level == baselevel) return val;
	for (lv = baselevel; lv < level; lv++){
		val += diff;
		diff += add;
	}
	return val;
}

function calcSafe(){
	level = parseInt(document.getElementById("level").value);
	if (isNaN(level) || level < 50){
		document.getElementById("code1").value = "Расчет невозможен";
		document.getElementById("code2").value = "Расчет невозможен";
		document.getElementById("code3").value = "Расчет невозможен";
		return;
	}
	let KZlevel = level-3;
	KZval = calcKZ(KZlevel);
	if (KZval == 0){
		document.getElementById("code1").value = "Расчет невозможен";
		document.getElementById("code2").value = "Расчет невозможен";
		document.getElementById("code3").value = "Расчет невозможен";
		return;
	}
	let loc_code_num;
	if (typeof code_num === 'undefined'){
		loc_code_num = 3;
	}
	else{
		if (parseInt(code_num[curracc]) >= 1 && parseInt(code_num[curracc]) <= 3)	loc_code_num = parseInt(code_num[curracc]);
		else loc_code_num = 3;
	}
	if (KZlevel <= 300){
		document.getElementById("code1").value = Math.floor(KZval*0.025);
		document.getElementById("code2").value = Math.floor(KZval*0.07);
		document.getElementById("code3").value = Math.floor(KZval*0.12);
	}
	else{
		document.getElementById("code1").value = Math.floor(KZval*0.025);
		document.getElementById("code2").value = Math.floor(KZval*0.06);
		document.getElementById("code3").value = Math.floor(KZval*0.1);
	}
	if (level <= 100)	videoBonus = 5;
	else if (level <= 150)	videoBonus = 6;
	else if (level <= 200)	videoBonus = 7;
	else if (level <= 300)	videoBonus = 9;
	else 					videoBonus = 12;
	document.getElementById('videoBonus').value = videoBonus;
	switch (loc_code_num) {
		case 1:
			document.getElementById("needval").value = document.getElementById("code1").value;
		break;
		case 2:
			document.getElementById("needval").value = document.getElementById("code2").value;
		break;
		case 3:
			document.getElementById("needval").value = document.getElementById("code3").value;
		break;
	}
}

function code_copy (code){
	if (parseInt(code) == 1) {
		if (!isNaN(parseInt(document.getElementById("code1").value)))
			document.getElementById("needval").value = parseInt(document.getElementById("code1").value);
	}
	if (parseInt(code) == 2) {
		if (!isNaN(parseInt(document.getElementById("code2").value)))
			document.getElementById("needval").value = parseInt(document.getElementById("code2").value);
	}
	if (parseInt(code) == 3) {
		if (!isNaN(parseInt(document.getElementById("code3").value)))
			document.getElementById("needval").value = parseInt(document.getElementById("code3").value);
	}
}
