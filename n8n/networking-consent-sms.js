// Extends the existing workflows; never creates another lead webhook or CRM.
const crypto = require('node:crypto')
const VERSION = 'networking-consent-v1'
const HEADERS = ['consent_profile', 'email_marketing_consent', 'sms_marketing_consent', 'email_consent_at', 'sms_consent_at', 'consent_recorded_at', 'consent_source', 'consent_version', 'sms_confirmation_status', 'sms_confirmation_sid', 'sms_confirmation_at', 'sms_opt_out']
const EMAIL_TEXT = 'Yes, send me BOXX Automations tips, offers and follow-up emails. I can unsubscribe anytime.'
const SMS_TEXT = 'Yes, text me an audit confirmation and BOXX Automations tips, offers and follow-ups. Standard message and data rates may apply. Reply STOP to opt out.'
function extendWorkflow(w) {
  if (!['BOXX - Lead Intake', 'BOXX - Nurture Scheduler'].includes(w.name)) return w
  const node = name => { const n = w.nodes.find(n => n.name === name); if (!n) throw new Error('Missing node: ' + name); return n }
  const replace = (name, old, value) => {
    const n = node(name)
    if (!n.parameters.jsCode.includes(old)) throw new Error('Unexpected code in ' + name)
    n.parameters.jsCode = n.parameters.jsCode.replace(old, value)
  }
  const code = (name, jsCode, x, y) => ({id:crypto.randomUUID(),name,type:'n8n-nodes-base.code',typeVersion:2,position:[x,y],parameters:{mode:'runOnceForAllItems',jsCode}})
  const link = (from,to,out=0) => {
    w.connections[from] ||= {main:[]}
    while(w.connections[from].main.length<=out) w.connections[from].main.push([])
    w.connections[from].main[out].push({node:to,type:'main',index:0})
  }
  const sheet = (name,tab,operation,match,x,y) => {
    const n=structuredClone(node('Save lead (upsert by email)'))
    Object.assign(n,{id:crypto.randomUUID(),name,position:[x,y],onError:'continueRegularOutput'})
    n.parameters.sheetName={__rl:true,mode:'name',value:tab}
    n.parameters.operation=operation
    n.parameters.columns={mappingMode:'autoMapInputData',value:{},matchingColumns:match?[match]:[],schema:[]}
    return n
  }
  if(w.name==='BOXX - Nurture Scheduler') {
    replace('Plan sends', 'const delivered = T(r.framework_delivered)', `const delivered = T(r.framework_delivered)
  if (delivered && r.consent_profile === '${VERSION}' && !T(r.email_marketing_consent)) {
    out.push({json:{action:'stop',email:r.email,reason:'no_email_marketing_consent'}}); continue
  }`)
    replace('Plan sends', "out.push({ json: { action: 'send'", "out.push({ json: { consent_profile: r.consent_profile, email_marketing_consent: r.email_marketing_consent, action: 'send'")
    appendAuditBodyTransform(node('Build SendGrid request'), true)
    replace('Row: lead advanced', "nurture_status: m.n >= 5 ? 'COMPLETED' : 'ACTIVE'", "nurture_status: m.auditOnly ? 'STOPPED' : m.n >= 5 ? 'COMPLETED' : 'ACTIVE', stop_reason: m.auditOnly ? 'no_email_marketing_consent' : ''")
    replace('Row: lead advanced', "next_email_due_at: m.nextDue || ''", "next_email_due_at: m.auditOnly ? '' : m.nextDue || ''")
    return w
  }
  replace('Config', 'resendAfterDays: 30,', `resendAfterDays: 30,
  // Credentials belong to n8n's Twilio credential, not this public configuration.
  smsEnabled: false,
  twilioAccountSid: '',
  twilioMessagingServiceSid: '',`)
  replace('Validate & normalize', 'const lead = {', `const networking = b.source === 'networking' && b.consent_version === '${VERSION}'
if (b.consent_version && !networking) errors.push('invalid_consent_profile')
const digits = clean(b.phone).replace(/\\D/g, '')
let phone = clean(b.phone).slice(0,30)
if (networking) {
  if (!/^[+\\d\\s().-]+$/.test(phone) || !(/^[2-9]\\d{2}[2-9]\\d{6}$/.test(digits) || /^1[2-9]\\d{2}[2-9]\\d{6}$/.test(digits))) errors.push('invalid_phone')
  else phone = '+' + (digits.length === 10 ? '1' : '') + digits
  for (const key of ['email_marketing_consent','sms_marketing_consent']) if(typeof b[key] !== 'boolean') errors.push('invalid_' + key)
}
const recorded = new Date().toISOString()
const consent = networking ? {
  consent_profile:'${VERSION}', email_marketing_consent:b.email_marketing_consent===true?'TRUE':'FALSE',
  sms_marketing_consent:b.sms_marketing_consent===true?'TRUE':'FALSE',
  email_consent_at:b.email_marketing_consent===true?recorded:'', sms_consent_at:b.sms_marketing_consent===true?recorded:'',
  consent_recorded_at:recorded,consent_source:'https://boxxautomations.space/audit',consent_version:'${VERSION}'
} : {}
const lead = { ...consent,`)
  replace('Validate & normalize', 'phone: clean(b.phone).slice(0, 30),', 'phone,')
  replace('Decide', 'const lead = Object.assign', `const profile = L.consent_profile === '${VERSION}' || (ex && ex.consent_profile === '${VERSION}')
const consent = L.consent_profile === '${VERSION}' ? Object.fromEntries(${JSON.stringify(HEADERS.slice(0,8))}.map(k=>[k,L[k]])) : (profile ? Object.fromEntries(${JSON.stringify(HEADERS.slice(0,8))}.map(k=>[k,ex[k]])) : {})
if (profile) {
  Object.assign(row, consent)
  if(L.consent_profile === '${VERSION}') row.source='networking'
  if (ex && T(ex.framework_delivered) && !sendEmail1 && !T(consent.email_marketing_consent) && !T(ex.unsubscribe_status) && !T(ex.calendly_booked) && String(ex.client_status).toUpperCase()!=='ACTIVE') {
    row.nurture_status='STOPPED'; row.stop_reason='no_email_marketing_consent'; row.next_email_due_at=''
  }
  if (ex && ex.stop_reason==='no_email_marketing_consent' && T(consent.email_marketing_consent) && !T(ex.unsubscribe_status) && !T(ex.calendly_booked) && String(ex.client_status).toUpperCase()!=='ACTIVE') { row.nurture_status='ACTIVE';row.stop_reason='' }
}
const sendSms = L.consent_profile==='${VERSION}' && T(L.sms_marketing_consent) && !(ex && T(ex.sms_opt_out)) && !(ex && ['PENDING','QUEUED','SENT','DELIVERED'].includes(String(ex.sms_confirmation_status).toUpperCase()))
if(sendSms) row.sms_confirmation_status='PENDING'
const lead = Object.assign`)
  replace('Decide', "Object.assign({}, L, { lead_id:", "Object.assign({}, L, consent, { lead_id:")
  replace('Decide', '{ sendEmail1, reason,', '{ sendEmail1, sendSms, reason,')
  appendAuditBodyTransform(node('Build Email 1 request'), false)
  replace('Row: Email 1 sent', 'const now = new Date()', `const L = $('Decide').first().json.lead
const auditOnly = L.consent_profile==='${VERSION}' && String(L.email_marketing_consent).toUpperCase()!=='TRUE'
const now = new Date()`)
  replace('Row: Email 1 sent', "nurture_status: 'ACTIVE',", "nurture_status: auditOnly ? 'STOPPED' : 'ACTIVE', stop_reason: auditOnly ? 'no_email_marketing_consent' : '',")
  replace('Row: Email 1 sent', 'next_email_due_at: new Date(', "next_email_due_at: auditOnly ? '' : new Date(")
  w.nodes.push(code('Networking consent event', `const d=$('Decide').first().json
const L=$('Validate & normalize').first().json.lead
if(L.consent_profile!=='${VERSION}') return []
return [{json:{event_id:'consent_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8),lead_id:d.lead.lead_id,email:L.email,phone:L.phone,email_marketing_consent:L.email_marketing_consent,sms_marketing_consent:L.sms_marketing_consent,recorded_at:L.consent_recorded_at,source:L.consent_source,version:L.consent_version,email_wording:${JSON.stringify(EMAIL_TEXT)},sms_wording:${JSON.stringify(SMS_TEXT)}}}]`,1900,900))
  w.nodes.push(sheet('Log networking consent','Consent Events','append',null,2160,900))
  link('Save lead (upsert by email)','Networking consent event');link('Networking consent event','Log networking consent')
  w.nodes.push(code('Plan networking SMS', `const d=$('Decide').first().json, cfg=$('Config').first().json, L=d.lead
if(!d.sendSms) return []
const enabled=cfg.smsEnabled===true && /^AC[a-fA-F0-9]{32}$/.test(cfg.twilioAccountSid||'') && /^MG[a-fA-F0-9]{32}$/.test(cfg.twilioMessagingServiceSid||'')
const demo=String(L.email_marketing_consent).toUpperCase()==='TRUE'?' The follow-up emails show the automation in action.':''
const body='Hey '+L.first_name+' - Kaleel from BOXX Automations here. Thanks for requesting your free audit! Check your email for your free resource and next steps. If it lands in Promotions, move it to Primary.'+demo+' Questions? Email hello@boxxautomations.space. Reply STOP to unsubscribe.'
return [{json:{enabled,accountSid:cfg.twilioAccountSid,serviceSid:cfg.twilioMessagingServiceSid,phone:L.phone,body,email:L.email,lead_id:L.lead_id}}]`,2400,900))
  w.nodes.push({id:crypto.randomUUID(),name:'Twilio configured?',type:'n8n-nodes-base.if',typeVersion:2,position:[2660,900],parameters:{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'strict',version:1},conditions:[{id:crypto.randomUUID(),leftValue:'={{ $json.enabled }}',rightValue:true,operator:{type:'boolean',operation:'equals'}}],combinator:'and'},options:{}}})
  w.nodes.push({id:crypto.randomUUID(),name:'Send networking SMS (Twilio)',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[2920,800],onError:'continueErrorOutput',retryOnFail:false,credentials:{twilioApi:{id:'REPLACE_TWILIO_CREDENTIAL',name:'Twilio account'}},parameters:{method:'POST',url:'={{ "https://api.twilio.com/2010-04-01/Accounts/" + $json.accountSid + "/Messages.json" }}',authentication:'predefinedCredentialType',nodeCredentialType:'twilioApi',sendBody:true,contentType:'form-urlencoded',bodyParameters:{parameters:[{name:'To',value:'={{ $json.phone }}'},{name:'MessagingServiceSid',value:'={{ $json.serviceSid }}'},{name:'Body',value:'={{ $json.body }}'}]},options:{timeout:15000,response:{response:{fullResponse:true}}}}})
  w.nodes.push(code('SMS result row', `const p=$('Plan networking SMS').first().json, r=$input.first().json, b=r.body||r
const accepted=!!b.sid && !b.error_code && !b.error
return [{json:{email:p.email,sms_confirmation_status:accepted?String(b.status||'queued').toUpperCase():'FAILED',sms_confirmation_sid:b.sid||'',sms_confirmation_at:new Date().toISOString(),...(String(b.code||b.error_code)==='21610'?{sms_opt_out:'TRUE'}:{})}}]`,3180,800))
  w.nodes.push(code('SMS configuration blocked', `return [{json:{email:$json.email,sms_confirmation_status:'BLOCKED_CONFIGURATION'}}]`,2920,1100))
  w.nodes.push(sheet('Save SMS result','Leads','appendOrUpdate','email',3440,900))
  w.nodes.push(code('SMS error event', `const p=$('Plan networking SMS').first().json, r=$input.first().json
return [{json:{error_id:'sms_'+Date.now().toString(36),timestamp:new Date().toISOString(),workflow:'BOXX - Lead Intake',email:p.email,error_message:String(r.error?.message||r.message||'Twilio rejected SMS').slice(0,500),payload:JSON.stringify({lead_id:p.lead_id})}}]`,3180,1200))
  w.nodes.push(sheet('Log SMS failure','Error Log','append',null,3440,1200))
  link('Save lead (upsert by email)','Plan networking SMS');link('Plan networking SMS','Twilio configured?')
  link('Twilio configured?','Send networking SMS (Twilio)',0);link('Twilio configured?','SMS configuration blocked',1)
  link('Send networking SMS (Twilio)','SMS result row',0);link('Send networking SMS (Twilio)','SMS result row',1);link('Send networking SMS (Twilio)','SMS error event',1)
  link('SMS result row','Save SMS result');link('SMS configuration blocked','Save SMS result');link('SMS error event','Log SMS failure')
  return w
}
function appendAuditBodyTransform(n, scheduler) {
  // Wrap the existing script so all existing sender/template settings stay intact.
  const original=n.parameters.jsCode
  const lead=scheduler?"$input.all().map(i=>i.json)":"[$('Decide').first().json.lead]"
  n.parameters.jsCode=`const result = (()=>{${original}\n})()\nconst leads=${lead}\nfor(let i=0;i<result.length;i++) {\n const L=leads[i]\n const first=${scheduler?'L.n === 1':'true'}\n if(first && L.consent_profile==='${VERSION}' && String(L.email_marketing_consent).toUpperCase()!=='TRUE') {\n  result[i].json.meta.auditOnly=true\n  const body=result[i].json.sgBody\n  delete body.template_id\n  for(const p of body.personalizations) delete p.dynamic_template_data\n  body.content=[{type:'text/plain',value:'Hi '+(L.first_name||String(L.name||'').split(' ')[0])+', thanks for requesting your free audit.\\n\\nDownload your free BOXX Website Conversion Framework: '+$('Config').first().json.frameworkUrl+'\\n\\nKaleel will review your website and email your audit recommendations. You have not signed up for promotional follow-up emails.\\n\\nBOXX Automations\\n'+$('Config').first().json.mailingAddress+'\\nhello@boxxautomations.space'}]\n }\n}\nreturn result`
}
module.exports={extendWorkflow,HEADERS,VERSION,EMAIL_TEXT,SMS_TEXT}
