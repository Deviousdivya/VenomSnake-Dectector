// India's "Big Four" medically important snakes - the species most snakebite deaths and injuries are caused by,
// and the ones the standard Indian polyvalent anti-snake venom is made against. General public-health knowledge;
// a photo or a description is never a substitute for hospital care.
export interface BigFourSnake {
  id: 'cobra' | 'krait' | 'russell' | 'sawscaled';
  name: string;
  scientific: string;
  venom: string;
  venomShort: string;
  look: string;
  where: string;
  behaviour: string;
  warning: string;
}

export const bigFour: BigFourSnake[] = [
  {
    id: 'cobra',
    name: 'Indian cobra',
    scientific: 'Naja naja',
    venom: 'Mainly neurotoxic — it can paralyse muscles, including the ones used for breathing — with painful swelling and tissue damage around the bite.',
    venomShort: 'Neurotoxic + local tissue damage',
    look: 'Spreads a wide hood when alarmed; many (not all) have a spectacle-shaped mark on the back of the hood. Colour ranges from brown and yellowish to nearly black.',
    where: 'Farmland, grassland, villages and the edges of towns — wherever rodents live.',
    behaviour: 'Raises its hood and hisses when disturbed. Active by day and at night.',
    warning: 'Drooping eyelids, slurred speech or trouble breathing are signs of nerve poisoning — go to hospital immediately.',
  },
  {
    id: 'krait',
    name: 'Common krait',
    scientific: 'Bungarus caeruleus',
    venom: 'Strongly neurotoxic. A bite can be almost painless with little swelling, while severe weakness and paralysis develop hours later.',
    venomShort: 'Strongly neurotoxic',
    look: 'Glossy blue-black body with thin white cross-bands (often faint near the head) and a ridged back.',
    where: 'Houses, fields and drains across the plains, often near people.',
    behaviour: 'Mostly nocturnal and docile by day. Many bites happen at night to people sleeping on the floor.',
    warning: 'Never wait to "see if it was serious" — a krait bite can look harmless at first. Sleeping under a mosquito net tucked under the bedding helps prevent bites.',
  },
  {
    id: 'russell',
    name: "Russell's viper",
    scientific: 'Daboia russelii',
    venom: 'Disrupts blood clotting and can cause bleeding, severe swelling, shock and kidney injury.',
    venomShort: 'Blood-clotting + kidney damage',
    look: 'Stout, brown to yellowish body with a chain of dark, white-ringed oval blotches and a triangular head.',
    where: 'Grassland, scrub and crop fields, especially at harvest time.',
    behaviour: 'Coils and hisses loudly when disturbed, and strikes fast. Well camouflaged in dry leaves and grass.',
    warning: 'Watch for bleeding gums, blood in urine and rapid swelling spreading up the limb.',
  },
  {
    id: 'sawscaled',
    name: 'Saw-scaled viper',
    scientific: 'Echis carinatus',
    venom: 'Disrupts blood clotting, causing bleeding that can be severe, plus swelling and pain around the bite.',
    venomShort: 'Blood-clotting disruption',
    look: 'Small (usually under 60 cm), sandy to brown with pale zigzag markings and a pale cross or arrow shape on the head.',
    where: 'Dry, rocky and sandy country, scrubland and farmland.',
    behaviour: 'Irritable. Rubs its coils together to make a rasping "saw" sound as a warning.',
    warning: 'It is small and easy to step on in dry ground — wear boots and use a torch at night.',
  },
];

// Real photographs from Wikimedia Commons (licences require the credit to be shown with the photo).
export interface SnakePhotoInfo {
  src: string;
  alt: string;
  author: string;
  license: string;
  page: string;
  position: string; // CSS object-position, keeps the snake in frame when the image is cropped
}

export const bigFourPhotos: Record<BigFourSnake['id'], SnakePhotoInfo> = {
  cobra: { src: '/images/big4-cobra.jpg', alt: 'An Indian cobra rearing up with its hood raised', author: 'Jerzy Strzelecki', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:Cobra,_Naja-naja.jpg', position: '50% 55%' },
  krait: { src: '/images/big4-krait.jpg', alt: 'A common krait, black with thin white cross-bands', author: 'Vaikoovery', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:Common_Krait(Bungarus_Caeruleus)_in_Parassinikadavu_Snake_Park.jpg', position: '50% 65%' },
  russell: { src: '/images/big4-russell.jpg', alt: "A coiled Russell's viper showing its chain of dark oval blotches", author: 'Davidvraju', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Daboia_russelii_2014.jpg', position: '60% 40%' },
  sawscaled: { src: '/images/big4-sawscaled.jpg', alt: 'A saw-scaled viper with rough keeled scales and a pale zig-zag pattern', author: 'Uajith', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:15.Saw_Scaled_Viper.jpg', position: '70% 50%' },
};
