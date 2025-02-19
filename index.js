// found this via https://github.com/mermaid-js/mermaid/issues/2523

/
import mermaid from 'mermaid';

// Define your Mermaid graph as a string
const mermaidGraph = `
graph TD;
  A-->B-->C
  A-->C
`;

// Configure Mermaid to use the desired settings
mermaid.initialize({
  startOnLoad: false,
});

const parser = (
  await mermaid.mermaidAPI.getDiagramFromText(mermaidGraph)
).getParser().yy;


const vertices = parser.getVertices();
const edges = parser.getEdges();


console.log(vertices);
console.log(edges);

