import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import { BELGA_PUBLICATION_CHANNEL } from '../config';
import { sparqlEscapeString, sparqlEscapeDateTime } from 'mu';

async function getPressReleaseContent(graph, pressReleaseUri) {
  const result = await query(`
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    PREFIX fabio: <http://purl.org/spar/fabio/>


    SELECT ?title ?htmlText WHERE {
      GRAPH <${graph}> {
        <${pressReleaseUri}> a fabio:PressRelease ;
          nie:title ?title ;
          nie:htmlContent ?htmlText .
      }
    } LIMIT 1
  `);

  return result.results.bindings.map(mapBindingValue);
}

async function savePressReleaseText(graph, taskUri, htmlContent) {
  await update(`
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
      PREFIX dct: <http://purl.org/dc/terms/>

      INSERT {
        GRAPH <${graph}> {
          <${taskUri}> nie:htmlContent ${sparqlEscapeString(htmlContent)} ;
            dct:modified ${sparqlEscapeDateTime(new Date())} .
        }
      } WHERE {
        GRAPH <${graph}> {
          <${taskUri}> a ext:PublicationTask .
        }
      }
    `);
}

// TODO why is this query only working when last OPTIONAL is outside the GRAPH brackets?
async function getPressReleaseSources(graph, pressReleaseUri) {
  const result = await query(`
      PREFIX fabio: <http://purl.org/spar/fabio/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX ebucore: <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#>
      PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
      PREFIX org: <http://www.w3.org/ns/org#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

      SELECT ?source ?fullName ?function ?telephone ?mobile ?email ?organization WHERE {
        GRAPH <${graph}> {
          <${pressReleaseUri}> a fabio:PressRelease;
            dct:source ?source .
          ?source a ebucore:Contact ;
            vcard:fn ?fullName .
          OPTIONAL { ?source vcard:role ?function }
          OPTIONAL {
              ?source vcard:hasTelephone ?telephoneURI .
              ?telephoneURI a vcard:Voice ;
                vcard:hasValue ?telephone ;
                ext:publicationChannel <${BELGA_PUBLICATION_CHANNEL}> .
          }
          OPTIONAL {
              ?source ext:hasMobile ?mobileURI .
              ?mobileURI a vcard:Cell;
                vcard:hasValue ?mobile;
                ext:publicationChannel <${BELGA_PUBLICATION_CHANNEL}> .
          }
          OPTIONAL {
              ?source vcard:hasEmail ?emailURI .
              ?emailURI a vcard:Email ;
                vcard:hasValue ?email ;
                ext:publicationChannel <${BELGA_PUBLICATION_CHANNEL}> .
          }
        }
        OPTIONAL{
          ?organizationURI a vcard:Organization ;
            org:hasMember ?source ;
            vcard:fn ?organization .
        }
      }
  `);

  return result.results.bindings.map(mapBindingValue);

}

export function mapBindingValue(binding) {
  const result = {};
  for (let key in binding) {
      result[key] = binding[key].value;
  }
  return result;
}

export {
  getPressReleaseContent,
  savePressReleaseText,
  getPressReleaseSources
};