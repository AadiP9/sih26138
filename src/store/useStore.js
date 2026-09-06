import { create } from 'zustand';

export const useStore = create((set) => ({
  vessels: [],
  routes: [],
  lastPrediction: null,
  lastOptimization: null,
  lastBenchmark: null,
  lastScenario: null,
  isLoading: false,

  setVessels: (vessels) => set({ vessels }),
  setRoutes: (routes) => set({ routes }),
  setLastPrediction: (lastPrediction) => set({ lastPrediction }),
  setLastOptimization: (lastOptimization) => set({ lastOptimization }),
  setLastBenchmark: (lastBenchmark) => set({ lastBenchmark }),
  setLastScenario: (lastScenario) => set({ lastScenario }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useStore;
