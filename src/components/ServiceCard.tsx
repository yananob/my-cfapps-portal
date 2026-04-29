import React from "react";
import { Github, MessageSquare, ListTodo, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceInstance } from "@/lib/types";

interface ServiceCardProps {
  baseName: string;
  main?: ServiceInstance;
  test?: ServiceInstance;
  event?: ServiceInstance;
  testEvent?: ServiceInstance;
  repoUrl?: string;
  issueUrl?: string;
}

const InstanceLinks: React.FC<{
  label: string;
  instance?: ServiceInstance;
  colorClass: string;
  textColorClass: string;
}> = ({ label, instance, colorClass, textColorClass }) => {
  if (!instance) {
    return (
      <div className="flex flex-col gap-1.5 opacity-30 grayscale">
        <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500 whitespace-nowrap">
          {label}
        </span>
        <div className="flex gap-1">
          <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-transparent whitespace-nowrap">
            <Globe className="w-3 h-3" /> App
          </div>
          <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-transparent whitespace-nowrap">
            <ListTodo className="w-3 h-3" /> Log
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className={cn("text-[9px] font-bold uppercase tracking-tight whitespace-nowrap", textColorClass)}>
        {label}
      </span>
      <div className="flex gap-1">
        <a
          href={instance.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-white rounded transition-colors shadow-sm whitespace-nowrap",
            colorClass
          )}
        >
          <Globe className="w-3 h-3" />
          <span>App</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
        </a>
        <a
          href={instance.logUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded transition-colors shadow-sm whitespace-nowrap"
        >
          <ListTodo className="w-3 h-3 text-slate-500" />
          <span>Log</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-30" />
        </a>
      </div>
    </div>
  );
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  baseName,
  main,
  test,
  event,
  testEvent,
  repoUrl,
  issueUrl,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center p-4 md:p-5 gap-6">
        {/* Name and Repo Links */}
        <div className="flex-1 min-w-0 md:max-w-[200px]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate mb-3" title={baseName}>
            {baseName}
          </h3>
          <div className="flex gap-3">
            {repoUrl ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Repo</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300 dark:text-slate-600 cursor-not-allowed">
                <Github className="w-4 h-4" />
                <span>Repo</span>
              </span>
            )}
            {issueUrl ? (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Issues</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300 dark:text-slate-600 cursor-not-allowed">
                <MessageSquare className="w-4 h-4" />
                <span>Issues</span>
              </span>
            )}
          </div>
        </div>

        {/* Instances */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 flex-1 min-w-0">
          {/* Production column */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 dark:border-blue-900/30 pb-1">
              Production
            </div>
            <div className="flex flex-col gap-3">
              <InstanceLinks
                label="HTTP"
                instance={main}
                colorClass="bg-blue-600 hover:bg-blue-700"
                textColorClass="text-blue-600"
              />
              <InstanceLinks
                label="Event"
                instance={event}
                colorClass="bg-amber-600 hover:bg-amber-700"
                textColorClass="text-amber-600"
              />
            </div>
          </div>

          {/* Test column */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 border-b border-emerald-100 dark:border-emerald-900/30 pb-1">
              Test / Staging
            </div>
            <div className="flex flex-col gap-3">
              <InstanceLinks
                label="HTTP"
                instance={test}
                colorClass="bg-emerald-600 hover:bg-emerald-700"
                textColorClass="text-emerald-600"
              />
              <InstanceLinks
                label="Event"
                instance={testEvent}
                colorClass="bg-orange-600 hover:bg-orange-700"
                textColorClass="text-orange-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
