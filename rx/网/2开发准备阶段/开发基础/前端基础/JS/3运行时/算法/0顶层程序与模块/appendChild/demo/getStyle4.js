var i = 0
while(i<11000) {
  i++;
  console.log('getStyle4.js')
}

var element = document.getElementById('body');
var style = window.getComputedStyle(element);
console.log('Background color4:', style.backgroundColor);