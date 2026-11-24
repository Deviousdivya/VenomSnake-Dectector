// Knowledge base for the species the on-device model can recognise (keys match public/models/head.json).
// General public-health information, not medical advice. "venomous" = medically important in India.
export interface KbSpecies {
  name: string;
  scientific: string;
  venomous: boolean;
  blurb: string;
  antivenom?: string;
}

const ASV = 'Indian polyvalent anti-snake venom (ASV) is the standard treatment; only a doctor decides if and how much to give.';
const ASV_PARTIAL = 'Indian polyvalent ASV is not made against this species, so how well it works is uncertain; the hospital will decide on treatment.';

export const SPECIES_KB: Record<string, KbSpecies> = {
  Naja_naja: { name: 'Indian cobra', scientific: 'Naja naja', venomous: true, antivenom: ASV, blurb: 'One of the "Big Four". Spreads a hood when alarmed. Neurotoxic venom can paralyse breathing muscles, with painful swelling at the bite.' },
  Naja_kaouthia: { name: 'Monocled cobra', scientific: 'Naja kaouthia', venomous: true, antivenom: ASV_PARTIAL, blurb: 'A cobra of eastern and north-eastern India with a single ring-shaped hood mark. Venom causes severe local tissue damage and can affect breathing.' },
  Ophiophagus_hannah: { name: 'King cobra', scientific: 'Ophiophagus hannah', venomous: true, antivenom: ASV_PARTIAL, blurb: "The world's longest venomous snake, found in forests of the Western Ghats, the north-east and the Himalayan foothills. Large venom yield; a bite is a medical emergency." },
  Bungarus_caeruleus: { name: 'Common krait', scientific: 'Bungarus caeruleus', venomous: true, antivenom: ASV, blurb: 'One of the "Big Four". Blue-black with thin white bands, mostly active at night. The bite can be painless, yet paralysis may follow hours later.' },
  Bungarus_fasciatus: { name: 'Banded krait', scientific: 'Bungarus fasciatus', venomous: true, antivenom: ASV_PARTIAL, blurb: 'Bold yellow and black bands and a triangular body. Usually docile, but its neurotoxic venom is dangerous.' },
  Daboia_russelii: { name: "Russell's viper", scientific: 'Daboia russelii', venomous: true, antivenom: ASV, blurb: 'One of the "Big Four". Brown with large chain-like oval blotches. Venom disrupts blood clotting and can damage the kidneys.' },
  Echis_carinatus: { name: 'Saw-scaled viper', scientific: 'Echis carinatus', venomous: true, antivenom: ASV, blurb: 'One of the "Big Four". Small, rough-scaled and irritable; rubs its scales to make a rasping warning. Venom causes bleeding and tissue damage.' },
  Hypnale_hypnale: { name: 'Hump-nosed pit viper', scientific: 'Hypnale hypnale', venomous: true, antivenom: ASV_PARTIAL, blurb: 'Small pit viper of the Western Ghats, often mistaken for a harmless snake. Bites cause pain, swelling and sometimes kidney injury.' },
  Trimeresurus_albolabris: { name: 'White-lipped pit viper', scientific: 'Trimeresurus albolabris', venomous: true, antivenom: ASV_PARTIAL, blurb: 'Green tree viper of the north-east with a pale lip line. Bites cause pain and swelling and can disturb clotting.' },
  Trimeresurus_malabaricus: { name: 'Malabar pit viper', scientific: 'Trimeresurus malabaricus', venomous: true, antivenom: ASV_PARTIAL, blurb: 'Green or brownish tree viper of the Western Ghats. Bites cause pain, swelling and bleeding problems.' },

  Ahaetulla_nasuta: { name: 'Green vine snake', scientific: 'Ahaetulla nasuta', venomous: false, blurb: 'Slender bright-green snake with a pointed snout. Rear-fanged with mild venom that is not considered dangerous to people.' },
  Atretium_schistosum: { name: 'Olive keelback', scientific: 'Atretium schistosum', venomous: false, blurb: 'Olive-brown water snake that feeds on fish and frogs. Harmless to humans.' },
  Boiga_trigonata: { name: 'Common cat snake', scientific: 'Boiga trigonata', venomous: false, blurb: 'Slim, nocturnal snake with cat-like eyes. Rear-fanged with mild venom; bites are rarely serious.' },
  Coelognathus_helena: { name: 'Trinket snake', scientific: 'Coelognathus helena', venomous: false, blurb: 'Brown snake with dark lines and spots; a rat-eater that can bite if handled. Not venomous.' },
  Dendrelaphis_tristis: { name: 'Common bronzeback', scientific: 'Dendrelaphis tristis', venomous: false, blurb: 'Thin, fast tree snake with a bronze back. Harmless.' },
  Eryx_johnii: { name: 'Red sand boa', scientific: 'Eryx johnii', venomous: false, blurb: 'Thick-bodied burrowing snake with a blunt tail that can look like a head. Not venomous.' },
  Indotyphlops_braminus: { name: 'Brahminy blind snake', scientific: 'Indotyphlops braminus', venomous: false, blurb: 'Tiny earthworm-like snake living in soil. Harmless.' },
  Lycodon_aulicus: { name: 'Common wolf snake', scientific: 'Lycodon aulicus', venomous: false, blurb: 'Common house snake that is often mistaken for a krait. Not venomous.' },
  Oligodon_arnensis: { name: 'Banded kukri snake', scientific: 'Oligodon arnensis', venomous: false, blurb: 'Small banded snake that eats reptile eggs; its bite is not dangerous, though it is sometimes mistaken for a krait.' },
  Ptyas_mucosa: { name: 'Indian rat snake (dhaman)', scientific: 'Ptyas mucosa', venomous: false, blurb: 'Large, fast snake often mistaken for a cobra. Not venomous but may bite hard in defence.' },
  Python_molurus: { name: 'Indian rock python', scientific: 'Python molurus', venomous: false, blurb: 'Large non-venomous constrictor. A bite can cause deep wounds that need medical care.' },
};

export const GENERIC_PRECAUTIONS = [
  'Stay still, then step slowly backwards. Most bites happen when people try to catch, move or kill a snake.',
  'Keep children and pets away from the area.',
  'Do not handle the snake, even if it looks dead.',
  'Call a trained local snake rescuer (or the forest department helpline) to remove it.',
];

export const BITE_STEPS = [
  'Call 108 (ambulance) or 112 at once. Do not wait for symptoms.',
  'Keep the person calm and still; keep the bitten limb at or just below heart level.',
  'Remove rings, watches and tight clothing before swelling starts.',
  'Do not cut, suck, burn or tie a tight band; do not apply ice or herbal remedies.',
  'Get to a hospital with anti-snake venom as soon as possible.',
];
