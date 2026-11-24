# Can a free ML model replace Gemini for snake identification?

**Short answer: not safely, today.** This documents the experiment so the decision can be revisited.

## What was tested

* **Model:** the SnakeCLEF 2024 organisers' baseline, `picekl/SnakeCLEF2024-Sample_Submission` on Hugging Face (SwinV2-tiny, ONNX, 122 MB, MIT licence). It was trained on ~1,784 snake species worldwide, including India.
* **Problem:** the model returns class *numbers*; the class→species table is part of the competition data and is not freely downloadable. To work around this, the class used for each species was **discovered empirically**: the model was run on reference photos of known Indian species, the most frequent class for each species was taken from half of the photos, and accuracy was measured on the other, unseen half.
* **Data:** up to 26 Wikimedia Commons photos for each of 19 Indian species (231 held-out photos). Photos are of mixed quality (captive, close-up, dead animals, etc.), which is also what real users will upload.

## Results (held-out photos)

| Question | Result |
| --- | --- |
| Species correct on the first guess | **51%** |
| Species within the top 3 guesses | 68% |
| Species within the top 5 guesses | 73% |
| **Dangerous snakes flagged as dangerous** (any of top 3) | **66%** (86 of 130) |
| Harmless snakes wrongly flagged dangerous | 3% (3 of 101) |
| Big Four, flagged dangerous within top 3 | cobra 5/13 · krait 9/13 · Russell's viper 9/13 · saw-scaled viper 11/13 |

The two cobra species (*Naja naja*, *N. kaouthia*) collapsed onto the same class, and the model often picked neither.

## Conclusion

About **one in three dangerous snakes would be reported as not dangerous**. For a snakebite-safety tool that is the unsafe kind of error, so this model is **not** used as the identifier. Gemini remains the identifier; the app instead makes sure that an exhausted AI quota never leaves a visitor with nothing (see below).

## What the app does when the AI is unavailable

* **Identify:** a clear message plus "treat it as venomous", the Big Four field guide, the symptom checker and emergency help.
* **Symptom checker:** falls back to cautious built-in rules (`src/services/localTriage.ts`): any bite is urgent, and warning signs raise it to critical.
* **Emergency page, hospitals, Big Four guide, first aid:** need no AI at all.

## Ways to remove the dependency properly

1. **Enable billing on the Gemini API key.** The "limit exhausted" problem is a free-tier limit; a paid tier costs a small fraction of a cent per scan (check current pricing) and keeps the best-performing identifier.
2. **Train a purpose-built model** on ~50 Indian species using research-grade iNaturalist/GBIF photos (fine-tune a small vision backbone on a free Colab GPU, export to ONNX). Measure it with the same held-out test above and only replace Gemini if dangerous-snake recall is high (target ≥ 95%).
3. **Use both:** a local model as a fast first pass, with the AI confirming — only if the local model passes the recall target.

Do not create several Google projects/keys to get around free-tier limits; that is against Google's terms.
