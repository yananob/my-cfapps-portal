import { ServiceGroup } from "@/lib/types";

export interface ServiceListItem {
  name: string;
  url: string;
  logUrl: string;
}

export function groupServices(services: ServiceListItem[], repoMap: Map<string, { repoUrl: string; issueUrl: string; julesUrl: string }>): ServiceGroup[] {
  const groupsMap = new Map<string, ServiceGroup>();

  for (const service of services) {
    let baseName = service.name;
    let type: "main" | "test" | "event" | "testEvent" = "main";

    if (service.name.endsWith("-test-event")) {
      baseName = service.name.replace(/-test-event$/, "");
      type = "testEvent";
    } else if (service.name.endsWith("-test")) {
      baseName = service.name.replace(/-test$/, "");
      type = "test";
    } else if (service.name.endsWith("-event")) {
      baseName = service.name.replace(/-event$/, "");
      type = "event";
    }

    let group = groupsMap.get(baseName);
    if (!group) {
      const repoInfo = repoMap.get(baseName);
      group = {
        baseName,
        repoUrl: repoInfo?.repoUrl,
        issueUrl: repoInfo?.issueUrl,
        julesUrl: repoInfo?.julesUrl,
      };
      groupsMap.set(baseName, group);
    }

    group[type] = {
      url: service.url,
      logUrl: service.logUrl,
    };
  }

  return Array.from(groupsMap.values()).sort((a, b) =>
    a.baseName.localeCompare(b.baseName)
  );
}
