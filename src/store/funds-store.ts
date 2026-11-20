import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";

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

const emptySubscribe = () => () => {};

export function useHydratedFunds(): number {
  const funds = useFundsStore((state) => state.funds);
  return useSyncExternalStore(
    emptySubscribe,
    () => funds,
    () => 25000
  );
}
