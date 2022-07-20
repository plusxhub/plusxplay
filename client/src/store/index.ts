import create from 'zustand';

const useStore = create(set => ({
  isAuthenticated: false
}));

export const useStudentStore = useStore;