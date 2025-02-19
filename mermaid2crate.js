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

  // dig into mermaidAPI and look for a pre-sanitised version?

  const parser = (
    await mermaid.mermaidAPI.getDiagramFromText(mermaidGraph)
  ).getParser().yy;

  const crate = new ROCrate();

  const vertices = parser.getVertices();

  const nodes = {}

  for( const [id, vertex] of parser.getVertices() ) {
    nodes[id] = {
      '@id': id, 
      '@type': vertex.type,
      'name': id,
      'description': vertex.text,
    };
  }
  for( const edge of parser.getEdges() ) {
    const source = edge.start;
    const target = edge.end;
    if( source in nodes ) {
      nodes[source]["hasPart"] = { "@id": target }
    } else {
      throw(Error(`Edge has source id ${source} not found in vertex list`))
    }
  }

  for( const nodeid in nodes ) {
    crate.addEntity(nodes[nodeid]);
  }

  return crate;
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: -i graph.mermaid").argv;

    const mermaidGraph = await promises.readFile(argv.i);
    try {
      const crate = await mermaid2jsonld(mermaidGraph.toString());
      console.log(JSON.stringify(crate, null, 2));
    } catch(e) {
      if( e.message.substr(0, 9) === "DOMPurify" ) {
        console.error("mermaid on node can't handle lables because of DOMPurify");
      } else {
        console.error(`Couldn't parse mermaid file: ${e.message}`);
      }
    }

}



main();