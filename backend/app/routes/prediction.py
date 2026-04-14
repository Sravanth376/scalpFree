"""
ScalpFree – Prediction Router
POST /api/v1/predict  –  accepts an image, returns diagnosis + care info.
"""

import logging
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.services.model_service import ModelService
from app.utils.image_utils import validate_and_load_image

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Response models ───────────────────────────────────────────────────────────

class ScoreItem(BaseModel):
    label: str
    score: float

class DietItem(BaseModel):
    category: str   # "enjoy" | "limit"
    items: List[str]

class RoutineItem(BaseModel):
    day: str
    tasks: List[str]

class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    confidence_pct: str
    severity: str
    overview: str
    symptoms: List[str]
    treatment: List[str]
    lifestyle: List[str]
    diet: List[DietItem]
    weekly_routine: List[RoutineItem]
    specialist: str
    all_scores: List[ScoreItem]


# ── Disease knowledge base ────────────────────────────────────────────────────
# Each entry has actionable clinical-grade information for the UI.

DISEASE_INFO = {
    "Alopecia Areata": {
        "severity": "Moderate",
        "overview": (
            "Alopecia areata is an autoimmune condition in which the immune system "
            "mistakenly attacks hair follicles, resulting in patchy hair loss on the scalp "
            "and sometimes other areas of the body."
        ),
        "symptoms": [
            "Round or oval bald patches on the scalp",
            "Exclamation-mark hairs at patch borders",
            "Nail pitting or ridging",
            "No pain or scarring in affected areas",
        ],
        "treatment": [
            "Topical or intralesional corticosteroid injections",
            "Minoxidil (5%) applied to affected areas",
            "JAK inhibitors (baricitinib, ritlecitinib) for extensive cases",
            "Immunotherapy (DPCP) for refractory disease",
        ],
        "lifestyle": [
            "Reduce stress through mindfulness or yoga",
            "Maintain a balanced diet rich in zinc and biotin",
            "Protect scalp from sun exposure",
            "Avoid tight hairstyles that pull follicles",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Eggs", "Spinach", "Nuts & seeds", "Sweet potato", "Oily fish"]},
            {"category": "limit", "items": ["Alcohol", "Refined sugar", "Processed foods", "Trans fats"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Gentle scalp massage (5 min)", "Apply minoxidil if prescribed", "SPF 30+ on exposed scalp"]},
            {"day": "3× / week", "tasks": ["Mild sulfate-free shampoo", "Stress-reduction activity"]},
            {"day": "Weekly", "tasks": ["Check patch size & document with photo", "Review medication adherence"]},
        ],
        "specialist": "Dermatologist",
    },
    "Contact Dermatitis": {
        "severity": "Mild–Moderate",
        "overview": (
            "Contact dermatitis of the scalp is an inflammatory reaction triggered by direct "
            "contact with an irritant (irritant CD) or allergen (allergic CD), commonly found "
            "in hair dyes, shampoos, or styling products."
        ),
        "symptoms": [
            "Redness, itching, or burning on the scalp",
            "Blistering or weeping in severe cases",
            "Scaling or crusting at reaction sites",
            "Swelling of the scalp or hairline",
        ],
        "treatment": [
            "Identify and eliminate the causative agent",
            "Topical corticosteroids (hydrocortisone 1%) for mild cases",
            "Oral antihistamines to relieve itch",
            "Cool compresses for acute flares",
        ],
        "lifestyle": [
            "Patch-test all new hair products before full use",
            "Choose fragrance-free, hypoallergenic products",
            "Wear gloves when applying hair colour",
            "Rinse scalp thoroughly after product use",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Anti-inflammatory foods", "Omega-3 fish", "Turmeric", "Green leafy veg"]},
            {"category": "limit", "items": ["Nickel-rich foods if allergic", "Alcohol", "Spicy foods during flare"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Rinse scalp with cool water", "Apply prescribed topical if needed", "Avoid known triggers"]},
            {"day": "3× / week", "tasks": ["Gentle fragrance-free shampoo", "Moisturise scalp with bland emollient"]},
            {"day": "Weekly", "tasks": ["Review product ingredients for hidden allergens", "Log symptom severity"]},
        ],
        "specialist": "Dermatologist / Allergist",
    },
    "Folliculitis": {
        "severity": "Mild–Moderate",
        "overview": (
            "Folliculitis is an infection or inflammation of the hair follicles, most commonly "
            "caused by Staphylococcus aureus bacteria. It presents as small, red, pus-filled "
            "bumps around individual follicles on the scalp."
        ),
        "symptoms": [
            "Clusters of red, tender bumps on the scalp",
            "White-tipped pustules around follicles",
            "Itching or burning sensation",
            "Occasional crusting after pustules rupture",
        ],
        "treatment": [
            "Topical antibiotics (mupirocin, clindamycin) for mild cases",
            "Oral antibiotics (cephalexin, doxycycline) for moderate/extensive cases",
            "Antifungal shampoos if Malassezia is suspected",
            "Warm saline compresses to promote drainage",
        ],
        "lifestyle": [
            "Avoid touching or picking at bumps",
            "Use clean pillowcases and towels",
            "Keep scalp dry; avoid prolonged wetness",
            "Do not share combs or hats",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Probiotic foods (yoghurt)", "Vitamin C fruits", "Zinc-rich foods", "Garlic"]},
            {"category": "limit", "items": ["Sugar", "Dairy if flare-prone", "Alcohol", "Refined carbohydrates"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Gentle antibacterial scalp wash", "Warm compress (5–10 min)", "Keep scalp dry after washing"]},
            {"day": "3× / week", "tasks": ["Change pillowcase", "Check for new pustules"]},
            {"day": "Weekly", "tasks": ["Assess treatment response", "Sanitise brushes and combs"]},
        ],
        "specialist": "Dermatologist",
    },
    "Head Lice (Pediculosis Capitis)": {
        "severity": "Mild",
        "overview": (
            "Pediculosis capitis is a highly contagious infestation of the scalp by Pediculus "
            "humanus capitis (head lice). Lice feed on blood and lay eggs (nits) on hair shafts, "
            "causing intense itching."
        ),
        "symptoms": [
            "Intense scalp itching, especially behind ears and at neckline",
            "Visible nits (white-grey eggs) cemented to hair shafts",
            "Crawling sensation on scalp",
            "Scratch marks or secondary infections",
        ],
        "treatment": [
            "Permethrin 1% cream rinse (first-line OTC)",
            "Malathion 0.5% lotion for resistant cases",
            "Wet combing with fine-toothed nit comb every 3 days",
            "Oral ivermectin for treatment-resistant infestations",
        ],
        "lifestyle": [
            "Avoid head-to-head contact with infested individuals",
            "Wash bedding, hats, and towels in hot water (≥55°C)",
            "Do not share combs, hair accessories, or helmets",
            "Notify close contacts (school, household) for treatment",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Immune-boosting foods", "Vitamin E nuts", "Fruits and vegetables"]},
            {"category": "limit", "items": ["No specific dietary restrictions required"]},
        ],
        "weekly_routine": [
            {"day": "Daily (treatment week)", "tasks": ["Apply prescribed treatment", "Wet comb entire scalp", "Check all household members"]},
            {"day": "Every 3 days", "tasks": ["Wet comb session until clear", "Check for live lice"]},
            {"day": "Weekly", "tasks": ["Launder bedding", "Inspect scalp for reinfestation"]},
        ],
        "specialist": "GP / Paediatrician",
    },
    "Lichen Planus": {
        "severity": "Moderate–Severe",
        "overview": (
            "Lichen planopilaris (LPP) is a primary inflammatory scarring alopecia in which "
            "the immune system destroys hair follicles, leading to permanent hair loss if "
            "untreated. It is the scalp variant of lichen planus."
        ),
        "symptoms": [
            "Perifollicular redness and scaling",
            "Burning or tender scalp",
            "Progressive smooth scarred patches",
            "Loss of follicular openings in affected areas",
        ],
        "treatment": [
            "Potent topical corticosteroids as first-line",
            "Intralesional triamcinolone injections",
            "Hydroxychloroquine or mycophenolate mofetil for refractory disease",
            "Doxycycline (anti-inflammatory dose) in some cases",
        ],
        "lifestyle": [
            "Avoid trauma to the scalp (tight braids, heat tools)",
            "Manage stress which can trigger flares",
            "Use gentle, pH-balanced scalp cleansers",
            "Regular dermatology monitoring to track progression",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Anti-inflammatory diet", "Berries", "Leafy greens", "Olive oil", "Fatty fish"]},
            {"category": "limit", "items": ["Gluten (some patients benefit)", "Dairy", "Processed foods", "Sugar"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Apply topical steroid to active areas", "Gentle scalp moisturiser", "Sun protection for scalp"]},
            {"day": "3× / week", "tasks": ["Mild non-irritating shampoo", "Scalp check for new lesions"]},
            {"day": "Monthly", "tasks": ["Dermatology review appointment", "Photographic documentation of patches"]},
        ],
        "specialist": "Dermatologist",
    },
    "Male Pattern Baldness": {
        "severity": "Chronic/Progressive",
        "overview": (
            "Androgenetic alopecia (AGA) is the most common form of hair loss, driven by "
            "genetic sensitivity of follicles to dihydrotestosterone (DHT). It follows a "
            "predictable pattern (Hamilton-Norwood scale in men)."
        ),
        "symptoms": [
            "Gradual thinning at the temples and crown",
            "Receding hairline in an 'M' shape",
            "Miniaturisation of hair follicles",
            "No scalp inflammation or scarring",
        ],
        "treatment": [
            "Minoxidil 5% foam or solution (topical, daily)",
            "Finasteride 1 mg oral (DHT inhibitor)",
            "Low-level laser therapy (LLLT) devices",
            "Platelet-rich plasma (PRP) injections",
            "Hair transplantation (FUE/FUT) for advanced cases",
        ],
        "lifestyle": [
            "Start treatment early for best results",
            "Reduce heat styling and harsh chemical treatments",
            "Manage stress and ensure adequate sleep",
            "Maintain healthy BMI (obesity linked to faster progression)",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Protein-rich foods", "Iron-rich leafy greens", "Biotin (eggs, nuts)", "Omega-3 (salmon)", "Pumpkin seeds"]},
            {"category": "limit", "items": ["High-glycaemic foods", "Alcohol", "Processed junk food", "Excess vitamin A supplements"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Apply minoxidil (morning & night)", "Take finasteride if prescribed", "Scalp massage (5 min)"]},
            {"day": "3× / week", "tasks": ["Mild volumising shampoo", "Avoid tight hairstyles"]},
            {"day": "Quarterly", "tasks": ["Progress photos (same lighting)", "Trichoscopy review with dermatologist"]},
        ],
        "specialist": "Dermatologist / Trichologist",
    },
    "Psoriasis": {
        "severity": "Moderate–Severe",
        "overview": (
            "Scalp psoriasis is a chronic autoimmune condition causing rapid skin cell turnover, "
            "resulting in thick, silvery-white plaques on the scalp. It may extend beyond the "
            "hairline and is often associated with nail and joint involvement."
        ),
        "symptoms": [
            "Thick, silvery-white scales on the scalp",
            "Red, inflamed skin beneath scales",
            "Intense itching and flaking",
            "Temporary hair loss in severe cases",
        ],
        "treatment": [
            "Coal tar shampoos (T/Gel, Neutrogena T/Sal)",
            "Topical corticosteroids (betamethasone valerate)",
            "Calcipotriol (vitamin D analogue) scalp solution",
            "Biologics (secukinumab, ixekizumab) for moderate–severe disease",
            "Phototherapy (UVB) for widespread involvement",
        ],
        "lifestyle": [
            "Avoid scratching to prevent Koebner phenomenon",
            "Use fragrance-free, moisturising shampoos",
            "Manage stress (major trigger)",
            "Limit alcohol and smoking",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Omega-3 fatty acids", "Colourful vegetables", "Turmeric", "Ginger", "Whole grains"]},
            {"category": "limit", "items": ["Alcohol", "Red meat", "Dairy", "Gluten (if sensitive)", "Nightshades"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Apply medicated scalp treatment", "Moisturise scalp post-wash", "Stress management activity"]},
            {"day": "3× / week", "tasks": ["Coal tar or salicylic acid shampoo", "Gentle scale removal"]},
            {"day": "Weekly", "tasks": ["Assess flare triggers", "Check body for new plaques"]},
        ],
        "specialist": "Dermatologist",
    },
    "Ringworm (Tinea Capitis)": {
        "severity": "Mild–Moderate",
        "overview": (
            "Tinea capitis is a fungal infection of the scalp caused by dermatophytes "
            "(Trichophyton or Microsporum species). It is most common in children and presents "
            "as scaly, itchy patches with associated hair breakage or loss."
        ),
        "symptoms": [
            "Scaly, circular patches of hair loss",
            "Broken hair stubs ('black dot' pattern)",
            "Inflamed boggy mass (kerion) in severe cases",
            "Tender cervical lymph nodes",
        ],
        "treatment": [
            "Oral griseofulvin (first-line, 6–12 weeks)",
            "Terbinafine oral as alternative in older children/adults",
            "Selenium sulphide or ketoconazole shampoo (adjunct only)",
            "Treat asymptomatic carriers in the household",
        ],
        "lifestyle": [
            "Do not share combs, hats, or pillowcases",
            "Wash bedding and towels in hot water",
            "Keep scalp clean and dry",
            "Exclude from school until treatment started (local guidelines apply)",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Probiotic yoghurt", "Garlic", "Vitamin C foods", "Zinc-rich seeds"]},
            {"category": "limit", "items": ["Sugar (feeds fungal growth)", "Refined carbohydrates", "Alcohol"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Oral antifungal medication", "Antifungal shampoo twice-daily", "Wash all head coverings"]},
            {"day": "Every 3 days", "tasks": ["Check household members for symptoms", "Change pillowcase"]},
            {"day": "Weekly", "tasks": ["Monitor for secondary bacterial infection", "Dermatology follow-up"]},
        ],
        "specialist": "Dermatologist / Paediatrician",
    },
    "Seborrheic Dermatitis": {
        "severity": "Mild–Moderate",
        "overview": (
            "Seborrheic dermatitis is a common inflammatory skin condition driven by an "
            "overgrowth of Malassezia yeast on sebum-rich areas. It causes flaky dandruff, "
            "greasy scales, and redness primarily on the scalp, face, and chest."
        ),
        "symptoms": [
            "White or yellowish greasy flakes (dandruff)",
            "Red, inflamed scalp skin",
            "Itching that worsens in winter or under stress",
            "Crusty patches at hairline, eyebrows, or nasolabial folds",
        ],
        "treatment": [
            "Ketoconazole 2% shampoo (Nizoral) twice weekly",
            "Zinc pyrithione shampoo for maintenance",
            "Selenium sulphide shampoo for resistant cases",
            "Topical corticosteroids for acute flares",
            "Ciclopirox olamine as antifungal alternative",
        ],
        "lifestyle": [
            "Shampoo regularly to control sebum and yeast",
            "Manage stress levels (stress worsens flares)",
            "Avoid cold, dry environments where possible",
            "Do not use heavy, oil-based scalp products",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Probiotic foods", "Omega-3 fish", "Zinc-rich pumpkin seeds", "Green tea", "Leafy vegetables"]},
            {"category": "limit", "items": ["Sugar", "Refined carbohydrates", "Alcohol", "Dairy", "High-fat processed foods"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Medicated shampoo lather (leave 3 min)", "Avoid scratching", "Stress management"]},
            {"day": "3× / week", "tasks": ["Full scalp wash with medicated shampoo", "Light scalp massage"]},
            {"day": "Weekly", "tasks": ["Assess flake severity", "Check eyebrows and ears for spread"]},
        ],
        "specialist": "Dermatologist",
    },
    "Telogen Effluvium": {
        "severity": "Mild–Moderate",
        "overview": (
            "Telogen effluvium is diffuse hair shedding caused by a shift of hair follicles "
            "into the resting (telogen) phase following a physiological stressor such as illness, "
            "childbirth, nutritional deficiency, or extreme psychological stress."
        ),
        "symptoms": [
            "Diffuse thinning across the entire scalp",
            "Increased daily hair shedding (>100 strands/day)",
            "Hair coming out in clumps during washing or brushing",
            "Absence of visible scalp inflammation or bald patches",
        ],
        "treatment": [
            "Identify and address the underlying trigger",
            "Iron, ferritin, zinc, vitamin D supplementation if deficient",
            "Minoxidil 5% to support regrowth",
            "Scalp PRP injections in chronic cases",
        ],
        "lifestyle": [
            "Reduce stressors and prioritise sleep",
            "Eat a protein-rich, nutrient-dense diet",
            "Avoid aggressive brushing on wet hair",
            "Be patient – regrowth typically starts within 3–6 months",
        ],
        "diet": [
            {"category": "enjoy", "items": ["Lean protein (chicken, legumes)", "Iron-rich foods (spinach, lentils)", "Biotin eggs", "Zinc nuts", "Vitamin D (sunlight, fish)"]},
            {"category": "limit", "items": ["Crash dieting", "Alcohol", "Caffeine excess", "Ultra-processed foods"]},
        ],
        "weekly_routine": [
            {"day": "Daily", "tasks": ["Nutritional supplements (if prescribed)", "Gentle detangling with wide-tooth comb", "8+ hours sleep"]},
            {"day": "3× / week", "tasks": ["Mild volumising shampoo", "Stress relief (yoga, meditation)"]},
            {"day": "Monthly", "tasks": ["Photograph scalp density", "Blood panel check (ferritin, TSH, Vit D)", "Trichologist review"]},
        ],
        "specialist": "Dermatologist / Trichologist",
    },
}


# ── Route ─────────────────────────────────────────────────────────────────────

@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Upload a scalp image and receive:
    - Predicted disease name
    - Confidence score
    - Full care recommendations
    """
    # Validate & load image
    image = await validate_and_load_image(file)

    # Run inference
    try:
        result = ModelService.predict(image)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Inference failed: %s", exc)
        raise HTTPException(status_code=500, detail="Model inference failed. Please try again.")

    disease = result["disease"]
    confidence = result["confidence"]
    info = DISEASE_INFO.get(disease, {})

    return PredictionResponse(
        disease=disease,
        confidence=confidence,
        confidence_pct=f"{confidence * 100:.1f}%",
        severity=info.get("severity", "Unknown"),
        overview=info.get("overview", ""),
        symptoms=info.get("symptoms", []),
        treatment=info.get("treatment", []),
        lifestyle=info.get("lifestyle", []),
        diet=info.get("diet", []),
        weekly_routine=info.get("weekly_routine", []),
        specialist=info.get("specialist", "Dermatologist"),
        all_scores=result["all_scores"],
    )
