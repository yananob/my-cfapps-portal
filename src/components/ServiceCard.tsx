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

const InstanceButtons: React.FC<{
  instance?: ServiceInstance;
  colorClass: string;
}> = ({ instance, colorClass }) => {
  if (!instance) {
    return (
      <div className="flex gap-1 opacity-20 grayscale">
        <div className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-transparent whitespace-nowrap">
          <Globe className="w-3 h-3" /> App
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-transparent whitespace-nowrap">
          <ListTodo className="w-3 h-3" /> Log
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <a
        href={instance.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 text-[10px] font-medium text-white rounded transition-colors shadow-sm whitespace-nowrap",
          colorClass
        )}
        title="Open App"
      >
        <Globe className="w-3 h-3" />
        <span>App</span>
        <ExternalLink className="w-2 h-2 opacity-50" />
      </a>
      <a
        href={instance.logUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded transition-colors shadow-sm whitespace-nowrap"
        title="View Logs"
      >
        <ListTodo className="w-3 h-3 text-slate-500" />
        <span>Log</span>
        <ExternalLink className="w-2 h-2 opacity-30" />
      </a>
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
      <div className="flex flex-col lg:flex-row lg:items-start p-4 lg:p-5 gap-4 lg:gap-6">
        {/* Name and Repo Links */}
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start lg:w-48 shrink-0">
          <div className="min-w-0 flex-1 lg:w-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate lg:mb-2" title={baseName}>
              {baseName}
            </h3>
            <div className="hidden lg:flex gap-3">
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
          {/* Repo links for mobile view */}
          <div className="flex lg:hidden gap-3 ml-4 shrink-0">
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {issueUrl && (
              <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Instances Table-like Grid */}
        <div className="flex-1 grid grid-cols-[auto_1fr_1fr] items-center gap-x-2 gap-y-3 min-w-0">
          {/* Header Row */}
          <div className="w-10"></div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 text-center border-b border-blue-100 dark:border-blue-900/30 pb-1 truncate">
            Prod
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 text-center border-b border-emerald-100 dark:border-emerald-900/30 pb-1 truncate">
            Test
          </div>

          {/* HTTP Row */}
          <div className="text-[9px] font-black uppercase tracking-tighter text-slate-400 transform -rotate-90 lg:rotate-0 w-10 text-center lg:text-left leading-none shrink-0">
            HTTP
          </div>
          <div className="min-w-0">
            <InstanceButtons
              instance={main}
              colorClass="bg-blue-600 hover:bg-blue-700"
            />
          </div>
          <div className="min-w-0">
            <InstanceButtons
              instance={test}
              colorClass="bg-emerald-600 hover:bg-emerald-700"
            />
          </div>

          {/* Event Row */}
          <div className="text-[9px] font-black uppercase tracking-tighter text-slate-400 transform -rotate-90 lg:rotate-0 w-10 text-center lg:text-left leading-none shrink-0">
            Event
          </div>
          <div className="min-w-0">
            <InstanceButtons
              instance={event}
              colorClass="bg-amber-600 hover:bg-amber-700"
            />
          </div>
          <div className="min-w-0">
            <InstanceButtons
              instance={testEvent}
              colorClass="bg-orange-600 hover:bg-orange-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
