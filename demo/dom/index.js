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
  console.log('Most common tags:\n', commonTags);
}

function getCommonTags(tree) {
  var counter = new Map();
  visit(tree);
  var flatCounts = Array.from(counter).sort(function(pairA, pairB) {
    // Sort in decreasing count order
    return pairB[1] - pairA[1];
  })
  .slice(0, 10) // take only top N
  .map(function(x) {
    // return in human readable format:
    return '\t' + x[0] + ' - ' + x[1] 
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