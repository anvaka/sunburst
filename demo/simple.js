var makeSunburst = require('../index');
console.log(
makeSunburst({
  // This is our tree. Just give it `children` array:
  children: [
    {children: [{}, {}, {}]},
    {children: [{}, {}]},
    {children: [{children: [{}, {}]}]}
  ]
}, {
  // wrap `path` into svg element, so it can be embedded:
  wrap: true,
  stroke: 'white'
}))