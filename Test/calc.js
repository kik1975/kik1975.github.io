var HourCorrection = 3;
var currDate = new Date();
currDate.setHours(currDate.getHours()-HourCorrection);
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
var strat1arr = [];
var strat2arr = [];
var strat3arr = [];
var arrcomb1 = 0;
var arrcomb2 = [0,0];
var arrcomb3 = 0;

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
	if (stratcalced) showstrat();
};

function onclick(e){
	var newacc =  parseInt(e.target.value);
	if (curracc != newacc){
		document.getElementById("mults").value = "";
		document.getElementById("currval").value = "0";
	}
    curracc = newacc;
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
	document.getElementById('videoBonus').value = videoBonus;
	document.getElementById("needval").value = "";
	if (isAutoLevel[curracc]){
		diffDays = parseInt(diffDates());
		document.getElementById("level").value = range[curracc]+diffDays*3;
		calcSafe(0);
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
	document.getElementById("result").innerHTML = "";
     let enableCopy = false;
		currComb = 0;
		currSubComb  = 0;
	arrcomb1 = 0;
	arrcomb2 = [0,0];
	arrcomb3 = 0;
	if (isNaN(parseInt(document.getElementById('currval').value))){
	     document.getElementById("result").innerHTML = "Отсутствуют текущие очки";
    	 return;
	}
     let start = parseInt(document.getElementById("currval").value);
	if (isNaN(parseInt(document.getElementById('needval').value))){
	     document.getElementById("result").innerHTML = "Отсутствует цель";
    	 return;
	}
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
	 let strat3 = strat3mult(multnum, diff);
	 if (strat1 == "" && combinations.length == 0){
		strat1 = strat3;
	 }
	 altComb();
	 stratcalced = true;
	 show_strats();
  }
 function strat1mult(multnum, diff){
	 let checkBox = document.getElementById("myCheck");
	 let j = 0;
	 strat1arr = [];
	 for (var i = 0; i < multnum.length; i++){
		let up = Math.floor(diff/multnum[i][0]);
		let rest = diff%multnum[i][0];
		if (up < 3) continue;
		if (checkBox.checked == true && isUnlikely(up)) continue;
		if(rest == 0){
			let newStrat = new Object();
			if (multnum[i][1] == 0){
				newStrat.strat = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(up);
			}
			else{
				newStrat.strat = '<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(up);
			}
			newStrat.count = up;
			strat1arr.push(newStrat);
			j++;
		}
	}
	if (j > 0) strat1arr.sort(function(a, b){
									return a.count-b.count;
								});
	if (j > 0) return strat1arr[0].strat;
	else return "";
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
	strat2arr = [];
	for (pn = 0; pn < pair.length; pn++){
		if (combCount == nComb) break;
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
		strat2arr[combCount] = [];
		let counter = 0;
		combinations[combCount].push( str1  + "+" +  str2);
		let newStrat = new Object();
		newStrat.strat = str1  + "+" +  str2;
		newStrat.count = x0+y0;
		strat2arr[combCount].push(newStrat);
		counter++;
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
			newStrat = new Object();
			newStrat.strat = str1  + "+" +  str2;
			newStrat.count = x0+y0;
			strat2arr[combCount].push(newStrat);
			counter++;
		}
		combCount++;
	}
	if (combCount > 0){
		for (var cc = 0; cc < combCount; cc++){
			strat2arr[cc].sort(function(a, b){
							return a.count-b.count;
			});
		}
		strat2arr.sort(function(a, b){
						return a[0].count-b[0].count;
		});
	}
	if (combCount > 0) return combinations[0];
	return "";
 }


function strat2mult_light(multnum, diff){
	let checkBox = document.getElementById("myCheck");
	let pair = new Array();
	let pn = 0;
	let res_obj = {};
	res_obj.count = 0;
	res_obj.strat = "";
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
	for (pn = 0; pn < pair.length; pn++){
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
		res_obj.strat = str1  + "+" +  str2;
		res_obj.count = x0+y0;
		break;
	}
	return res_obj;
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
	strat3arr = [];
	let counter = 0;
	for (pn = 0; pn < three.length; pn++){
		if (counter  >= nComb) break;
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
			let res_obj = {};
			res_obj = strat2mult_light(multnum1, diff1);
			if (res_obj.count > 0){
				if (multnum[i][1] == 0)
					str1 = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(x0);
				else 
					str1 ='<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(x0);
				let newStrat = new Object();;
				newStrat.strat = str1  + "+" +  res_obj.strat;
				newStrat.count = x0  + res_obj.count;
				strat3arr.push(newStrat);
				counter ++;
				break;
			}
		}
	}
	if (counter > 0) strat3arr.sort(function(a, b){
									return a.count-b.count;
								});
	if (counter > 0) return strat3arr[0].strat;
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
		return;
	}
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
  clear_strats();
}
function setBonus() {
  videoBonus = parseInt(document.getElementById('videoBonus').value);
}

