const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')
const babel = require('@babel/core')
const React = require('react')
const { act } = React
const dom = new JSDOM('<div id="root"></div>', { url: 'https://boxxautomations.space/audit' })
Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })
const { createRoot } = require('react-dom/client')
let modalOpen = false
const context = { useAuditModal: () => ({ open: modalOpen, closeModal: () => { modalOpen = false } }) }
const config = { CALENDLY_URL: 'https://calendly.com/kaleellawrenceboxx/discovery-call', LINKEDIN_URL: '#', SPOTS_OPEN: 2, TOTAL_SPOTS: 5 }
const code = babel.transformSync(fs.readFileSync('components/audit/AuditModal.jsx', 'utf8'), { presets: ['@babel/preset-react'], plugins: ['@babel/plugin-transform-modules-commonjs'] }).code
const moduleObject = { exports: {} }
vm.runInNewContext(code, { React, module: moduleObject, exports: moduleObject.exports, require: name => name === 'react' ? React : name === 'next/link' ? (({children, ...props}) => React.createElement('a', props, children)) : name.includes('AuditModalContext') ? context : config, document, window, fetch: (...args) => global.fetch(...args), setTimeout, Date })
const Audit = moduleObject.exports.default
const root = createRoot(document.getElementById('root'))
let renderingInline = true
let checks = 0
function check(condition, label) { assert.ok(condition, label); checks++; console.log('PASS', label) }
async function render(inline = true, webhookUrl = 'https://n8n.boxxautomations.space/webhook/boxx-lead') { renderingInline = inline; await act(async () => root.render(null)); await act(async () => root.render(React.createElement(Audit, {inline, webhookUrl}))) }
async function click(text) { const button = [...document.querySelectorAll('button')].find(e => e.textContent.trim() === text); assert.ok(button, text); await act(async () => button.click()) }
async function submitDetails(values = {}) {
  const defaults = { fName: 'BOXX QA', fEmail: 'qa@example.com', fSite: 'example.com', fPhone: renderingInline ? '4165550123' : '' }
  Object.entries({...defaults,...values}).forEach(([id,value]) => document.getElementById(id).value = value)
  await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', {bubbles:true,cancelable:true})))
}
async function choose(services) { for (const s of services) await click(s === 'website' ? 'High-converting websiteTurn more visitors into customers.' : 'Automated emailsTurn more leads into paying customers.'); await click('Continue'); await click('Under $1,000Starting small') }
;(async () => {
  await render()
  check(!!document.querySelector('form') && !document.querySelector('[role="dialog"]'), 'Networking form visible immediately without modal')
  await submitDetails({ fName:'', fEmail:'', fSite:'', fPhone:'' })
  check(document.querySelectorAll('.field.err').length === 4, 'All required contact fields reject empty input')
  for (const [id,value] of [['fName','X'],['fEmail','bad'],['fSite','bad'],['fPhone','123']]) {
    await render(); await submitDetails({[id]:value}); check(document.querySelector('.field.err')?.querySelector('input').id === id, `${id} validation rejects malformed input`)
  }
  await render(); await submitDetails()
  check(document.body.textContent.includes('What would you like to improve?'), 'Valid networking phone advances')
  await click('Continue'); check(document.body.textContent.includes('Pick at least one'), 'Service selection required')
  await click('High-converting websiteTurn more visitors into customers.'); await click('Continue'); await click('Send My Audit')
  check(document.body.textContent.includes('Pick the range'), 'Budget selection required')
  for (const services of [['website'],['emails'],['website','emails']]) {
    await render(); await submitDetails(); await choose(services)
    let payload
    global.fetch = async (url, options) => { check(url === 'https://n8n.boxxautomations.space/webhook/boxx-lead', 'Existing webhook reused'); payload=JSON.parse(options.body); return {ok:true,json:async()=>({ok:true})} }
    await click('Send My Audit')
    check(document.body.textContent.includes("You're in, BOXX."), `${services.join('+')} reaches existing success state`)
    check(JSON.stringify(payload.services) === JSON.stringify(services) && payload.path === (services.length === 2 ? 'both' : services[0]), `${services.join('+')} preserves routing payload`)
    check(payload.source === 'networking', 'Networking source attached using existing field')
  }
  await render(); await submitDetails({fPhone:''}); check(!!document.querySelector('.field.err #fPhone'), 'Networking phone is required')
  for(const phone of ['abc4165550123','1111111111','+441234567890','416555012345']) {
    await render(); await submitDetails({fPhone:phone}); check(!!document.querySelector('.field.err #fPhone'), 'Reject malformed networking phone: '+phone)
  }
  for(const [email,sms] of [[false,false],[true,false],[false,true],[true,true]]) {
    await render(); await submitDetails(); await choose(['website'])
    const boxes=[...document.querySelectorAll('input[type="checkbox"]')]
    check(boxes.length===2 && boxes.every(b=>!b.checked), 'Exactly two unchecked consent boxes')
    await act(async()=>{if(email) boxes[0].click(); if(sms) boxes[1].click()})
    let payload;global.fetch=async(url,opts)=>{payload=JSON.parse(opts.body);return {ok:true,json:async()=>({ok:true})}}
    await click('Send My Audit')
    check(!!document.querySelector('.done') && payload.email_marketing_consent===email && payload.sms_marketing_consent===sms, 'Consent combination submits: '+email+'/'+sms)
    check(payload.consent_version==='networking-consent-v1' && !payload.consent_timestamp, 'Version stored; timestamp is owned by server')
  }
  for (const response of ['network','http','validation']) {
    await render(); await submitDetails(); await choose(['website'])
    global.fetch=async()=> { if(response==='network') throw new Error('offline'); return {ok:response!=='http',json:async()=>({ok:false})} }
    await click('Send My Audit'); check(document.body.textContent.includes('That didn’t send') && !document.querySelector('.done'), `${response} failure does not show false success`)
    check(!document.querySelector('.m-actions button').disabled, 'Failed submission can be retried')
  }
  await render(true,''); await submitDetails(); await choose(['website']); await click('Send My Audit'); check(document.body.textContent.includes('temporarily unavailable') && !document.querySelector('.done'), 'Missing webhook fails closed')
  modalOpen = true; await render(false); await submitDetails(); await choose(['emails'])
  let homepagePayload
  global.fetch=async(url,opts)=> {homepagePayload=JSON.parse(opts.body); return {ok:true,json:async()=>({ok:true})} }
  await click('Send My Audit')
  check(!!document.querySelector('[role="dialog"]') && !!document.querySelector('button.m-close'), 'Homepage retains modal presentation')
  check(!('email_marketing_consent' in homepagePayload) && !('sms_marketing_consent' in homepagePayload), 'Homepage payload does not acquire networking consent fields')
  check(homepagePayload.phone === '', 'Homepage phone remains optional')
  check(homepagePayload.source === window.location.href, 'Homepage source remains page URL')
  check([...document.querySelectorAll('button')].some(e=>e.textContent==='Back to the site'), 'Homepage retains close-only success action')
  await act(async()=>root.unmount())
  console.log(`${checks} checks passed`)
})().catch(error=>{console.error(error);process.exitCode=1})
