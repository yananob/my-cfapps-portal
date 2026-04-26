export interface ServiceInstance {
  url: string;
  logUrl: string;
}

export interface ServiceGroup {
  baseName: string;
  main?: ServiceInstance;
  test?: ServiceInstance;
  event?: ServiceInstance;
  repoUrl?: string;
  issueUrl?: string;
}
