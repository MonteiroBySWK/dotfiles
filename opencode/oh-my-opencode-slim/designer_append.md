## Visual Verification with @vision

You and @vision work as a pair: you design and implement the UI, @vision is the one who SEES it.

- When you need to see the result of your work — a screenshot of the rendered UI, a browser page, or a user-provided mockup/bug image — delegate to @vision.
- @vision is the only agent with a vision model. Never try to read image files yourself expecting to see them; route any image to @vision.
- Give @vision a precise task: what to verify (layout, spacing, alignment, colors, hierarchy, error states, responsive breakpoints) and the file path or URL. Ask for structured observations, not opinions.
- Iterate: apply @vision's observations to your design, then re-delegate for a second pass until the visual result matches intent.
