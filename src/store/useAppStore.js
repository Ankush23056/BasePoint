import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_TRANSACTIONS = [];

const DEFAULT_BUDGETS = {
  Bills: 5000,
  Food: 8000,
  Shopping: 3000,
  Entertainment: 2000,
  Healthcare: 2500,
  Transport: 2000,
  Freelance: 0,
  Other: 1000,
};

const useAppStore = create(
  persist(
    (set) => ({
      // RBAC State
      role: 'Admin',
      setRole: (newRole) => set({ role: newRole }),

      // Transactions State
      transactions: INITIAL_TRANSACTIONS,
      addTransaction: (newTx) => set((state) => ({ transactions: [newTx, ...state.transactions] })),
      deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter(tx => tx.id !== id) })),
      clearAllTransactions: () => set({ transactions: [] }),
      editTransaction: (id, updatedFields) => set((state) => ({
        transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...updatedFields } : tx)
      })),

      // Budget State
      categoryBudgets: DEFAULT_BUDGETS,
      setCategoryBudget: (category, amount) => set((state) => ({
        categoryBudgets: { ...state.categoryBudgets, [category]: Number(amount) }
      })),
      resetBudgets: () => set({ categoryBudgets: DEFAULT_BUDGETS }),

      // Goals State
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
      deleteGoal: (id) => set((state) => ({ goals: state.goals.filter(g => g.id !== id) })),
      contributeToGoal: (id, amount) => set((state) => ({
        goals: state.goals.map(g =>
          String(g.id) === String(id) ? { ...g, currentAmount: g.currentAmount + Number(amount) } : g
        )
      })),
    }),
    {
      name: 'basepoint-app-storage',
      version: 2, // Bumping version clears old cached localstorage data
    }
  )
);

export default useAppStore;
