# How snake identification works (and how well)

Identification is a **ladder**, so one exhausted free quota can no longer stop the app:

1. **On-device model** (free, private, no API key, no quota). Runs in the browser with WebAssembly.
   Its answer is accepted only when it is *confident and clear-cut*.
2. **Gemini (cloud)** is asked about everything the on-device model is unsure of: blurry, dark, low-resolution,
   unfamiliar or ambiguous photos.
3. If Gemini is unavailable (quota, offline), the app shows an honest **"Not sure — treat it as venomous"** result built from
   the on-device guess, with the *chance it is venomous* and the likely candidates.

Every result shows a species-confidence meter and a "chance it is venomous" meter. A "harmless" answer that the cloud AI
itself is unsure about (< 60%) is downgraded to "not sure".

## The on-device model

* **Base:** SnakeCLEF 2024 baseline `picekl/SnakeCLEF2024-Sample_Submission` (SwinV2-tiny, MIT licence, ~1,784 species),
  quantised to int8 (122 MB → 59 MB).
* **Class names are not published**, so they were discovered empirically from labelled Wikimedia Commons photos of Indian species.
* **Head:** a small softmax-regression head (21 Indian species, 10 of them dangerous) trained on the base model's scores.
  Files: `public/models/snake-swin-int8.onnx`, `public/models/head.json`.
* **Gate** (`src/services/identifyService.ts`): top-species probability ≥ 0.7, base-model max score ≥ 14, and
  P(dangerous species) ≥ 0.5 to say *venomous* on-device or < 0.05 to say *harmless* on-device. Anything else goes to Gemini.

## Measured results (held-out photos the head never saw; 248 photos, 21 species)

| Check | Result |
| --- | --- |
| On-device model alone, species top-1 | 74% (51% for the raw base model) |
| Same, int8 vs full precision | no loss (74% vs 75%) |
| Clear photos answered on-device (no cloud call) | ~61% (151 / 248) |
| Dangerous snakes wrongly called **harmless** by the gate | **0 of 130** |
| Venomous snakes confidently identified on-device | 81 of 130; the rest go to Gemini |
| Harmless snakes wrongly called venomous on-device | 4 of 118 |
| Blurred / 40-pixel photos | 93–97% sent to Gemini instead of guessing |
| Non-snake animals (lizards, eels, worms; 54 photos) | **8 of 54 still get a confident snake answer on-device** |

## Limitations — please read

* Small test set (photos from Wikimedia Commons), so every number above has wide error bars. Real phone photos will differ.
* The on-device model knows **21 species**. A snake outside that list can be mapped to the nearest known species; the
  confidence gate reduces but does not remove this.
* Non-snake animals can still be matched to a snake (see the last row). A harmless-looking answer is never a guarantee of safety.
* On-device species descriptions are English-only; the cloud path follows the chosen language.
* The cloud AI's own confidence numbers are self-reported and are less reliable than measured ones.
* This is information, not medical advice. Treat every snake as venomous and never handle it.

## Improving it

Add more labelled photos per species (iNaturalist research-grade images are ideal), re-extract the base model's scores,
re-fit the head, then re-measure on a held-out split before changing the gate. If you replace `head.json` or the model,
bump the `?v=` in `src/services/localModel.ts` (the files are cached as immutable).

Do not create several Google projects/keys to get around free-tier limits; that is against Google's terms. Enabling billing
on the Gemini key is the simplest way to make the cloud step unlimited.