function downBonus(){
  let currVal = parseInt(document.getElementById('videoBonus').value) ;
  let minVal = parseInt(document.getElementById('videoBonus').min);
  if (currVal > minVal ) document.getElementById('videoBonus').value = currVal - 1;
  videoBonus = parseInt(document.getElementById('videoBonus').value);
  clear_strats();
}

function upBonus(){
  let currVal = parseInt(document.getElementById('videoBonus').value) ;
  let maxVal = parseInt(document.getElementById('videoBonus').max);
  if (currVal < maxVal ) document.getElementById('videoBonus').value = currVal + 1;
  videoBonus = parseInt(document.getElementById('videoBonus').value);
  clear_strats();
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
	clear_strats();
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

function calcSafe(corr){
	level = parseInt(document.getElementById("level").value);
	clear_strats();
	if (isNaN(level) || level < 50){
		document.getElementById("code1").value = "Расчет невозможен";
		document.getElementById("code2").value = "Расчет невозможен";
		document.getElementById("code3").value = "Расчет невозможен";
		return;
	}
	level = level + parseInt(corr);
	document.getElementById("level").value = String(level);
	if (level < 50){
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
	clear_strats();
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

function zero_currval(){
	document.getElementById("currval").value = "0";
	clear_strats();
}
function clear_currval(){
	document.getElementById("currval").value = "";
	clear_strats();
	var target = document.getElementById("currval");
	if (event.target != target) {
		target.focus();
		target.click();
	}
}
function clear_needval(){
	document.getElementById("needval").value = "";
	clear_strats();
	var target = document.getElementById("needval");
	if (event.target != target) {
		target.focus();
		target.click();
	}
}
function clear_mults(){
	document.getElementById("mults").value = "";
	clear_strats();
}

function clear_strats(){
	strat1arr = [];
	strat2arr = [];
	strat3arr = [];
	stratcalced = false;
	arrcomb1 = 0;
	arrcomb2 = [0,0];
	arrcomb3 = 0;
	show_strats();
}

function show_strats(){
	if (strat1arr.length == 0){
		document.getElementById("mult1").innerHTML = stratcalced ? "Вариантов нет" : "";
		arrcomb1 = 0;
		document.getElementById("m1up").disabled = true;
		document.getElementById("m1down").disabled = true;
	} else if (strat1arr.length == 1){
		document.getElementById("mult1").innerHTML = strat1arr[0].strat;
		arrcomb1 = 0;
		document.getElementById("m1up").disabled = true;
		document.getElementById("m1down").disabled = true;
	} else {
		if (arrcomb1 < 0 || arrcomb1 >= strat1arr.length){
			document.getElementById("mult1").innerHTML = strat1arr[0].strat;
			arrcomb1 = 0;
			document.getElementById("m1up").disabled = false;
			document.getElementById("m1down").disabled = true;
		}
		else{
			document.getElementById("mult1").innerHTML = strat1arr[arrcomb1].strat;
			document.getElementById("m1up").disabled = arrcomb1 < strat1arr.length-1 ? false : true;
			document.getElementById("m1down").disabled = arrcomb1 > 0 ? false : true;
		}
	}
	if (strat3arr.length == 0){
		document.getElementById("mult3").innerHTML = stratcalced ? "Вариантов нет" : "";
		arrcomb3 = 0;
		document.getElementById("m3up").disabled = true;
		document.getElementById("m3down").disabled = true;
	} else if (strat3arr.length == 1){
		document.getElementById("mult3").innerHTML = strat3arr[0].strat;
		arrcomb3 = 0;
		document.getElementById("m3up").disabled = true;
		document.getElementById("m3down").disabled = true;
	} else {
		if (arrcomb3 < 0 || arrcomb3 >= strat3arr.length){
			document.getElementById("mult3").innerHTML = strat3arr[0].strat;
			arrcomb3 = 0;
			document.getElementById("m3up").disabled = false;
			document.getElementById("m3down").disabled = true;
		}
		else{
			document.getElementById("mult3").innerHTML = strat3arr[arrcomb3].strat;
			document.getElementById("m3up").disabled = arrcomb3 < strat3arr.length-1 ? false : true;
			document.getElementById("m3down").disabled = arrcomb3 > 0 ? false : true;
		}
	}
	if (strat2arr.length == 0){
		document.getElementById("mult2").innerHTML = stratcalced ? "Вариантов нет" : "";
		arrcomb2 = [0,0];
		document.getElementById("m2up").disabled = true;
		document.getElementById("m2down").disabled = true;
		document.getElementById("m2left").disabled = true;
		document.getElementById("m2right").disabled = true;
	} else if (strat2arr.length == 1){
		arrcomb2[0] = 0;
		document.getElementById("m2up").disabled = true;
		document.getElementById("m2down").disabled = true;
		if (strat2arr[0].length == 0){
			document.getElementById("mult2").innerHTML = stratcalced ? "Вариантов нет" : "";
			arrcomb2 = [0,0];
			document.getElementById("m2left").disabled = true;
			document.getElementById("m2right").disabled = true;
		} else if (strat2arr[0].length == 1){
			document.getElementById("mult2").innerHTML = strat2arr[0][0].strat;
			arrcomb2 = [0,0];
			document.getElementById("m2left").disabled = true;
			document.getElementById("m2right").disabled = true;
		} else if (arrcomb2[1] < 0 || arrcomb2[1] >= strat2arr[0].length){
			document.getElementById("mult2").innerHTML = strat2arr[0][0].strat;
			arrcomb2[1] = 0;
			document.getElementById("m2right").disabled = false;
			document.getElementById("m2left").disabled = true;
		} else{
			document.getElementById("mult2").innerHTML = strat2arr[0][arrcomb2[1]].strat;
			document.getElementById("m2right").disabled = arrcomb2[1] < strat2arr[0].length-1 ? false : true;
			document.getElementById("m2left").disabled = arrcomb2[1] > 0 ? false : true;
		}
	} else {
		if (arrcomb2[0] < 0 || arrcomb2[0] >= strat2arr.length){
			arrcomb2[0] = 0;
			document.getElementById("m2up").disabled = false;
			document.getElementById("m2down").disabled = true;
			if (strat2arr[0].length == 0){
				document.getElementById("mult2").innerHTML = stratcalced ? "Вариантов нет" : "";
				arrcomb2 = [0,0];
				document.getElementById("m2up").disabled = true;
				document.getElementById("m2left").disabled = true;
				document.getElementById("m2right").disabled = true;
			} else if (strat2arr[0].length == 1){
				document.getElementById("mult2").innerHTML = strat2arr[0][0].strat;
				arrcomb2 = [0,0];
				document.getElementById("m2left").disabled = true;
				document.getElementById("m2right").disabled = true;
			} else if (arrcomb2[1] < 0 || arrcomb2[1] >= strat2arr[0].length){
				document.getElementById("mult2").innerHTML = strat2arr[0][0].strat;
				arrcomb2[1] = 0;
				document.getElementById("m2right").disabled = false;
				document.getElementById("m2left").disabled = true;
			} else{
				document.getElementById("mult2").innerHTML = strat2arr[0][arrcomb2[1]].strat;
				document.getElementById("m2right").disabled = arrcomb2[1] < strat2arr[0].length-1 ? false : true;
				document.getElementById("m2left").disabled = arrcomb2[1] > 0 ? false : true;
			}
		}
		else{
			document.getElementById("m2up").disabled = arrcomb2[0] < strat3arr.length-1 ? false : true;
			document.getElementById("m2down").disabled = arrcomb2[0] > 0 ? false : true;
			if (strat2arr[arrcomb2[0]].length == 0){
				document.getElementById("mult2").innerHTML = stratcalced ? "Вариантов нет" : "";
				arrcomb2[1] = 0;
				document.getElementById("m2left").disabled = true;
				document.getElementById("m2right").disabled = true;
			} else if (strat2arr[arrcomb2[0]].length == 1){
				document.getElementById("mult2").innerHTML = strat2arr[arrcomb2[0]][0].strat;
				arrcomb2[1] = 0;
				document.getElementById("m2left").disabled = true;
				document.getElementById("m2right").disabled = true;
			} else if (arrcomb2[1] < 0 || arrcomb2[1] >= strat2arr[arrcomb2[0]].length){
				document.getElementById("mult2").innerHTML = strat2arr[arrcomb2[0]][0].strat;
				arrcomb2[1] = 0;
				document.getElementById("m2right").disabled = false;
				document.getElementById("m2left").disabled = true;
			} else{
				document.getElementById("mult2").innerHTML = strat2arr[arrcomb2[0]][arrcomb2[1]].strat;
				document.getElementById("m2right").disabled = arrcomb2[1] < strat2arr[arrcomb2[0]].length-1 ? false : true;
				document.getElementById("m2left").disabled = arrcomb2[1] > 0 ? false : true;
			}
		}
	}
}
function change_strat(but){
switch (but) {
	case 1:
		if (arrcomb1 < strat1arr.length-1){
			arrcomb1++;
			show_strats();
		}
	break;
	case 2:
		if (arrcomb1 > 0){
			arrcomb1--;
			show_strats();
		}
	break;
	case 3:
		if (arrcomb2[0] < strat2arr.length-1){
			arrcomb2[0]++;
			arrcomb2[1] = 0;
			show_strats();
		}
	break;
	case 4:
		if (arrcomb2[0] > 0){
			arrcomb2[0]--;
			arrcomb2[1] = 0;
			show_strats();
		}
	break;
	case 6:
		if (arrcomb2[1] < strat2arr[arrcomb2[0]].length-1){
			arrcomb2[1]++;
			show_strats();
		}
	break;
	case 5:
		if (arrcomb2[1] > 0){
			arrcomb2[1]--;
			show_strats();
		}
	break;
	case 7:
		if (arrcomb3 < strat3arr.length-1){
			arrcomb3++;
			show_strats();
		}
	break;
	case 8:
		if (arrcomb3 > 0){
			arrcomb3--;
			show_strats();
		}
	break;
}
}
