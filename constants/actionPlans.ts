export const actionPlans: Record<
  string,
  {
    immediate: string[];
    avoid: string[];
    treatment: string[];
    dietRecommended: string[];
    dietAvoid: string[];
    recovery: string;
    doctorAdvice: string;
  }
> = {
  "Alopecia Areata": {
    immediate: [
      "Avoid hair pulling or stress on scalp",
      "Use mild shampoo",
    ],
    avoid: ["Tight hairstyles", "Chemical treatments"],
    treatment: ["Topical corticosteroids", "Minoxidil (if prescribed)"],
    dietRecommended: [
      "Protein-rich foods (eggs, lentils)",
      "Iron-rich foods (spinach, dates)",
      "Biotin sources (nuts, seeds)",
    ],
    dietAvoid: [
      "Excess sugar",
      "Junk food",
    ],
    recovery: "Hair regrowth may take several months",
    doctorAdvice: "Consult dermatologist if hair loss spreads",
  },

  "Contact Dermatitis": {
    immediate: [
      "Stop using new hair products",
      "Rinse scalp with mild shampoo",
    ],
    avoid: ["Fragrances", "Hair dyes"],
    treatment: ["Anti-inflammatory creams", "Antihistamines"],
    dietRecommended: [
      "Vitamin C rich fruits",
      "Plenty of water",
    ],
    dietAvoid: [
      "Spicy food",
      "Alcohol",
    ],
    recovery: "Improves within 1–2 weeks",
    doctorAdvice: "See doctor if swelling worsens",
  },

  "Folliculitis": {
    immediate: ["Keep scalp clean", "Avoid scratching"],
    avoid: ["Sharing towels", "Sweaty headwear"],
    treatment: ["Antibacterial shampoo", "Topical antibiotics"],
    dietRecommended: [
      "Probiotic foods (curd, yogurt)",
      "Zinc-rich foods",
    ],
    dietAvoid: [
      "Oily fast food",
      "Sugary drinks",
    ],
    recovery: "Clears within 7–14 days",
    doctorAdvice: "Consult doctor if pus develops",
  },

  "Head Lice": {
    immediate: ["Start anti-lice treatment", "Wash bedding"],
    avoid: ["Sharing combs", "Close head contact"],
    treatment: ["Medicated lice shampoo", "Nit removal"],
    dietRecommended: [
      "Balanced diet",
      "Hydration",
    ],
    dietAvoid: [
      "No specific food restrictions",
    ],
    recovery: "Clears in 1 week",
    doctorAdvice: "Doctor visit if lice persist",
  },

  "Lichen Planus": {
    immediate: ["Avoid scalp irritation"],
    avoid: ["Scratching", "Styling tools"],
    treatment: ["Corticosteroid lotions"],
    dietRecommended: [
      "Anti-inflammatory foods",
      "Omega-3 rich foods (fish, flaxseed)",
    ],
    dietAvoid: [
      "Processed foods",
      "Fried items",
    ],
    recovery: "May take months",
    doctorAdvice: "Dermatologist consultation required",
  },

  "Male Pattern Baldness": {
    immediate: ["Track hair loss", "Maintain scalp hygiene"],
    avoid: ["Smoking", "Poor sleep"],
    treatment: ["Minoxidil", "Finasteride"],
    dietRecommended: [
      "Protein-rich diet",
      "Vitamin D sources",
    ],
    dietAvoid: [
      "Excess caffeine",
      "Sugary snacks",
    ],
    recovery: "Progressive condition",
    doctorAdvice: "Consult for long-term management",
  },

  "Psoriasis": {
    immediate: ["Moisturize scalp", "Reduce stress"],
    avoid: ["Scratching plaques"],
    treatment: ["Coal tar shampoo", "Topical steroids"],
    dietRecommended: [
      "Anti-inflammatory diet",
      "Fruits and vegetables",
    ],
    dietAvoid: [
      "Red meat",
      "Alcohol",
    ],
    recovery: "Chronic with flare-ups",
    doctorAdvice: "Doctor visit for severe flare",
  },

  "Seborrheic Dermatitis": {
    immediate: ["Wash scalp regularly"],
    avoid: ["Greasy products"],
    treatment: ["Ketoconazole shampoo"],
    dietRecommended: [
      "Vitamin B rich foods",
      "Green vegetables",
    ],
    dietAvoid: [
      "Sugary foods",
      "Refined carbs",
    ],
    recovery: "Improves in weeks",
    doctorAdvice: "Consult if severe",
  },

  "Telogen Effluvium": {
    immediate: ["Reduce stress", "Improve sleep"],
    avoid: ["Crash diets"],
    treatment: ["Nutritional supplements"],
    dietRecommended: [
      "Iron-rich foods",
      "Protein intake",
    ],
    dietAvoid: [
      "Extreme dieting",
    ],
    recovery: "Hair regrowth in 3–6 months",
    doctorAdvice: "Doctor visit if persistent",
  },

  "Tinea Capitis": {
    immediate: ["Start antifungal treatment"],
    avoid: ["Sharing towels"],
    treatment: ["Oral antifungal medication"],
    dietRecommended: [
      "Immune-boosting foods",
      "Vitamin A & C foods",
    ],
    dietAvoid: [
      "Sugary foods",
    ],
    recovery: "Clears in 4–8 weeks",
    doctorAdvice: "Doctor consultation mandatory",
  },

  Unknown: {
    immediate: ["Monitor symptoms"],
    avoid: ["Self-medication"],
    treatment: ["Consult dermatologist"],
    dietRecommended: ["Balanced diet"],
    dietAvoid: ["Unknown triggers"],
    recovery: "Varies",
    doctorAdvice: "Medical evaluation advised",
  },
};
