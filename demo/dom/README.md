# Sunburst from a DOM Tree

Each website has a [DOM Tree](https://en.wikipedia.org/wiki/Document_Object_Model).

![dom demo](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/DOM-model.svg/440px-DOM-model.svg.png)

I thought it would be interesting to see it as a sunburst diagram. 

# Examples

[![reddit](https://i.imgur.com/7SZnSTvl.png)](https://i.imgur.com/7SZnSTv.png)
[![google](https://i.imgur.com/r7Lqk3Nl.png)](https://i.imgur.com/r7Lqk3N.png)
[![facebook](https://i.imgur.com/mv7hKH8l.png)](https://i.imgur.com/mv7hKH8.png)
[![YouTube](https://i.imgur.com/LtkOFUMl.png)](https://i.imgur.com/LtkOFUM.png)
[![Amazon](https://i.imgur.com/cdBiRVzl.png)](https://i.imgur.com/cdBiRVz.png)
[![Twitter](https://i.imgur.com/13muK56l.png)](https://i.imgur.com/13muK56.png)

# How to make your own snapshot?

Step 1. Copy content of [domburst.js](https://raw.githubusercontent.com/anvaka/sunburst/master/demo/dom/build/domburst.js).

Step 2. Open any website and open Google Chrome developer tools ([how?](https://stackoverflow.com/a/66434/125351))

Step 3. Paste content into the console, and press Enter. The chart should appear.

[![demo](https://i.imgur.com/uXpfDVq.gif)](https://i.imgur.com/NPFZwgU.gif)

## Security Note

In the .gif above, Facebook warns you from copy-pasting content. That is a good advice
to follow. 

In this particular case, the script doesn't access your cookies, neither does
it send your data anywhere.

If you are familiar with JavaScript, please feel free to [verify this](https://raw.githubusercontent.com/anvaka/sunburst/master/demo/dom/build/domburst.js)
 - the entire program is ~400 lines of code, and I hope, should be straightforward to follow.