# sunburst

For a given tree builds an SVG based SunBurst diagram.

See the demo images here: https://github.com/anvaka/sunburst/blob/master/demo/dom/README.md

# Usage

``` 
npm install sunburst
```

``` js
sunburst({
  // This is our tree. Just give it `children` array:
  children: [
    {children: [{}, {}, {}]},
    {children: [{}, {}]},
    {children: [{children: [{}, {}]}]}
  ]
}, {
  // Rendering configuration:
  wrap: true,  // wrap `path` into svg element, so it can be embedded
  stroke: 'white', // set spacing between individual items
}))
```

This will render a simple sunburst chart:

![demo](https://i.imgur.com/7DCnfpH.png)


# license

MIT
