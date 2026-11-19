---
name: add-one-colour
description: Design three "Add One Colour" website heroes (two base colours plus one accent that changes the story) and write the ChatGPT image briefs for them. Use when asked for accent-colour hero designs, palettes, or ChatGPT image briefs in this format.
---

# Add One Colour: hero designs + ChatGPT briefs

A hero is a website first screen built from exactly three colours:
- **FIELD**: the background.
- **SECOND**: the headline, type and light.
- **ACCENT**: one pop of colour that switches on and changes something real in the picture.

It's shown in three phases: (1) a flat block of FIELD, (2) FIELD + SECOND, (3) the accent switches on.
Claude plans the designs and writes the briefs. ChatGPT makes the images (it runs on the companion file
`chatgpt-image-instructions.md`). The user generates the images and brings them back.

## 1. Brief (ask once, only what's missing)
- How many designs (default: three, for one reel or post).
- The businesses: real ones, or invent fictional brands. A niche is enough ("a barbershop").
- Any reference images, colours they must use, or words they want to say on camera.

## 2. Plan: three concepts, 2 options each
For every slot give: brand + what it sells, the subject, FIELD + SECOND → ACCENT (names + hex),
what the accent changes, and a one-line mini story (verdict → payoff).

**Picking subjects**
- One big subject a stranger recognises in under a second: food, drink, a product, a person, a place, a vehicle.
  No abstract spheres, gradient orbs or plain dashboards.
- The accent changes a real, nameable object: a raincoat, ice cubes, a neon OPEN sign, lit windows.
- Three different worlds per set (e.g. fashion, drink, local business). Never two from the same category.
- Order: the most striking design first, the best payoff last.

**Picking palettes**
- Design 1's FIELD is a bold mid-tone (blue, teal, orange, red, magenta, green). It's the first frame people see.
  Not near-black, not cream or sand.
- At least one of the three fields is light or bright, so the set isn't three dark images in a row.
- FIELD and SECOND need visible contrast: light + dark, or two different hues. Not two shades of one hue.
- Flip temperature for the accent: cool base → warm accent (yellow, orange, red, pink);
  warm base → cool accent (cobalt, cyan, mint).
- Headline (SECOND on FIELD) at least 3:1 contrast. Check the hex pair; darken SECOND if it fails.
- Colour names: short and fun, two words max, keep the colour word ("Taxi Yellow", "Slushie Blue",
  "Barber Red"). They're said out loud and printed on swatch cards.

**Mini story per design**: a verdict (1–4 words) and a payoff you could film, not an adjective.
"Rainy. Everyone's grey." → "Now she owns the street." / "Shop's closed." → "Now there's a line."

## 3. Lock and write the ChatGPT briefs
Once the user picks, lock the palettes and copy. Write one brief per design, each in its own copy block:
```
DESIGN <n> of 3: <Brand>, <what it sells>
Headline: "<exact text>"   Subhead: "<exact text>"   Button: "<exact text>"   Nav: <logo> + <3 links>
FIELD:  <Name> <#hex>   (background, flat)
SECOND: <Name> <#hex>   (headline, type, light)
ACCENT: <Name> <#hex>
Subject: <one big recognisable subject, pose/framing in a few words>
Objects in palette: <every named prop and the palette colour it takes, e.g. lemon slice in FIELD yellow>
Accent goes on: <the named object + its light spill>
Art direction: <the poster idea: giant display type the subject overlaps, frame-filling crop, atmosphere
  (rain, neon glow, splash, steam, grain)>
Format: 16:9 (1920x1080)
Deliver: image 1 two-colour, image 2 accent (an EDIT of image 1, same composition)
```
- Give every named object a palette colour, or ChatGPT will paint it its real colour (an orange lemon is a 4th colour).
- Remind the user once: their ChatGPT Project must use `chatgpt-image-instructions.md` as its instructions.

## 4. Check the images when they come back
For each pair, in one short list:
- Spelling of every word on the image.
- The two images line up (same crop, pose, type). The accent image changed only the accent object and its light.
- No obvious 4th colour.
- The subject covers at most the bottom quarter of the headline letters, never whole letters.

Then use the images **as they are**. Don't recolour, re-grade or "fix" them yourself: re-grading washes the colours
out and makes them bleed. Point out a real problem in one line and let the user decide. If they want a fix, write
them a ChatGPT edit prompt (edit image 1, change only X, then redo image 2 as an edit of the new image 1).

Phase 1 is a flat block of the FIELD hex; phase 2 is image 1; phase 3 is image 2.

## 5. Optional: the reel script (16–19 seconds, about 50–58 words)
No hook line: the first colour block and the first colour word are the hook. Per design:
```
<FIELD name> and <SECOND name>. <Verdict.>
Add <ACCENT name>. <Payoff: a scene you could film.>
```
Then: "The trick? <one reusable rule, true for all three designs, ≤ 12 words>." Beat. "Follow for more."
Example rule (true when every accent flips temperature): "Cool page, warm accent. Warm page, cool accent."
Budget: words ÷ 3.1 = seconds. Cut until it's under 19s before recording.
