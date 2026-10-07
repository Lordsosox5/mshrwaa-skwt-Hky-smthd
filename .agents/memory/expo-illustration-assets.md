---
name: Expo illustration asset sizing
description: Keep generated story art small enough for responsive Expo preview starts.
---

Keep full-size generated originals out of the Expo runtime import graph. Export in-app story illustrations as JPEG or WebP at an appropriate display size and quality; use PNG when transparency or lossless detail matters.

**Why:** Multi-megabyte PNG scene art made the initial Expo preview appear blank while assets loaded. Converting story illustrations to compact JPEGs made the main UI content available in the headless render within about one second.

**How to apply:** When adding AI scene art to an Expo app, preserve source files if needed, but include only compressed derivatives in the app’s `require()` mappings.
