var i = 0
while(i<9000) {
  i++;
  console.log('getStyle2.js')
}

var element = document.getElementById('body');
var style = window.getComputedStyle(element);
console.log('Background color2:', style.backgroundColor);