// The corrected September weekly plan, used to seed the planner the first
// time it's opened (before anyone has saved an edit yet).
//
// Corrections applied vs. the original draft, per the notes that came with it:
//  - Monday 11:00-12:30 and 2:00-3:30 no longer reference the old exercise
//    class / baby class slots — those moved to Wednesday (Mummy & Baby,
//    11-12) and Thursday (baby yoga, 11:30-12:30) from September.
//  - Monday and Friday evenings (5:30-7:00) now include the dog walk that
//    the "Dog walks" routine allocates to those evenings.

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const TIME_SLOTS = [
  "6:00–7:00",
  "7:00–8:00",
  "8:00–9:00",
  "9:00–10:00",
  "10:00–11:00",
  "11:00–12:30",
  "12:30–2:00",
  "2:00–3:30",
  "3:30–4:30",
  "4:30–5:30",
  "5:30–7:00",
  "7:00–7:30",
  "7:30 onwards",
] as const;

export const DEFAULT_PLAN = {
  grid: {
    "6:00–7:00": {
      Monday: "Oscar wake + feed; Adam takes Oscar where possible so you can sleep",
      Tuesday: "Oscar + feed; dog walk",
      Wednesday: "Oscar + feed",
      Thursday: "Oscar + feed",
      Friday: "Oscar + feed",
      Saturday: "Relaxed morning + Oscar",
      Sunday: "Family morning",
    },
    "7:00–8:00": {
      Monday: "Breakfast, get Imogen ready",
      Tuesday: "Breakfast / morning routine",
      Wednesday: "Breakfast / morning routine",
      Thursday: "Breakfast / morning routine",
      Friday: "Young Voices 7:50 / school routine",
      Saturday: "Breakfast",
      Sunday: "Breakfast",
    },
    "8:00–9:00": {
      Monday: "Imogen school (netball club until 4:20 today); Adam drop-off",
      Tuesday: "School / household reset",
      Wednesday: "School / household reset",
      Thursday: "School / household reset",
      Friday: "School",
      Saturday: "Family time",
      Sunday: "Family time",
    },
    "9:00–10:00": {
      Monday: "Oscar nap / house reset",
      Tuesday: "Oscar nap / dog walk",
      Wednesday: "Oscar nap",
      Thursday: "Oscar nap",
      Friday: "Oscar nap",
      Saturday: "Run 🏃‍♀️",
      Sunday: "Slow morning",
    },
    "10:00–11:00": {
      Monday: "Get ready / household jobs",
      Tuesday: "Housework / errands",
      Wednesday: "Mummy & Baby class 11–12",
      Thursday: "Housework / errands",
      Friday: "Housework / errands",
      Saturday: "Shower / breakfast",
      Sunday: "Bedding + house jobs",
    },
    "11:00–12:30": {
      Monday: "Oscar / housework",
      Tuesday: "Oscar / lunch prep",
      Wednesday: "Mummy & Baby 11–12 + lunch",
      Thursday: "Baby yoga 11:30–12:30",
      Friday: "Oscar / lunch",
      Saturday: "Family time",
      Sunday: "Food shop",
    },
    "12:30–2:00": {
      Monday: "Lunch + Oscar",
      Tuesday: "Lunch + Oscar",
      Wednesday: "Lunch + Oscar",
      Thursday: "Lunch + Oscar",
      Friday: "Lunch + Oscar",
      Saturday: "Lunch",
      Sunday: "Lunch",
    },
    "2:00–3:30": {
      Monday: "Oscar",
      Tuesday: "Oscar / household jobs",
      Wednesday: "Oscar / household jobs",
      Thursday: "Oscar / household jobs",
      Friday: "Oscar / household jobs",
      Saturday: "Family time",
      Sunday: "Family time",
    },
    "3:30–4:30": {
      Monday: "Oscar nap",
      Tuesday: "Oscar nap",
      Wednesday: "Oscar nap",
      Thursday: "Oscar nap",
      Friday: "Oscar nap",
      Saturday: "Family time",
      Sunday: "Family time",
    },
    "4:30–5:30": {
      Monday: "Imogen / after-school routine",
      Tuesday: "Imogen / after-school routine",
      Wednesday: "Imogen / after-school routine",
      Thursday: "Imogen / after-school routine",
      Friday: "Maths club 4:30 (every 3rd week)",
      Saturday: "Family time",
      Sunday: "Family time",
    },
    "5:30–7:00": {
      Monday: "Adam home → dinner + dog walk",
      Tuesday: "Adam home → dog walk / dinner",
      Wednesday: "Adam home → dinner",
      Thursday: "Adam home → dinner",
      Friday: "Adam home → dinner + dog walk",
      Saturday: "Dinner",
      Sunday: "Dinner",
    },
    "7:00–7:30": {
      Monday: "Oscar bedtime routine",
      Tuesday: "Oscar bedtime routine",
      Wednesday: "Oscar bedtime routine",
      Thursday: "Oscar bedtime routine",
      Friday: "Oscar bedtime routine",
      Saturday: "Oscar bedtime",
      Sunday: "Oscar bedtime",
    },
    "7:30 onwards": {
      Monday: "Imogen time / relax",
      Tuesday: "Relax",
      Wednesday: "Relax",
      Thursday: "Relax",
      Friday: "Relax",
      Saturday: "Family evening",
      Sunday: "Prep for week",
    },
  } as Record<string, Record<string, string>>,

  notes: {
    running:
      "Run moved to Saturday morning (main run of the week), not Sunday. " +
      "Other runs are fitted around the week rather than rigidly scheduled. " +
      "Recently progressed from 5K to 6K in 38:43 — aim is gradual progression, not a sudden jump in mileage.",
    oscar:
      "Deliberately flexible around Oscar's naps, since they can be unpredictable / contact naps. " +
      "Rough rhythm: 6:00–6:30 wake → ~9am nap → ~11:30/12 nap → ~3:30/4 nap → ~7:30 bedtime. Feeds remain on demand.",
    housework:
      "Spread through the week rather than one big cleaning day:\n" +
      "Sunday: food shop + wash bedding\n" +
      "Monday: general household reset\n" +
      "Tuesday: laundry / household jobs\n" +
      "Wednesday: lighter jobs\n" +
      "Thursday: Grandma cleans — no need for a full bathroom clean or hoovering\n" +
      "Friday: general reset before the weekend\n" +
      "Saturday: minimal housework",
    dogWalks:
      "Agreed routine: Monday evening, Tuesday morning, Tuesday evening, Friday evening. " +
      "When Imogen isn't available to help, whoever has the dog aims for two walks on the days allocated.",
    imogen:
      "School-term commitments:\n" +
      "Monday: netball until 4:20\n" +
      "Friday morning: Young Voices, 7:50\n" +
      "Friday 4:30: Maths club, every third week\n" +
      "Dancing separately, per her own timetable\n" +
      "Adam can help with school drop-off, especially during the early morning rush.\n\n" +
      "New from September:\n" +
      "Wednesday 11–12: Mummy & Baby class (from 16 September) — replaces the old Wednesday exercise class\n" +
      "Thursday 11:30–12:30: Baby yoga (from 17 September)",
  } as Record<string, string>,

  // Shared recipe box: id -> { name, ingredients[], quick }. A short
  // starter list to pick from rather than an empty box — "quick" ones are
  // realistic for a weeknight with Oscar's bedtime routine at 7; the rest
  // are for when there's more time (weekends).
  recipes: {
    "fish-fingers-mash": {
      name: "Fish fingers, peas & mash",
      ingredients: ["Fish fingers", "Frozen peas", "Potatoes (for mash)", "Butter", "Milk"],
      quick: true,
    },
    "omelette-salad": {
      name: "Omelette & salad",
      ingredients: ["Eggs", "Cheese", "Mixed salad leaves", "Cherry tomatoes", "Cucumber"],
      quick: true,
    },
    "pasta-pesto": {
      name: "Pasta with pesto",
      ingredients: ["Pasta", "Pesto", "Cherry tomatoes", "Parmesan"],
      quick: true,
    },
    "beans-on-toast": {
      name: "Beans on toast",
      ingredients: ["Bread", "Baked beans", "Cheese"],
      quick: true,
    },
    "chicken-quesadillas": {
      name: "Chicken quesadillas",
      ingredients: ["Tortilla wraps", "Cooked chicken", "Cheese", "Peppers", "Salsa"],
      quick: true,
    },
    "stir-fry-noodles": {
      name: "Vegetable stir-fry & noodles",
      ingredients: ["Noodles", "Mixed stir-fry vegetables", "Soy sauce", "Garlic", "Ginger"],
      quick: true,
    },
    "spaghetti-bolognese": {
      name: "Spaghetti Bolognese",
      ingredients: ["Beef mince", "Onion", "Garlic", "Tinned tomatoes", "Tomato purée", "Spaghetti", "Parmesan"],
      quick: false,
    },
    "roast-chicken": {
      name: "Roast chicken & vegetables",
      ingredients: ["Whole chicken", "Potatoes", "Carrots", "Parsnips", "Onion", "Gravy granules"],
      quick: false,
    },
    "chicken-curry": {
      name: "Chicken curry & rice",
      ingredients: ["Chicken thighs", "Onion", "Garlic", "Ginger", "Curry powder", "Tinned tomatoes", "Coconut milk", "Rice"],
      quick: false,
    },
    "shepherds-pie": {
      name: "Shepherd's pie",
      ingredients: ["Lamb mince (or beef)", "Onion", "Carrots", "Peas", "Potatoes (for mash)", "Worcestershire sauce", "Beef stock"],
      quick: false,
    },
  } as Record<string, { name: string; ingredients: string[]; quick: boolean }>,

  // What's planned for lunch/dinner each day. Each value is either null
  // (nothing chosen), { type: "recipe", recipeId } pointing into `recipes`,
  // or { type: "custom", text } for a one-off meal not worth saving as a
  // recipe.
  meals: Object.fromEntries(
    DAYS.map((day) => [day, { lunch: null, dinner: null }]),
  ) as Record<string, { lunch: MealChoice | null; dinner: MealChoice | null }>,

  // The shopping list: a flat checklist. Items either come from
  // "Generate from this week's meals" (source: "meal-plan") or were typed
  // in directly (source: "manual").
  shoppingList: [] as { id: string; text: string; checked: boolean; source: string }[],

  updatedAt: null as string | null,
  updatedBy: null as string | null,
};

type MealChoice = { type: "recipe"; recipeId: string } | { type: "custom"; text: string };
