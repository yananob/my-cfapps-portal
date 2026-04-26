"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { cn } from "@/lib/utils";

interface ServiceData {
  id: string;
  url: string;
  repoUrl?: string;
  issueUrl?: string;
  logUrl: string;
}

export default function Dashboard() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error("Unexpected data format:", data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Cloud Run Services
          </h1>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={fetchServices}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 disabled:opacity-50 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {loading && services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500">Loading services...</p>
        </div>
      ) : (
        <>
          {filteredServices.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center">
              <p className="text-slate-500">No services found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.id}
                  url={service.url}
                  repoUrl={service.repoUrl}
                  issueUrl={service.issueUrl}
                  logUrl={service.logUrl}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
