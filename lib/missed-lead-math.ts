// Missed-lead cost math. Pure and dependency-free so it can be tested with node.
// Every number comes from what the visitor types in. No industry benchmarks are assumed.

export type CalcInputs = {
  leadsPerMonth: number // new enquiries per month
  missedPct: number // % that get no reply, or a slow one (0-100)
  closePct: number // % of answered leads that become customers (0-100)
  jobValue: number // average value of one customer, in dollars
}

export type CalcResult = {
  missedLeads: number // leads lost per month
  lostCustomers: number // customers lost per month
  lostMonthly: number // dollars per month
  lostYearly: number // dollars per year
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : 0))

export function cleanInputs(i: CalcInputs): CalcInputs {
  return {
    leadsPerMonth: clamp(i.leadsPerMonth, 0, 100000),
    missedPct: clamp(i.missedPct, 0, 100),
    closePct: clamp(i.closePct, 0, 100),
    jobValue: clamp(i.jobValue, 0, 10000000),
  }
}

export function calcMissedLeadCost(raw: CalcInputs): CalcResult {
  const i = cleanInputs(raw)
  const missedLeads = (i.leadsPerMonth * i.missedPct) / 100
  const lostCustomers = (missedLeads * i.closePct) / 100
  const lostMonthly = lostCustomers * i.jobValue
  return {
    missedLeads: Math.round(missedLeads * 10) / 10,
    lostCustomers: Math.round(lostCustomers * 10) / 10,
    lostMonthly: Math.round(lostMonthly),
    lostYearly: Math.round(lostMonthly * 12),
  }
}
