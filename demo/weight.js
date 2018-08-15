var makeSunburst = require('../index');
console.log(
makeSunburst({
  // This is our tree. Just give it `children` array:
  children: [
    {weight: 200, children: [{ weight: 100 }, { weight: 100 }]},
    {weight: 50, children: [{ weight: 50 }]},
    {weight: 20, children: [{ weight: 5 }, { weight: 15 }]},
  ]
}, {
  // wrap `path` into svg element, so it can be embedded:
  wrap: true,
  stroke: 'white',
  initialRadius: 50,
}))
