var currDate = new Date();
var diffDays;
var curracc = 0;

function diffDates() {
    return (currDate - begDate) / (60 * 60 * 24 * 1000);
};

function onclick(e){
    curracc = parseInt(e.target.value);
}

function Init(preInit = false){
	if (preInit && isAutoLevel){
		diffDays = parseInt(diffDates());
		document.getElementById("level").value = range+diffDays*3;
		calcSafe();
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
	 let str1 = strat1mult(multnum, diff);
	 let str2 = strat2mult(multnum, diff);
	 let str = "";
	 if (str1 != ""){
		str += '<p>' + str1 + '</p>';
	 }
	 if (str2 != ""){
		str += '<p>' + str2 + '</p>';
	 }
	 if (str != ""){
		document.getElementById("result").innerHTML = str;
		document.getElementById("cpy").disabled = false;
		return;
	 }
	 else {
		str = strat3mult(multnum, diff);
		 if (str != ""){
			document.getElementById("result").innerHTML = str;
			document.getElementById("cpy").disabled = false;
			return;
		 }
	 }
	 document.getElementById("result").innerHTML = "Стратегия не найдена";
  }
 function strat1mult(multnum, diff){
	 let checkBox = document.getElementById("myCheck");
	 for (var i = 0; i < multnum.length; i++){
		let up = Math.floor(diff/multnum[i][0]);
		let rest = diff%multnum[i][0];
		if (up < 3) continue;
		if (checkBox.checked == true && (up == 4 || up == 5 || up == 7 || up == 8 || up == 11 || up == 14 || up == 17)) continue;
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
			while (y0 == 4 || y0 == 5 || y0 == 7 || y0 == 8 || y0 == 11 || y0 == 14 || y0 == 17){
				y0 += beta;
				x0 -= alpha;
			}
		}
		if (x0 < 3) continue;
		if (checkBox.checked == true && (x0 == 4 || x0 == 5 || x0 == 7 || x0 == 8 || x0 == 11 || x0 == 14 || x0 == 17)) continue;
		if (multnum[i][1] == 0)
			str1 = '<font color="blue">' + String(multnum[i][0]) + '</font>' + "&#215;" + String(x0);
		else 
			str1 ='<font color="red">' +  "(" + String(multnum[i][0]-multnum[i][1]) + "+" + String(multnum[i][1]) + ")</font>&#215;" + String(x0);
		if (multnum[j][1] == 0)
			str2 = '<font color="blue">' + String(multnum[j][0]) + '</font>' + "&#215;" + String(y0);
		else 
			str2 ='<font color="red">' +  "(" +  String(multnum[j][0]-multnum[j][1]) + "+" + String(multnum[j][1]) + ")</font>&#215;" + String(y0);
		return str1  + "+" +  str2;
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
			if (checkBox.checked == true && (x0 == 4 || x0 == 5 || x0 == 7 || x0 == 8 || x0 == 11 || x0 == 14 || x0 == 17)) continue;
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
	if (level < 1 || (level < 410 && level > 299)) return 0;
	if (level <= 299){
		if (level == 1) return 74999;
		let diff = level - 1;
		return calcKZ(level-1) + 28648+ 110*diff;
	}
	else{
		base = 22947834;
		if (level == 410) return base;
		diff = 83877;
		add = 136;
		for (lv = 410; lv < level; lv++){
			diff += add;
			base += diff;
		}
	}
	return base;
}

function calcSafe(){
	level = parseInt(document.getElementById("level").value);
	if (isNaN(level) || level < 410){
		if (level > 299){
			document.getElementById("code1").value = "Расчет невозможен";
			document.getElementById("code2").value = "Расчет невозможен";
			document.getElementById("code3").value = "Расчет невозможен";
		return;
		}
		else{
			level = level - 3;
			KZval = calcKZ(level);
			document.getElementById("code1").value = Math.floor(KZval*0.025);
			document.getElementById("code2").value = Math.floor(KZval*0.07);
			document.getElementById("code3").value = Math.floor(KZval*0.12);
			return;
		}
	}
	KZval = calcKZ(level);
	document.getElementById("code1").value = Math.floor(KZval*0.025);
	document.getElementById("code2").value = Math.floor(KZval*0.06);
	document.getElementById("code3").value = Math.floor(KZval*0.1);
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
