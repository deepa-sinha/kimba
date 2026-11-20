import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";

interface FundsState {
  funds: number;
  setFunds: (amount: number) => void;
  addFunds: (amount: number) => void;
}

export const useFundsStore = create<FundsState>()(
  persist(
    (set) => ({
      funds: 25000,
      setFunds: (amount: number) => set({ funds: Math.max(0, amount) }),
      addFunds: (amount: number) =>
        set((state) => ({ funds: Math.max(0, state.funds + amount) })),
    }),
    {
      name: "kimba_funds",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

export function useHydratedFunds(): number {
  const [mounted, setMounted] = useState(false);
  const funds = useFundsStore((state) => state.funds);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? funds : 25000;
}
