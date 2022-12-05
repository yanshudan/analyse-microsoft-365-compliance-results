import * as core from "@actions/core";

function start() {
  try {
    const reportName = core.getInput('report-name');
    console.log(reportName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
