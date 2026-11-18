# Mood to Motion

New landing page: /mood. Networking guide and shared guide components are unchanged.

## Visuals
Approved images are exact crops from the owner's Reel https://www.instagram.com/reel/Df3louINpt0/ at 4s (ASAN), 9.1s (VERITE), 13.3s (Yamaha R1).
Native cropped size is 692x390; no generated artwork or enlargement was used.

## Delivery
Skill ZIP and standalone prompt are direct public downloads, tested in the browser. No signup required.
The existing guide delivery workflow only accepts its configured PDF guides. It was not modified or repurposed.
Email capture/delivery is disabled unless MOOD_DELIVERY_WEBHOOK_URL is configured. Its resource-specific workflow must return {ok:true} after an actual successful send. Email delivery has NOT been tested and must not be advertised as working.
No newsletter subscription is created by kit requests. The existing networking consent and delivery behaviour is unchanged.

## Analytics and layout
Root GA/Clarity/attribution, header and footer are retained.
Events: mood_download (asset), mood_prompt_copy, mood_email_request (only if configured).
Existing audit popup/sticky audit CTA are suppressed only on /mood; a subtle audit link remains above the shared footer.

## Checks
npm run lint and npm test passed.
Browser checked at desktop and 390px mobile; no horizontal overflow. Clipboard verified with all 2570 characters. Both downloads completed.
Production build passes with the existing public Sanity/site settings; no secret values committed.

ManyChat destination: https://boxxautomations.space/mood
Optional attribution: ?resource=mood&channel=manychat&utm_source=instagram&utm_medium=dm&utm_campaign=mood-to-motion
