import { app, errorHandler } from 'mu';
import { getNotStartedPublicationTasks, TASK_ONGOING_STATUS } from './lib/publication-task';


// todo configure delta notifier to send deltas for publication tasks having adms:status not started

app.post('/delta', async function (req, res, next) {
  console.log("Processing deltas for Belga...");

  const publicationTasks = await getNotStartedPublicationTasks();

  if (publicationTasks) {
    console.log(`Found ${publicationTasks.length} publication tasks to be processed.`);
    console.log(publicationTasks);
    publicationTasks.forEach( publicationTask => publicationTask.process());
    return res.status(202).end();
  } else {
    console.log(`No publication tasks found to be processed.`);
    return res.status(200).end();
  }


  // change the status of the publication task to ongoing

  // return 202 Accepted

  // for every pre
});


app.use(errorHandler);