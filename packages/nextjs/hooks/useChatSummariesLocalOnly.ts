import { useCallback, useEffect, useState } from "react";

export interface ChatSummary {
  id: string;
  date: string;
  summary: string;
  messageCount: number;
  participants: string[];
  tags: string[];
  createdAt: string;
  title?: string;
}

export const useChatSummariesLocalOnly = () => {
  const [summaries, setSummaries] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load summaries from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const savedSummaries = localStorage.getItem("chatSummaries");
      if (savedSummaries) {
        setSummaries(JSON.parse(savedSummaries));
      }
    } catch {
      setError("Failed to load summaries from localStorage");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save summary to localStorage only
  const saveSummary = useCallback((summary: ChatSummary) => {
    try {
      const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
      const updatedSummaries = [summary, ...existingSummaries];
      localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

      setSummaries(prev => [summary, ...prev]);
    } catch {
      setError("Failed to save summary");
    }
  }, []);

  // Delete summary from localStorage only
  const deleteSummary = useCallback((id: string) => {
    try {
      const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
      const updatedSummaries = existingSummaries.filter((s: ChatSummary) => s.id !== id);
      localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

      setSummaries(prev => prev.filter(summary => summary.id !== id));
    } catch {
      setError("Failed to delete summary");
    }
  }, []);

  // Update summary
  const updateSummary = useCallback((id: string, updates: Partial<ChatSummary>) => {
    try {
      setSummaries(prev => prev.map(summary => (summary.id === id ? { ...summary, ...updates } : summary)));

      // Also update localStorage
      const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
      const updatedSummaries = existingSummaries.map((s: ChatSummary) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));
    } catch {
      setError("Failed to update summary");
    }
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

  // Export all summaries as JSON file
  const exportAllSummaries = useCallback(() => {
    const dataStr = JSON.stringify(summaries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `all-chat-summaries-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [summaries]);

  // Import summaries from JSON file
  const importSummaries = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedSummaries = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedSummaries)) {
          setSummaries(importedSummaries);
          localStorage.setItem("chatSummaries", JSON.stringify(importedSummaries));
        }
      } catch {
        setError("Failed to import summaries - invalid file format");
      }
    };
    reader.readAsText(file);
  }, []);

  // Clear all summaries
  const clearAllSummaries = useCallback(() => {
    try {
      setSummaries([]);
      localStorage.removeItem("chatSummaries");
    } catch {
      setError("Failed to clear summaries");
    }
  }, []);

  return {
    summaries,
    loading,
    error,
    saveSummary,
    deleteSummary,
    updateSummary,
    exportSummary,
    exportAllSummaries,
    importSummaries,
    clearAllSummaries,
  };
};
