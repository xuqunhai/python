var i = 0
while(i<8000) {
  i++;
  console.log('getStyle.js')
}

var element = document.getElementById('body');
var style = window.getComputedStyle(element);
console.log('Background color1:', style.backgroundColor);