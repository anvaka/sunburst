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
})
```

This will render a simple sunburst chart:

![demo](https://i.imgur.com/7DCnfpH.png)

## Influence the segment size

By default segment size is determined by the number of children, so it can
neatly fit the items in the graph. If you want to visualize something like a
filesystem, which has hierarchy and individual weight, you can set a `weight`
property on each leaf node to influence the percentage.

For instance, the above example could be rewritten using `weight`:

``` js
sunburst({
  // This is our tree. Just give it `children` array:
  children: [
    {weight: 3, children: [{ weight: 1 }, { weight: 1 }, { weight: 1 }]},
    {weight: 2, children: [{ weight: 1 }, { weight: 1 }]},
    {weight: 3, children: [{ weight: 1,  children: [{ weight: 1 }, { weight: 1 }]}]}
  ]
}, {
  // Rendering configuration:
  wrap: true,  // wrap `path` into svg element, so it can be embedded
  stroke: 'white', // set spacing between individual items
})
```


# license

MIT
