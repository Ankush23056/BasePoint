import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Sample transactions with current month dates (May 2026) so the chart is relevant
const SAMPLE_TRANSACTIONS = [
  { id: 1, name: 'Salary Credit', description: 'May monthly salary', category: 'Freelance', amount: 45000.00, date: '2026-05-01', type: 'Income', isPositive: true },
  { id: 2, name: 'Freelance Bonus', description: 'UI design project payment', category: 'Freelance', amount: 8500.00, date: '2026-05-02', type: 'Income', isPositive: true },
  { id: 3, name: 'Grocery Run', description: 'Weekly groceries from DMart', category: 'Food', amount: 1850.00, date: '2026-05-02', type: 'Expense', isPositive: false },
  { id: 4, name: 'Netflix', description: 'Monthly streaming subscription', category: 'Entertainment', amount: 649.00, date: '2026-05-01', type: 'Expense', isPositive: false },
  { id: 5, name: 'Water Bill', description: 'Monthly water supply bill', category: 'Bills', amount: 420.00, date: '2026-05-01', type: 'Expense', isPositive: false },
  { id: 6, name: 'Bus Pass', description: 'Monthly transit pass renewal', category: 'Transport', amount: 450.00, date: '2026-04-28', type: 'Expense', isPositive: false },
  { id: 7, name: 'Pharmacy', description: 'Prescription medicine purchase', category: 'Healthcare', amount: 325.00, date: '2026-04-27', type: 'Expense', isPositive: false },
  { id: 8, name: 'Clothing Store', description: 'Spring wardrobe haul', category: 'Shopping', amount: 2100.00, date: '2026-04-24', type: 'Expense', isPositive: false },
];

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

      // Transactions State — starts with sample data so the dashboard looks alive
      transactions: SAMPLE_TRANSACTIONS,
      addTransaction: (newTx) => set((state) => ({ transactions: [newTx, ...state.transactions] })),
      deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter(tx => tx.id !== id) })),
      editTransaction: (id, updatedFields) => set((state) => ({
        transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...updatedFields } : tx)
      })),
      // Clear all: sets to empty array. Persist middleware saves this so refresh stays empty.
      clearAllTransactions: () => set({ transactions: [] }),

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
      version: 4,
      // migrate runs whenever stored version < current version.
      // Returns the fresh sample state so old stale data is wiped.
      migrate: (_persistedState, _version) => ({
        role: 'Admin',
        transactions: SAMPLE_TRANSACTIONS,
        categoryBudgets: DEFAULT_BUDGETS,
        goals: [],
      }),
    }
  )
);

export default useAppStore;
