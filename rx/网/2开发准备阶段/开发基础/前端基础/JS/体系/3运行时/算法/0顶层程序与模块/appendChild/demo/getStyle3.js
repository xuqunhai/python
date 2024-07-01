var i = 0
while(i<10000) {
  i++;
  console.log('getStyle3.js')
}

var element = document.getElementById('body');
var style = window.getComputedStyle(element);
console.log('Background color3:', style.backgroundColor);