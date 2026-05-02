import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_TRANSACTIONS = [
  { id: 1, name: 'Water Bill', description: 'Monthly water supply bill', category: 'Bills', amount: 42.00, date: '2026-03-30', type: 'Expense', isPositive: false },
  { id: 2, name: 'Bus Pass', description: 'Monthly transit pass renewal', category: 'Transport', amount: 45.00, date: '2026-03-28', type: 'Expense', isPositive: false },
  { id: 3, name: 'Pharmacy', description: 'Prescription medicine purchase', category: 'Healthcare', amount: 32.50, date: '2026-03-27', type: 'Expense', isPositive: false },
  { id: 4, name: 'Freelance Bonus', description: 'UI design project payment', category: 'Freelance', amount: 500.00, date: '2026-03-25', type: 'Income', isPositive: true },
  { id: 5, name: 'Clothing Store', description: 'Spring wardrobe haul', category: 'Shopping', amount: 210.00, date: '2026-03-24', type: 'Expense', isPositive: false },
  { id: 6, name: 'Grocery Run', description: 'Weekly groceries from DMart', category: 'Food', amount: 1850.00, date: '2026-03-22', type: 'Expense', isPositive: false },
  { id: 7, name: 'Salary Credit', description: 'March monthly salary', category: 'Freelance', amount: 45000.00, date: '2026-03-01', type: 'Income', isPositive: true },
  { id: 8, name: 'Netflix', description: 'Monthly streaming subscription', category: 'Entertainment', amount: 649.00, date: '2026-03-15', type: 'Expense', isPositive: false },
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

      // Transactions State
      transactions: INITIAL_TRANSACTIONS,
      addTransaction: (newTx) => set((state) => ({ transactions: [newTx, ...state.transactions] })),
      deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter(tx => tx.id !== id) })),
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
    }
  )
);

export default useAppStore;
