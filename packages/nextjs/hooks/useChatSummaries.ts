import { useCallback, useEffect, useState } from "react";

export interface ChatSummary {
  id: string;
  date: string;
  summary: string;
  messageCount: number;
  participants: string[];
  tags: string[];
  createdAt: string;
}

export const useChatSummaries = () => {
  const [summaries, setSummaries] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Load summaries from localStorage and sync with API
  useEffect(() => {
    const loadSummaries = async () => {
      setLoading(true);

      try {
        const savedSummaries = localStorage.getItem("chatSummaries");
        if (savedSummaries) {
          setSummaries(JSON.parse(savedSummaries));
        }
      } catch {
        console.warn("Failed to load from localStorage");
      }

      setLoading(false);

      // Try to sync with API in the background (non-blocking)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch("/api/chat-summaries", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const apiSummaries = await response.json();
          // Only update if API has more data than localStorage
          if (apiSummaries.length > summaries.length) {
            setSummaries(apiSummaries);
            localStorage.setItem("chatSummaries", JSON.stringify(apiSummaries));
          }
        }
      } catch {
        console.warn("API not available or timeout, using localStorage only");
      }
    };

    loadSummaries();
  }, [summaries.length]);

  // Save summary to localStorage immediately, then sync with API in background
  const saveSummary = useCallback(async (summary: ChatSummary) => {
    // Save to localStorage immediately for fast response
    const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
    const updatedSummaries = [summary, ...existingSummaries];
    localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

    setSummaries(prev => [summary, ...prev]);

    // Try to save to API in the background (non-blocking)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch("/api/chat-summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(summary),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to save to API");
      }
    } catch {
      console.warn("Failed to save to API or timeout, using localStorage only");
    }
  }, []);

  // Delete summary from localStorage immediately, then sync with API in background
  const deleteSummary = useCallback(async (id: string) => {
    // Delete from localStorage immediately for fast response
    const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
    const updatedSummaries = existingSummaries.filter((s: ChatSummary) => s.id !== id);
    localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

    setSummaries(prev => prev.filter(summary => summary.id !== id));

    // Try to delete from API in the background (non-blocking)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`/api/chat-summaries?id=${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to delete from API");
      }
    } catch {
      console.warn("Failed to delete from API or timeout, using localStorage only");
    }
  }, []);

  // Update summary
  const updateSummary = useCallback((id: string, updates: Partial<ChatSummary>) => {
    setSummaries(prev => prev.map(summary => (summary.id === id ? { ...summary, ...updates } : summary)));
  }, []);

  // Export summary as JSON file
  const exportSummary = useCallback((summary: ChatSummary) => {
    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-summary-${summary.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Load summaries on mount
  useEffect(() => {
    // This useEffect is no longer needed as the loadSummaries function is now inside useEffect
    // Keeping it for now, but it can be removed if not used elsewhere.
  }, []);

  return {
    summaries,
    loading,
    saveSummary,
    deleteSummary,
    updateSummary,
    exportSummary,
    reloadSummaries: () => {
      // This function is now redundant as loadSummaries is called directly in useEffect
      // Keeping it for now, but it can be removed if not used elsewhere.
    },
  };
};
