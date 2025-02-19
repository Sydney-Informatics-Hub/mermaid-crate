// found this via https://github.com/mermaid-js/mermaid/issues/2523

import { promises } from 'fs';
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import mermaid from 'mermaid';

// Define your Mermaid graph as a string
const mermaidGraph = `
graph TD;
  A-->B-->C
  A-->C
`;

async function l

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

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: -w WIDTH -o OUTPUT_PNG")
    .default('w', 1200)
    .default('o', 'poptimal.png').argv;

  const svg = poptimal_svg(argv.w);
  const opts = {
      background: 'rgba(255, 255, 255, 1.0)',
      fitTo: {
          mode: 'width',
          value: argv.w,
      },
    };
    const resvg = new Resvg(svg, opts)
  const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    await promises.writeFile(argv.o, pngBuffer);
}



main();