export const diseaseDetails: Record<
  string,
  {
    description: string;
    symptoms: string[];
    careTips: string[];
  }
> = {
  "Alopecia Areata": {
    description:
      "Alopecia Areata is an autoimmune condition where the immune system attacks hair follicles, causing sudden hair loss in patches.",
    symptoms: [
      "Round or oval bald patches",
      "Sudden hair loss",
      "Tingling or itching scalp",
    ],
    careTips: [
      "Consult a dermatologist early",
      "Avoid tight hairstyles",
      "Maintain good scalp hygiene",
    ],
  },

  "Contact Dermatitis": {
    description:
      "Contact Dermatitis is an allergic reaction caused by exposure to chemicals, hair products, or metals.",
    symptoms: [
      "Red or inflamed scalp",
      "Itching or burning",
      "Blisters or swelling",
    ],
    careTips: [
      "Stop using suspected hair products",
      "Use mild, fragrance-free shampoo",
      "Avoid scratching the scalp",
    ],
  },

  "Folliculitis": {
    description:
      "Folliculitis is an infection or inflammation of hair follicles, often caused by bacteria or fungi.",
    symptoms: [
      "Small red bumps or pimples",
      "Pus-filled blisters",
      "Tender or painful scalp",
    ],
    careTips: [
      "Keep scalp clean and dry",
      "Avoid tight headwear",
      "Use medicated shampoo if advised",
    ],
  },

  "Head Lice": {
    description:
      "Head Lice are tiny insects that live on the scalp and feed on blood, commonly spreading through close contact.",
    symptoms: [
      "Intense itching",
      "Tickling sensation on scalp",
      "Visible lice or eggs (nits)",
    ],
    careTips: [
      "Use anti-lice shampoo as directed",
      "Wash bedding and clothes in hot water",
      "Avoid sharing combs or hats",
    ],
  },

  "Lichen Planus": {
    description:
      "Lichen Planus is an inflammatory condition that can affect the scalp, leading to irritation and hair loss.",
    symptoms: [
      "Purple or reddish patches",
      "Scalp irritation",
      "Hair thinning or loss",
    ],
    careTips: [
      "Seek dermatological treatment",
      "Avoid scalp trauma",
      "Use prescribed topical medications",
    ],
  },

  "Male Pattern Baldness": {
    description:
      "Male Pattern Baldness is a genetic condition causing gradual hair thinning and receding hairline.",
    symptoms: [
      "Receding hairline",
      "Thinning at the crown",
      "Gradual hair loss",
    ],
    careTips: [
      "Consider medical treatments early",
      "Maintain a healthy diet",
      "Avoid excessive heat styling",
    ],
  },

  "Psoriasis": {
    description:
      "Psoriasis is a chronic autoimmune condition causing rapid skin cell buildup on the scalp.",
    symptoms: [
      "Thick silvery scales",
      "Dry cracked scalp",
      "Itching or burning sensation",
    ],
    careTips: [
      "Use medicated coal-tar or salicylic shampoos",
      "Avoid scratching",
      "Manage stress levels",
    ],
  },

  "Seborrheic Dermatitis": {
    description:
      "Seborrheic Dermatitis causes dandruff and redness due to excess oil production and yeast growth.",
    symptoms: [
      "Flaky dandruff",
      "Greasy yellow scales",
      "Red patches",
    ],
    careTips: [
      "Wash scalp regularly with anti-dandruff shampoo",
      "Avoid oily hair products",
      "Rinse scalp thoroughly",
    ],
  },

  "Telogen Effluvium": {
    description:
      "Telogen Effluvium is temporary hair shedding caused by stress, illness, or hormonal changes.",
    symptoms: [
      "Sudden hair shedding",
      "Thinning hair",
      "Hair loss after stress or illness",
    ],
    careTips: [
      "Reduce physical and emotional stress",
      "Maintain balanced nutrition",
      "Hair regrowth usually occurs naturally",
    ],
  },

  "Tinea Capitis": {
    description:
      "Tinea Capitis is a contagious fungal infection of the scalp, common in children.",
    symptoms: [
      "Patchy hair loss",
      "Scaly or flaky scalp",
      "Red or inflamed areas",
    ],
    careTips: [
      "Use antifungal shampoo as prescribed",
      "Avoid sharing combs or towels",
      "Keep scalp clean and dry",
    ],
  },

  /* FALLBACK */
  Unknown: {
    description:
      "The scalp condition could not be clearly identified. Please consult a dermatologist.",
    symptoms: ["No reliable symptoms detected"],
    careTips: ["Seek professional medical advice"],
  },
};
