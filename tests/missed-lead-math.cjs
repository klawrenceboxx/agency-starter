const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const src = fs.readFileSync('lib/missed-lead-math.ts', 'utf8')
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const mod = { exports: {} }
new Function('module', 'exports', js)(mod, mod.exports)
const { calcMissedLeadCost, cleanInputs } = mod.exports
let n = 0
const check = (c, l) => { assert.ok(c, l); n++; console.log('PASS', l) }

let r = calcMissedLeadCost({ leadsPerMonth: 40, missedPct: 25, closePct: 20, jobValue: 1500 })
check(r.missedLeads === 10 && r.lostCustomers === 2 && r.lostMonthly === 3000 && r.lostYearly === 36000, 'worked example: 40 leads, 25% missed, 20% close, $1,500 = $3,000/mo, $36,000/yr')
r = calcMissedLeadCost({ leadsPerMonth: 0, missedPct: 50, closePct: 50, jobValue: 1000 })
check(r.lostMonthly === 0 && r.lostYearly === 0, 'zero leads means zero loss')
r = calcMissedLeadCost({ leadsPerMonth: 10, missedPct: 0, closePct: 30, jobValue: 500 })
check(r.lostMonthly === 0, 'nothing missed means zero loss')
r = calcMissedLeadCost({ leadsPerMonth: 100, missedPct: 100, closePct: 100, jobValue: 100 })
check(r.lostMonthly === 10000, '100% / 100% case')
const c = cleanInputs({ leadsPerMonth: -5, missedPct: 250, closePct: NaN, jobValue: Infinity })
check(c.leadsPerMonth === 0 && c.missedPct === 100 && c.closePct === 0 && c.jobValue === 0, 'negative, over-100, NaN and Infinity inputs are clamped')
r = calcMissedLeadCost({ leadsPerMonth: 7, missedPct: 33, closePct: 15, jobValue: 899 })
check(Number.isInteger(r.lostMonthly) && Number.isInteger(r.lostYearly), 'dollar results are whole numbers')
console.log(`${n} calculator checks passed`)
