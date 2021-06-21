export const formatSolOutput = (sol: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 9, minimumFractionDigits: 9 }).format(sol);