import { Utilities } from '../../utilities';
import { toolbelt } from './toolbelt.js';
import { reschedule } from '../reschedule/';

var process = function(doc, callback) {
  // Goals:
  // 1- Execute the job
  // 2- Update the document in database
  // 3- Capture the result (if any)

  var Toolbelt = new toolbelt(doc);

  try {
    var jobResult = Utilities.registry.data[doc.name].apply(
      Toolbelt,
      doc.arguments,
    );
    var resolution = Toolbelt.checkForResolution();

    if (typeof callback === 'function') {
      return callback(undefined, jobResult);
    } else {
      return jobResult;
    }
  } catch (e) {
    // var failure = Toolbelt.failure();
    var failure = Toolbelt.failure(e.stack);
    Utilities.logger('Job failed to run due to code error: ' + doc.name);
    console.log(e);

    if (typeof callback === 'function') {
      return callback(true, undefined);
    }
  }
};

export { process };
