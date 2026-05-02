export interface ServiceInstance {
  url: string;
  logUrl: string;
}

export interface ServiceGroup {
  baseName: string;
  main?: ServiceInstance;
  test?: ServiceInstance;
  event?: ServiceInstance;
  testEvent?: ServiceInstance;
  repoUrl?: string;
  issueUrl?: string;
  julesUrl?: string;
}
