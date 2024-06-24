
var script = document.createElement('script')
script.src = './a.js'
document.body.appendChild(script)

var script1 = document.createElement('script')
script1.src = './b.js'
document.body.appendChild(script1)

var script2 = document.createElement('script')
script2.src = './c.js'
document.body.appendChild(script2)

var script3 = document.createElement('script')
script3.src = './d.js'
document.body.appendChild(script3)

var script4 = document.createElement('script')
script4.src = './e.js'
document.body.appendChild(script4)

var script5 = document.createElement('script')
script5.src = './f.js'
document.body.appendChild(script5)

var script6 = document.createElement('script')
script6.src = './g.js'
document.body.appendChild(script6)

var script7 = document.createElement('script')
script7.src = './h.js'
document.body.appendChild(script7)

var script8 = document.createElement('script')
script8.src = './i.js'
document.body.appendChild(script8)

var i = 0
while(i<10000) {
  i++;
  console.log('22.js')
}

const element = document.getElementById('body');
const style = window.getComputedStyle(element);
console.log('Background color22:', style.backgroundColor);