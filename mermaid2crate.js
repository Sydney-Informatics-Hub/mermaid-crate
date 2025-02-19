// found this via https://github.com/mermaid-js/mermaid/issues/2523

import { promises } from 'fs';
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import mermaid from 'mermaid';
import { ROCrate} from 'ro-crate';

mermaid.initialize({
  startOnLoad: false,
});


async function mermaid2jsonld(mermaidGraph) {


  const parser = (
    await mermaid.mermaidAPI.getDiagramFromText(mermaidGraph)
  ).getParser().yy;

  const crate = new ROCrate();

  const vertices = parser.getVertices();

  for( const node of vertices ) {
    crate.addEntity({
      '@id': node.domId, 
      '@type': node.type,
      'name': node.id,
      'description': node.label,
    });
  }
  return crate;
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: -i graph.mermaid").argv;

    const mermaidGraph = await promises.readFile(argv.i);
    const crate = await mermaid2jsonld(mermaidGraph.toString());
    //console.log(JSON.stringify(crate, null, 2));
}



main();