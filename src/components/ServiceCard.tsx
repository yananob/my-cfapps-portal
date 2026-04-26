import React from "react";
import { Github, MessageSquare, ListTodo, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  name: string;
  url: string;
  repoUrl?: string;
  issueUrl?: string;
  logUrl: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  url,
  repoUrl,
  issueUrl,
  logUrl,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 truncate" title={name}>
          {name}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>App</span>
          </a>
          <a
            href={logUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-md transition-colors"
          >
            <ListTodo className="w-4 h-4" />
            <span>Log</span>
          </a>
          {repoUrl ? (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Repo</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 bg-slate-50 dark:text-slate-600 dark:bg-slate-900 rounded-md cursor-not-allowed">
              <Github className="w-4 h-4" />
              <span>Repo</span>
            </div>
          )}
          {issueUrl ? (
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Issue</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 bg-slate-50 dark:text-slate-600 dark:bg-slate-900 rounded-md cursor-not-allowed">
              <MessageSquare className="w-4 h-4" />
              <span>Issue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
