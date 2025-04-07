import { create } from "zustand";

type Language = "ko" | "en";

interface LanguageStore {
  language: Language;
  toggleLanguage: () => void;
}

const useLanguageStore = create<LanguageStore>((set) => ({
  language: "ko",
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "ko" ? "en" : "ko",
    })),
}));

export default useLanguageStore;
