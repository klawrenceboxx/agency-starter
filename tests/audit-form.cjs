const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')
const babel = require('@babel/core')
const dom = new JSDOM('<div id="root"></div>', { url: 'https://boxxautomations.space/audit' })
Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })
const React = require('react')
const { act } = React
const { createRoot } = require('react-dom/client')
let modalOpen = true
const context = { useAuditModal: () => ({ open: modalOpen, closeModal: () => { modalOpen = false } }) }
const config = { CALENDLY_URL: 'https://calendly.com/kaleellawrenceboxx/discovery-call', LINKEDIN_URL: '#', SPOTS_OPEN: 2, TOTAL_SPOTS: 5 }
function load(file) {
  const code = babel.transformSync(fs.readFileSync(file, 'utf8'), { presets: ['@babel/preset-react'], plugins: ['@babel/plugin-transform-modules-commonjs'] }).code
  const mod = { exports: {} }
  vm.runInNewContext(code, { React, module: mod, exports: mod.exports, require: name => name === 'react' ? React : name === './BoxxAuditForm' ? { default: load('components/audit/BoxxAuditForm.jsx'), __esModule: true } : name === 'next/link' ? (({children,...props}) => React.createElement('a', props, children)) : name.includes('AuditModalContext') ? context : config, document, window, fetch: (...args) => global.fetch(...args), setTimeout, clearTimeout, Date })
  return mod.exports.default
}
const Audit = load('components/audit/AuditModal.jsx')
const root = createRoot(document.getElementById('root'))
let checks = 0
function check(condition,label) { assert.ok(condition,label); checks++; console.log('PASS',label) }
async function render(inline=true,url='https://example.test/webhook') { modalOpen=true; await act(async()=>root.render(null)); await act(async()=>root.render(React.createElement(Audit,{inline,webhookUrl:url}))) }
async function click(prefix) { const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().includes(prefix)); assert.ok(b,prefix); await act(async()=>b.click()) }
async function fill(key,value) {
  const input=document.querySelector(`[name="${key}"]`)
  await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,value); input.dispatchEvent(new window.Event('input',{bubbles:true}))})
}
async function details(values={}) { for(const [k,v] of Object.entries({fullName:'BOXX QA',email:'qa@example.com',website:'example.com',phone:'4165551234',...values})) await fill(k,v); await click('Continue') }
async function start(service='My website',inline=true,url) { await render(inline,url); await click(service); await click('Continue') }
async function ready(service='My website',inline=true) { await start(service,inline); await details(inline?{}:{phone:''}) }
;(async()=>{
  await render(); check(document.body.textContent.includes('What would you like to improve?')&&!document.querySelector('input'),'Service comes first'); await click('Continue'); check(document.querySelector('[role="alert"]'),'Service required')
  await start(); check(document.querySelector('input[type="checkbox"]').checked===false,'Consent starts unchecked'); check(document.querySelectorAll('input[type="checkbox"]').length===2,'Separate SMS consent available'); await details({fullName:'',email:'',website:'',phone:''}); check(document.querySelectorAll('[aria-invalid="true"]').length===3,'Audit requires name, email and website; phone optional')
  for(const [k,v] of [['fullName','X'],['email','bad'],['website','bad'],['phone','123']]) {await start();await details({[k]:v});check(document.querySelector(`[name="${k}"]`).getAttribute('aria-invalid')==='true',`${k} validates`)}
  await ready(); await click('Back'); check(document.querySelector('[name="fullName"]').value==='BOXX QA','Back preserves contact values'); await click('Back');check(document.querySelector('[aria-pressed="true"]').textContent.includes('My website'),'Back preserves service');await click('Continue');await click('Continue');check(document.body.textContent.includes('Optional'),'Budget optional')
  for(const [service,services,path] of [['My website',['website'],'website'],['My email follow-ups',['emails'],'emails'],['Both website',['website','emails'],'both']]){
    await ready(service);let payload;global.fetch=async(url,opts)=>{check(url==='https://example.test/webhook','Existing handler URL');payload=JSON.parse(opts.body);return{ok:true,json:async()=>({ok:true})}};await click('Send My Free Audit');check(document.body.textContent.includes("You're in, BOXX."),'Existing success state');assert.deepEqual(payload.services,services);check(payload.path===path,'Routing preserved');check(payload.budget===''&&payload.source==='networking','Optional budget and source preserved');check(payload.consent===false&&payload.consent_text==='','Unchecked consent preserved');check(payload.email_marketing_consent===false&&payload.sms_marketing_consent===false,'Explicit unchecked consent booleans')
  }
  for(const [label,value] of [['Under $1,000','under-1000'],['$1,000\u2013$2,500','1000-2500'],['$2,500+','2500-plus'],['Just exploring','']]) {await ready();await click(label);let p;global.fetch=async(u,o)=>{p=JSON.parse(o.body);return{ok:true,json:async()=>({ok:true})}};await click('Send My Free Audit');check(p.budget===value,`${label} maps to backend`)}
  await ready();await click('Under $1,000');await click('Under $1,000');check(!document.querySelector('[aria-pressed="true"]'),'Budget can be cleared')
  await start();await act(async()=>document.querySelector('input[type="checkbox"]').click());await details();await click('Back');check(document.querySelector('input[type="checkbox"]').checked,'Consent survives Back');await click('Continue');let p;global.fetch=async(u,o)=>{p=JSON.parse(o.body);return{ok:true,json:async()=>({ok:true})}};await click('Send My Free Audit');check(p.consent===true&&p.consent_text==='Yes, email me my audit follow-ups and occasional tips from BOXX Automations. I can unsubscribe at any time.','Consent wording unchanged')
  for (const [emailConsent, smsConsent] of [[false,false],[true,false],[false,true],[true,true]]) {
    await start();
    const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
    check(boxes.every(box => !box.checked), 'Both consents default unchecked');
    if (emailConsent) await act(async()=>boxes[0].click());
    if (smsConsent) await act(async()=>boxes[1].closest('label').click());
    check(boxes[0].checked===emailConsent&&boxes[1].checked===smsConsent,'Consent selections independent');
    await details({phone:''});
    await click('Back');
    check(document.querySelector('[name="sms_marketing_consent"]').checked===smsConsent,'SMS consent survives Back');
    await click('Continue');
    let payload;
    global.fetch=async(u,o)=>{payload=JSON.parse(o.body);return{ok:true,json:async()=>({ok:true})}};
    await click('Send My Free Audit');
    check(payload.email_marketing_consent===emailConsent&&payload.sms_marketing_consent===smsConsent,'All consent combinations reach webhook');
    check(payload.consent===emailConsent&&payload.phone==='','Legacy consent preserved and phone optional');
    check(document.querySelector('.done'),'Submission succeeds with optional consent');
  }
  for(const failure of ['network','http','validation']) {await ready();global.fetch=async()=>{if(failure==='network')throw Error('offline');return{ok:failure!=='http',json:async()=>({ok:false})}};await click('Send My Free Audit');check(document.querySelector('[role="alert"]')&&!document.querySelector('.done'),`${failure} fails without success`);check(![...document.querySelectorAll('button')].find(e=>e.textContent.startsWith('Send My')).disabled,'Retry enabled')}
  await start('My website',true,'');await details();await click('Send My Free Audit');check(document.body.textContent.includes('temporarily unavailable'),'Missing webhook fails closed')
  await ready();let resolve,count=0;global.fetch=()=>{count++;return new Promise(r=>resolve=r)};const button=[...document.querySelectorAll('button')].find(e=>e.textContent.startsWith('Send My'));await act(async()=>{button.click();button.click()});check(count===1&&button.disabled,'Duplicate submission blocked');check([...document.querySelectorAll('button')].find(e=>e.textContent.includes('Back')).disabled,'Back disabled while sending');await act(async()=>resolve({ok:true,json:async()=>({ok:true})}))
  await ready('My email follow-ups',false);global.fetch=async(u,o)=>{p=JSON.parse(o.body);return{ok:true,json:async()=>({ok:true})}};await click('Send My Free Audit');check(p.phone===''&&p.source===window.location.href,'Homepage phone optional and source unchanged');check(document.querySelector('[role="dialog"]')&&document.querySelector('.m-close'),'Homepage modal retained')
  await act(async()=>root.unmount());console.log(`${checks} checks passed`)
})().catch(e=>{console.error(e);process.exitCode=1})
