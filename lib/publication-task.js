import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';

import { sparqlEscapeDateTime } from 'mu';

const TASK_NOT_STARTED_STATUS = 'http://themis.vlaanderen.be/id/concept/publication-task-status/not-started';
const TASK_ONGOING_STATUS = 'http://themis.vlaanderen.be/id/concept/publication-task-status/ongoing';
const TASK_SUCCESS_STATUS = 'http://themis.vlaanderen.be/id/concept/publication-task-status/success';
const TASK_FAILED_STATUS = 'http://themis.vlaanderen.be/id/concept/publication-task-status/failed ';

const BELGA_PUBLICATION_CHANNEL = 'http://themis.vlaanderen.be/id/publicatiekanaal/04a5d121-c991-493c-b645-b0c67cc53cf6';

class PublicationTask {
  constructor({ uri, graph, created, status }) {
    /** Uri of the publication task */
    this.uri = uri;

    /** Graph where the publication tasks is stored */
    this.graph = graph;

    /**
     * Datetime as Data object when the task was created in the triplestore
    */
    this.created = created;

    /**
     * Current status of the publication task as stored in the triplestore
    */
    this.status = status;
  }

  /**
   * Persists the given status as task status in the triple store
   *
   * @param status {string} URI of the task status
   * @public
  */
  async persistStatus(status) {
    this.status = status;

    await update(`
      PREFIX adms: <http://www.w3.org/ns/adms#>
      PREFIX dct: <http://purl.org/dc/terms/>

      DELETE WHERE {
        GRAPH <${this.graph}> {
          <${this.uri}> adms:status ?status .
          <${this.uri}> dct:modified ?modified .
        }
      }
    `);

    await update(`
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX adms: <http://www.w3.org/ns/adms#>
      PREFIX dct: <http://purl.org/dc/terms/>

      INSERT {
        GRAPH <${this.graph}> {
          <${this.uri}> adms:status <${this.status}> ;
            dct:modified ${sparqlEscapeDateTime(new Date())} .
        }
      } WHERE {
        GRAPH <${this.graph}> {
          <${this.uri}> a ext:PublicationTask .
        }
      }
    `);
  }

  /**
   * Processes the publication task
   *
   * @public
  */
  async process() {
    console.log(`Processing publication task <${this.uri}>...`);
    //await this.publish();
    await this.persistStatus(TASK_SUCCESS_STATUS);
  }
}

/**
 * Get all publication tasks that are not yet started or published,
 * and are linked to the BELGA publication channel.
 *
 * @public
*/
async function getNotStartedPublicationTasks() {
  const result = await query(`
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX adms: <http://www.w3.org/ns/adms#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX ebucore: <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#>

    SELECT ?publicationTask ?graph ?created WHERE {
      GRAPH ?graph {
        ?publicationTask a ext:PublicationTask ;
          adms:status <${TASK_NOT_STARTED_STATUS}> ;
          ext:publicationChannel ?publicationChannel ;
          dct:created ?created .
        ?event a ebucore:PublicationEvent ;
          prov:generated ?publicationTask .
        FILTER ( ?publicationChannel = <${BELGA_PUBLICATION_CHANNEL}> )
        FILTER NOT EXISTS { ?publicationEvent  ebucore:publicationEndDateTime ?endTime . }
      }
    } ORDER BY ?created
  `);

  if (result.results.bindings.length) {
    const bindings = result.results.bindings;

    return bindings.map(b => new PublicationTask({
      uri: b['publicationTask'].value,
      graph: b['graph'].value,
      status: TASK_NOT_STARTED_STATUS,
      created: new Date(Date.parse(b['created'].value))
    }));
  } else {
    return null;
  }
}

export default PublicationTask;

export {
  getNotStartedPublicationTasks,
  TASK_ONGOING_STATUS
};
