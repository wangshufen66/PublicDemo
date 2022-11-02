// (function () {
//   var a = (b = 3);
// })();
// console.log(b);
// console.log(a);

for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}

for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}


var arr1=['a',1,3];
let arg=[...arr1].slice(1);
console.log(arg);