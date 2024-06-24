
var script = document.createElement('script')
script.src = './3.js'
document.head.appendChild(script)

var i = 0
while(i<10000) {
  i++;
  console.log('2.js')
}