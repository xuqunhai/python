var i = 0
while(i<12000) {
  i++;
  console.log('getStyle5.js')
}

var element = document.getElementById('body');
var style = window.getComputedStyle(element);
console.log('Background color5:', style.backgroundColor);