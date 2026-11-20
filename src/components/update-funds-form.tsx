"use client";

import { useState } from "react";
import { useFundsStore } from "@/store/funds-store";

interface UpdateFundsFormProps {
  onSuccess: () => void;
}

const QUICK_ADD_AMOUNTS = [100, 200, 500, 1000];

export default function UpdateFundsForm({ onSuccess }: UpdateFundsFormProps) {
  const currentFunds = useFundsStore((state) => state.funds);
  const setFunds = useFundsStore((state) => state.setFunds);
  const [amount, setAmount] = useState<string>(String(currentFunds));

  const handleQuickAdd = (value: number) => {
    const numeric = parseFloat(amount) || 0;
    setAmount(String(Math.max(0, numeric + value)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numeric = parseFloat(amount);
    if (!isNaN(numeric) && numeric >= 0) {
      setFunds(numeric);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#e3dcf0] bg-surface focus-within:border-purple-primary transition-colors">
        <span className="text-xl font-medium text-primary select-none">₹</span>
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter amount"
          required
          className="flex-1 bg-transparent text-base sm:text-lg text-primary placeholder:text-secondary outline-none font-medium"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs sm:text-sm font-medium text-primary">Quick add</span>
        <div className="flex items-center gap-2 w-full">
          {QUICK_ADD_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuickAdd(val)}
              className="flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl bg-[#f4f0fa] hover:bg-[#eae3f5] text-primary text-xs sm:text-sm font-medium text-center transition-colors cursor-pointer"
            >
              + ₹{val.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full py-4 px-6 rounded-2xl font-medium text-base sm:text-lg text-white bg-gradient-to-r from-[#8c71e6] to-[#a488f5] shadow-[0_8px_20px_rgba(140,113,230,0.35)] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer mt-2"
      >
        Add Funds
      </button>
    </form>
  );
}
