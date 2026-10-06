// Patches owner-exported live workflows while retaining live template IDs and credentials.
// node n8n/prepare-networking-upgrade.js input.json output.json
const fs=require('node:fs')
const {extendWorkflow}=require('./networking-consent-sms')
const [input,output]=process.argv.slice(2)
if(!input||!output||input===output)throw new Error('Use distinct input and output JSON paths')
const raw=JSON.parse(fs.readFileSync(input,'utf8'))
const workflows=Array.isArray(raw)?raw:[raw]
for(const w of workflows) {
 if(!['BOXX - Lead Intake','BOXX - Nurture Scheduler'].includes(w.name))throw new Error('Unexpected workflow: '+w.name)
 if(w.nodes.some(n=>n.name==='Plan networking SMS')||w.nodes.find(n=>n.name==='Plan sends')?.parameters.jsCode.includes('no_email_marketing_consent'))throw new Error('Workflow already upgraded')
 const oldIds=w.nodes.map(n=>n.id)
 const oldCredentials=new Map(w.nodes.map(n=>[n.name,JSON.stringify(n.credentials)]))
 const beforeConfig=w.nodes.find(n=>n.name==='Config').parameters.jsCode
 extendWorkflow(w)
 // Fail closed instead of changing activation state or replacing existing nodes/credentials.
 for(const [name,credentials] of oldCredentials)if(JSON.stringify(w.nodes.find(n=>n.name===name).credentials)!==credentials)throw new Error('Credential changed: '+name)
 if(oldIds.some(id=>!w.nodes.some(n=>n.id===id)))throw new Error('Existing node was removed')
 if(w.name==='BOXX - Lead Intake' && w.nodes.find(n=>n.name==='Config').parameters.jsCode.replace(/resendAfterDays: 30,\n  \/\/ Credentials belong[\s\S]*?twilioMessagingServiceSid: '',/,'resendAfterDays: 30,')!==beforeConfig)throw new Error('Unexpected live configuration change')
 for(const n of w.nodes.filter(n=>n.type==='n8n-nodes-base.code'))new Function('$','$input','$getWorkflowStaticData',n.parameters.jsCode)
}
fs.writeFileSync(output,JSON.stringify(Array.isArray(raw)?workflows:workflows[0],null,2),{mode:0o600})
console.log('Prepared upgrade; existing node IDs, credentials, configuration and activation state retained.')
