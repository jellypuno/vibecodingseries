export const SubmitJobs = {
  submitJcl: async () => ({ jobid: 'JOB12345', jobname: 'TESTJOB', status: 'INPUT' }),
  submitJob: async () => ({ jobid: 'JOB12345', jobname: 'TESTJOB', status: 'INPUT' })
};

export const GetJobs = {
  getJob: async () => ({ jobid: 'JOB12345', status: 'OUTPUT', retcode: 'CC 0000' }),
  getJobs: async () => [],
  getJobSpoolFiles: async () => []
};

export const MonitorJobs = {
  waitForJobOutputStatus: async () => ({ jobid: 'JOB12345', status: 'OUTPUT', retcode: 'CC 0000' }),
  waitForJobCompletion: async () => ({ jobid: 'JOB12345', status: 'OUTPUT', retcode: 'CC 0000' })
};

export const DeleteJobs = {
  deleteJob: async () => ({})
};
