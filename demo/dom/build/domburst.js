(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/**
 * This script builds a sunburst chart for any page in your browser.
 */
var makeChart = require('../../index');

// How we should render each tag
var colors = {
  a: '#f2ad52',
  li: '#e99e9b',
  ul: '#e99e9b',
  ol: '#e99e9b',
  div: '#ed684c',
  img: '#c03657',
  span: '#642b1c',
  tr: '#132a4e',
  table: '#132a4e',
  tbody: '#132a4e',
  td: '#132a4e',
  p: '#1164e6'
};
// All other tags:
var defaultColor = '#a8a8a8';

var tree = makeTree(document.body);
var svg = makeChart(tree, {
  wrap: true
});

render(svg);
printStats(tree);

function render(svg) {
  document.body.innerHTML = svg;
  var svgEl = document.body.querySelector('svg');
  svgEl.style.width = '100%';
  svgEl.style.height = '100%';
  svgEl.style.position = 'absolute';
  svgEl.style.top = '0';
  svgEl.style.left = '0';
}

function printStats(tree) {
  var maxDepth = getMaxDepth(tree);
  var commonTags = getCommonTags(tree);
  console.log('%cSunburst statistics: ', 'font-size: 42px');
  console.log('Max tree depth: ', maxDepth);
  console.log('Total tags: ', tree.leaves);
  console.log('Most common tags: ', commonTags);
}

function getCommonTags(tree) {
  var counter = new Map();
  visit(tree);
  var flatCounts = Array.from(counter).sort(function(pairA, pairB) {
    // Sort in decreasing count order
    return pairB[1] - pairA[1];
  })
  .slice(0, 5) // take only top N
  .map(function(x) {
    // return in human readable format:
    return x[0] + ' - ' + x[1] 
  })
  .join('\n');

  return flatCounts;

  function visit(tree) {
    if (tree.tagName) {
      counter.set(tree.tagName,(counter.get(tree.tagName) || 0) + 1);
    }
    if (tree.children) {
      tree.children.forEach(visit);
    }
  }
}

function getMaxDepth(tree) {
  var maxDepth = 0;

  visit(tree, 0);

  return maxDepth;

  function visit(tree, currentDepth) {
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    if (tree.children) {
      tree.children.forEach(function(child) {
        visit(child, currentDepth + 1);
      });
    }
  }
}

function makeTree(root) {

  var tree = visit(root);
  tree.label = window.location.host;
  return tree;
  
  function visit(node) {
    var children = [];
    for (var i = 0; i < node.children.length; ++i) {
      children.push(visit(node.children[i]));
    }
    return { 
      color: getColor(node),
      tagName: node.tagName,
      children: children.length && children 
    }
  }

  function getColor(node) {
    var tagName = node.tagName.toLowerCase();
    return colors[tagName] || defaultColor;
  }
}
},{"../../index":2}],2:[function(require,module,exports){
/**
 * Copyright 2018 Andrei Kashcha (http://github.com/anvaka)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
module.exports = getSunBurstPath;

/**
 * For a given tree, builds SVG path that renders SunBurst
 * diagram
 *
 * @param {Object} tree - a regular javascript object with single
 * property: tree.children - array of tree-children.
 *
 * @param {Object} options - see below.
 */
function getSunBurstPath(tree, options) {
  // TODO: Validate options
  options = options || {};

  // Radius of the inner circle.
  var initialRadius = getNumber(options.initialRadius, 100);
  // width of a single level
  var levelStep = getNumber(options.levelStep, 10);
  // Array of colors. Applied only on the top level.
  var colors = options.colors;
  if (!colors) colors = ['#f2ad52', '#e99e9b', '#ed684c', '#c03657', '#642b1c', '#132a4e'];

  // Initial rotation of the circle in radians.
  var startAngle = getNumber(options.startAngle, 0);

  var wrap = options.wrap;
  var stroke = options.stroke;
  var strokeWidth = options.strokeWidth;
  var beforeArcClose = options.beforeArcClose;
  var beforeLabelClose = options.beforeLabelClose;

  // Below is implementation.
  countLeaves(tree);

  var svgElements = [];
  var defs = [];
  svgElements.push(circle(initialRadius));
  if (tree.label) {
    svgElements.push('<text text-anchor="middle" class="center-text" y="8">' + tree.label + '</text>');
  }

  var path = '0';
  tree.path = path; // TODO: Don't really need to do this?

  drawChildren(startAngle, Math.PI * 2 + startAngle, tree);

  var sunBurstPaths = svgElements.join('\n');

  if (wrap) {
    return wrapIntoSVG(sunBurstPaths);
  }

  return sunBurstPaths;

  function wrapIntoSVG(paths) {
    var depth = getDepth(tree, 0);
    var min = depth * levelStep + initialRadius;
    var markup = '<svg viewBox="' + [-min, -min, min * 2, min * 2].join(' ') + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    if (defs.length) {
      markup += '<defs>' + defs.join('\n') + '</defs>';
    }
    markup += '<g id="scene">' + paths + '</g>' + '</svg>';
    return markup;
  }

  function drawChildren(startAngle, endAngle, tree) {
    if (!tree.children) return;

    var level = tree.path.split(':').length - 1; // TODO: need a better structure to store path?
    var arcLength = Math.abs(startAngle - endAngle);
    var totalLeaves = 0;
    // In first pass, we get a sense of distribution of arc lengths at this level
    tree.children.forEach(function(child) {
      if (child.startAngle === undefined && child.endAngle === undefined) {
        totalLeaves += child.leaves;
      }
    });

    tree.children.forEach(function (child, i) {
      var endAngle, thisStartAngle;
      if (child.startAngle === undefined && child.endAngle === undefined) {
        thisStartAngle = startAngle;
        endAngle = startAngle + arcLength * child.leaves / totalLeaves;
        startAngle = endAngle;
      } else {
        thisStartAngle = child.startAngle;
        endAngle = child.endAngle;
        // TODO: What should I do with elements that are based on leaves?
      }

      child.path = tree.path + ':' + i;

      if (thisStartAngle !== endAngle) {
        var arcPath = pieSlice(initialRadius + level * levelStep, levelStep, thisStartAngle, endAngle);
        svgElements.push(arc(arcPath, child, i));

        if (child.label) {
          drawLabel(child, thisStartAngle, endAngle, level);
        }
      }

      drawChildren(thisStartAngle, endAngle, child);
    });

  }

  function drawLabel(child, thisStartAngle, endAngle, level) {
    var key = child.path.replace(/:/g, '_');
          
    var textPath = 0 < thisStartAngle && thisStartAngle < Math.PI ? 
      arcSegment(
        initialRadius + (level  + 0.5)* levelStep,
        endAngle, thisStartAngle,
        0
      ) :
      arcSegment(
        initialRadius + (level  + 0.5)* levelStep,
        thisStartAngle, endAngle,
        1
      );

    var pathMarkup = '<path d="' + textPath.d + '" id="' + key + '"></path>';
    defs.push(pathMarkup)

    var customAttributes = beforeLabelClose && beforeLabelClose(child);
    var textAttributes = (customAttributes && convertToAttributes(customAttributes.text)) || '';
    var textPathAttributes = (customAttributes && convertToAttributes(customAttributes.textPath)) || '';
    var labelSVGContent = '<text class="label" ' + textAttributes + '>';
    labelSVGContent += '<textPath startOffset="50%" text-anchor="middle" xlink:href="#' + 
      key + '" ' + textPathAttributes + '>' + child.label + '</textPath></text>'
    svgElements.push(labelSVGContent);
  }

  function getColor(element) {
    if (element.color) return element.color;

    var path = element.path.split(':'); // yeah, that's bad. Need a better structure. Array maybe?

    return colors[path[1] % colors.length];
  }

  function arc(pathData, child, i) {
    var color = getColor(child, i);
    var pathMarkup = '<path d="' + pathData + '" fill="' + color + '" data-path="' + child.path + '" ';

    if (stroke) {
      pathMarkup += ' stroke="' + stroke +'" ';
    }

    if (strokeWidth) {
      pathMarkup += ' stroke-width="' + strokeWidth + '" ';
    }
    if (beforeArcClose) {
      pathMarkup += convertToAttributes(beforeArcClose(child));
    }

    pathMarkup += '></path>'


    return pathMarkup;
  }
}

function convertToAttributes(obj) {
  if (!obj) return '';
  var bagOfAttributes = [];

  Object.keys(obj).forEach(function(key) {
    bagOfAttributes.push(key + '="' + obj[key] + '"');

  });
  return bagOfAttributes.join(' ');
}

function polarToCartesian(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

function arcSegment(radius, startAngle, endAngle, forward) {
  var cx = 0;
  var cy = 0;

  forward = forward ? 1 : 0;
  var start = polarToCartesian(cx, cy, radius, startAngle);
  var end = polarToCartesian(cx, cy, radius, endAngle);
  var da = Math.abs(startAngle - endAngle);
  var flip = da > Math.PI ? 1 : 0;
  var d = ["M", start.x, start.y, "A", radius, radius, 0, flip, forward, end.x, end.y].join(" ");

  return {
    d: d,
    start: start,
    end: end
  };
}

function pieSlice(r, width, startAngle, endAngle) {
  var inner = arcSegment(r, startAngle, endAngle, 1);
  var out = arcSegment(r + width, endAngle, startAngle, 0);
  return inner.d + 'L' + out.start.x + ' ' + out.start.y + out.d + 'L' + inner.start.x + ' ' + inner.start.y;
}

function circle(r) {
  // TODO: Don't hard-code fill?
  return '<circle r=' + r + ' cx=0 cy=0 fill="#fafafa" data-path="0"></circle>';
}

function countLeaves(treeNode) {
  if (treeNode.leaves) return treeNode.leaves;

  var leaves = 0;
  if (treeNode.children) {
    treeNode.children.forEach(function (child) {
      leaves += countLeaves(child);
    });
  } else {
    leaves = 1;
  }
  treeNode.leaves = leaves;
  return leaves;
}

function getDepth(tree) {
  var maxDepth = 0;

  visit(tree, 0);

  return maxDepth;


  function visit(tree, depth) {
    if (tree.children) {
      tree.children.forEach(function(child) {
        visit(child, depth + 1);
      });
    }
    if (depth > maxDepth) maxDepth = depth;
  }
}

function getNumber(x, defaultNumber) {
  return Number.isFinite(x) ? x : defaultNumber;
}

},{}]},{},[1]);
