// The September 2026 weekly plan, imported from the family's own
// spreadsheet (Sheet1 + Meals) and used to seed the planner the first time
// it's opened (before anyone has saved an edit yet). Person tags on grid
// cells were added automatically by matching names mentioned in each
// cell's text (Adam/Jo/Oscar/Imogen/"Family"→All) — not hand-picked, so
// worth a glance.
//
// Saturday and Sunday are laid out more loosely in the source spreadsheet
// than Monday-Friday — entries sit in whichever row had space rather than
// one strictly matching that row's time, so a couple of weekend items
// (Immy's Saturday class, Sunday's family dinner) land under an early-morning
// time label rather than their actual time. Preserved as given; easy to
// drag to a more accurate slot in the app.

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
  "6:00–6:30am",
  "6:45am",
  "7:00am",
  "7:30am",
  "7:15–8:00am",
  "7:40am",
  "8:00am",
  "9:00–9:30am",
  "9:30–10:30am",
  "10:30–11:00am",
  "11:00am–12:00pm",
  "12:00–1:00pm",
  "1:00–2:00pm",
  "2:00–3:00pm",
  "3:00–4:00pm",
  "4:00–5:00pm",
  "5:30pm",
  "5:45pm",
  "6:30–7:30pm",
  "7:30pm onwards",
  "7:45pm",
  "8:00pm",
  "8:15pm onwards",
] as const;

export const DEFAULT_PLAN = {
  grid: {
    "6:00–6:30am": {
      Monday: { text: "🌅 Oscar wakes + breastfeed. Adam showers", people: ["Adam", "Oscar"] },
      Tuesday: { text: "🌅 Oscar wakes + breastfeed. Adam walk dog with Oscar if not raining", people: ["Adam", "Oscar"] },
      Wednesday: { text: "🌅 Oscar wakes + breastfeed.", people: ["Oscar"] },
      Thursday: { text: "🌅 Oscar wakes + breastfeed. Adam showers", people: ["Adam", "Oscar"] },
      Friday: { text: "🌅 Oscar wakes + breastfeed. Adam showers", people: ["Adam", "Oscar"] },
      Saturday: { text: "🏃‍♀️ Run", people: [] },
      Sunday: { text: "🧺 Wash bedding & towels", people: [] },
    },
    "6:45am": {
      Monday: { text: "Imogen up", people: ["Imogen"] },
      Tuesday: { text: "Jo shower, make beds", people: ["Jo"] },
      Wednesday: { text: "Jo shower, make beds, washing out", people: ["Jo"] },
      Thursday: { text: "Imogen up", people: ["Imogen"] },
      Friday: { text: "Imogen up", people: ["Imogen"] },
      Saturday: { text: "Oscar swimming 11-11:20", people: ["Oscar"] },
      Sunday: { text: "🛒 Food shop", people: [] },
    },
    "7:00am": {
      Monday: { text: "Family breakfast", people: ["All"] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "", people: [] },
      Thursday: { text: "Family breakfast", people: ["All"] },
      Friday: { text: "Family breakfast", people: ["All"] },
      Saturday: { text: "Immy BMC - 12:45-13:45", people: ["Imogen"] },
      Sunday: { text: "🍽️ Family dinner", people: ["All"] },
    },
    "7:30am": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "Oscar breakfast", people: ["Oscar"] },
      Wednesday: { text: "Oscar breakfast", people: ["Oscar"] },
      Thursday: { text: "", people: [] },
      Friday: { text: "", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "🌙 Prepare for week", people: [] },
    },
    "7:15–8:00am": {
      Monday: { text: "Imogen get ready, Adam clear up from breakfast, Jo shower, make beds, washing out", people: ["Adam", "Jo", "Imogen"] },
      Tuesday: { text: "Adam get ready, clear up kitchen", people: ["Adam"] },
      Wednesday: { text: "Adam get ready, clear up kitchen", people: ["Adam"] },
      Thursday: { text: "Imogen get ready, Adam clear up from breakfast, Jo shower, make beds", people: ["Adam", "Jo", "Imogen"] },
      Friday: { text: "Imogen get ready, Adam clear up from breakfast, Jo shower, make beds, washing out", people: ["Adam", "Jo", "Imogen"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "House tidy", people: [] },
    },
    "7:40am": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "", people: [] },
      Thursday: { text: "", people: [] },
      Friday: { text: "Adam school drop-off for 07:50 (Young Voices)", people: ["Adam"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "🏃‍♀️ Run", people: [] },
    },
    "8:00am": {
      Monday: { text: "Adam school drop-off for 08:10", people: ["Adam"] },
      Tuesday: { text: "Adam leave for work", people: ["Adam"] },
      Wednesday: { text: "Adam leave for work", people: ["Adam"] },
      Thursday: { text: "Adam school drop-off for 08:10", people: ["Adam"] },
      Friday: { text: "", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "Adam sailing", people: ["Adam"] },
    },
    "9:00–9:30am": {
      Monday: { text: "💤 Oscar nap 1\nTidy downstairs", people: ["Oscar"] },
      Tuesday: { text: "💤 Oscar nap 1\nTidy downstairs", people: ["Oscar"] },
      Wednesday: { text: "💤 Oscar nap 1\nTidy downstairs", people: ["Oscar"] },
      Thursday: { text: "💤 Oscar nap 1\nTidy downstairs", people: ["Oscar"] },
      Friday: { text: "💤 Oscar nap 1\nTidy downstairs", people: ["Oscar"] },
      Saturday: { text: "💤 Oscar nap 1", people: ["Oscar"] },
      Sunday: { text: "💤 Oscar nap 1", people: ["Oscar"] },
    },
    "9:30–10:30am": {
      Monday: { text: "Playtime", people: [] },
      Tuesday: { text: "Laundry / household jobs", people: [] },
      Wednesday: { text: "Light housework", people: [] },
      Thursday: { text: "Laundry / household jobs", people: [] },
      Friday: { text: "General house reset", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "10:30–11:00am": {
      Monday: { text: "Get ready and leave for pushy mums", people: [] },
      Tuesday: { text: "Oscar / household jobs", people: ["Oscar"] },
      Wednesday: { text: "Get ready to go out", people: [] },
      Thursday: { text: "Get ready for baby yoga", people: [] },
      Friday: { text: "Oscar / lunch prep", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "11:00am–12:00pm": {
      Monday: { text: "🏋️ Pushy mums", people: [] },
      Tuesday: { text: "Oscar + lunch prep", people: ["Oscar"] },
      Wednesday: { text: "👶 Mummy & Baby class", people: [] },
      Thursday: { text: "👶 Baby yoga starts 11:30", people: [] },
      Friday: { text: "Oscar + lunch prep", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "12:00–1:00pm": {
      Monday: { text: "Home for lunch\n💤 Oscar nap 2 in car", people: ["Oscar"] },
      Tuesday: { text: "Lunch + Oscar feed", people: ["Oscar"] },
      Wednesday: { text: "Lunch + Oscar feed", people: ["Oscar"] },
      Thursday: { text: "Baby yoga → lunch", people: [] },
      Friday: { text: "Lunch + Oscar feed", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "1:00–2:00pm": {
      Monday: { text: "Playtime", people: [] },
      Tuesday: { text: "💤 Oscar nap 2", people: ["Oscar"] },
      Wednesday: { text: "💤 Oscar nap 2", people: ["Oscar"] },
      Thursday: { text: "💤 Oscar nap 2", people: ["Oscar"] },
      Friday: { text: "💤 Oscar nap 2", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "2:00–3:00pm": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "Oscar / household jobs", people: ["Oscar"] },
      Wednesday: { text: "Oscar / household jobs", people: ["Oscar"] },
      Thursday: { text: "Oscar / household jobs", people: ["Oscar"] },
      Friday: { text: "Oscar / household jobs", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "3:00–4:00pm": {
      Monday: { text: "💤 Oscar nap 3", people: ["Oscar"] },
      Tuesday: { text: "💤 Oscar nap 3", people: ["Oscar"] },
      Wednesday: { text: "💤 Oscar nap 3", people: ["Oscar"] },
      Thursday: { text: "💤 Oscar nap 3", people: ["Oscar"] },
      Friday: { text: "💤 Oscar nap 3", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "4:00–5:00pm": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "Imogen home + snack", people: ["Imogen"] },
      Thursday: { text: "Imogen home + snack", people: ["Imogen"] },
      Friday: { text: "Maths club 4:30 every 3rd week", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "5:30pm": {
      Monday: { text: "Adam home\nOscar dinner", people: ["Adam", "Oscar"] },
      Tuesday: { text: "Adam home\nOscar dinner", people: ["Adam", "Oscar"] },
      Wednesday: { text: "Adam home, make dinner", people: ["Adam"] },
      Thursday: { text: "Adam home", people: ["Adam"] },
      Friday: { text: "Adam home\nOscar dinner", people: ["Adam", "Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "5:45pm": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "🍽️ Family dinner", people: ["All"] },
      Thursday: { text: "🍽️ Family dinner", people: ["All"] },
      Friday: { text: "", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "6:30–7:30pm": {
      Monday: { text: "One person play, bath, bedtime\nOne person walk dog", people: [] },
      Tuesday: { text: "Adam play, bath, bedtime\nJo run", people: ["Adam", "Jo"] },
      Wednesday: { text: "Immy homework, shower & hairwash\nOscar play time, bath, bedtime", people: ["Oscar", "Imogen"] },
      Thursday: { text: "Immy homework, shower\nOscar play time, bath, bedtime", people: ["Oscar", "Imogen"] },
      Friday: { text: "Adam play, bath, bedtime\nJo run", people: ["Adam", "Jo"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "7:30pm onwards": {
      Monday: { text: "🌙 Oscar asleep, dinner", people: ["Oscar"] },
      Tuesday: { text: "🌙 Oscar asleep, dinner\nWalk dog, drop to Chris", people: ["Oscar"] },
      Wednesday: { text: "🌙 Oscar asleep", people: ["Oscar"] },
      Thursday: { text: "🌙 Oscar asleep", people: ["Oscar"] },
      Friday: { text: "🌙 Oscar asleep, dinner\nWalk dog", people: ["Oscar"] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "7:45pm": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "", people: [] },
      Thursday: { text: "Jo leave for tap", people: ["Jo"] },
      Friday: { text: "", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "8:00pm": {
      Monday: { text: "", people: [] },
      Tuesday: { text: "", people: [] },
      Wednesday: { text: "Immy in bed, read, asleep for 8:15.8:30", people: ["Imogen"] },
      Thursday: { text: "Immy in bed, read, asleep for 8:15.8:30", people: ["Imogen"] },
      Friday: { text: "", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
    "8:15pm onwards": {
      Monday: { text: "Tidy up downstairs", people: [] },
      Tuesday: { text: "Tidy up downstairs", people: [] },
      Wednesday: { text: "Tidy up downstairs", people: [] },
      Thursday: { text: "Tidy up downstairs", people: [] },
      Friday: { text: "Tidy up downstairs", people: [] },
      Saturday: { text: "", people: [] },
      Sunday: { text: "", people: [] },
    },
  } as Record<string, Record<string, { text: string; people: string[] }>>,

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

  // Shared recipe box: id -> { name, ingredients[], quick, source }. A short
  // starter list to pick from rather than an empty box, cross-referenced to
  // real BBC Good Food recipes (source links to the original for the full
  // method and exact quantities) — "quick" ones are realistic for a
  // weeknight with Oscar's bedtime routine at 7; the rest are for when
  // there's more time (weekends).
  recipes: {
    "cheese-omelette": {
      name: "Cheese omelette",
      ingredients: ["2 eggs", "1 tbsp butter", "Handful grated cheese", "Black pepper"],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/cheese-omelette",
    },
    "chicken-quesadillas": {
      name: "Chicken quesadillas",
      ingredients: [
        "4 tortilla wraps",
        "4 tbsp salsa",
        "400g tin black beans, drained",
        "2 spring onions, sliced",
        "Cooked chicken, shredded",
        "Grated cheddar",
        "Coriander (optional)",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/chicken-quesadillas",
    },
    "quick-chicken-noodles": {
      name: "Quick chicken noodles",
      ingredients: [
        "2 chicken breasts, sliced",
        "2 tbsp oil",
        "2 garlic cloves, sliced",
        "1 red pepper, sliced",
        "Noodles",
        "Soy sauce",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/quick-chicken-noodles",
    },
    "tomato-pasta": {
      name: "Tomato pasta",
      ingredients: [
        "1 tbsp olive oil",
        "1 garlic clove, crushed",
        "400g tin chopped tomatoes",
        "1 tsp vegetable stock powder (or ½ stock cube)",
        "1 tbsp tomato purée",
        "Few basil leaves",
        "Pasta, to serve",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/tomato-basil-sauce",
    },
    "homemade-fish-fingers": {
      name: "Homemade fish fingers",
      ingredients: [
        "White fish fillets, cut into strips",
        "Plain flour",
        "1 egg, beaten",
        "Breadcrumbs",
        "4 baking potatoes",
        "Frozen peas",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/homemade-fish-fingers",
    },
    "spaghetti-bolognese": {
      name: "Spaghetti Bolognese",
      ingredients: [
        "3 tbsp olive oil",
        "300g beef mince",
        "200g pork mince",
        "2 large shallots, finely chopped",
        "2-3 garlic cloves, crushed",
        "500g passata",
        "1 tbsp tomato purée",
        "Spaghetti, to serve",
        "Parmesan, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/classic-bolognese",
    },
    "roast-chicken-gravy": {
      name: "Roast chicken & gravy",
      ingredients: [
        "1 onion, roughly chopped",
        "2 carrots, roughly chopped",
        "1 free-range chicken (about 1.5kg)",
        "1 lemon",
        "Potatoes, to roast",
        "Gravy granules (or homemade gravy)",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/classic-roast-chicken-gravy",
    },
    "chicken-curry": {
      name: "Chicken curry & rice",
      ingredients: [
        "2 tbsp sunflower oil",
        "1 onion, thinly sliced",
        "3 tbsp medium curry spice paste (tikka works well)",
        "Chicken thighs, diced",
        "Natural yogurt",
        "Rice, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/easy-chicken-curry",
    },
    "shepherds-pie": {
      name: "Shepherd's pie",
      ingredients: [
        "1 large onion, chopped",
        "500g pack lamb mince",
        "Carrots, diced",
        "Frozen peas",
        "Potatoes, for mash",
        "Beef or lamb stock",
        "Worcestershire sauce",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/no-fuss-shepherds-pie",
    },
    "jacket-potato": {
      name: "Jacket potato with cheese & beans",
      ingredients: ["4 baking potatoes", "Oil", "Salt", "Grated cheese", "Baked beans", "Butter"],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/classic-jacket-potatoes",
    },
    "tuna-pasta-bake": {
      name: "Tuna pasta bake",
      ingredients: [
        "Pasta",
        "2 tins tuna, drained",
        "1 tin sweetcorn, drained",
        "Mayonnaise",
        "Grated cheese",
        "Breadcrumbs (optional, for the topping)",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/tuna-pasta-bake",
    },
    "chicken-fajitas": {
      name: "Chicken fajitas",
      ingredients: [
        "2 chicken breasts, sliced",
        "1 red pepper, sliced",
        "1 red onion, sliced",
        "1 tbsp smoked paprika",
        "1 tbsp ground coriander",
        "Pinch ground cumin",
        "2 garlic cloves, crushed",
        "4 tbsp olive oil",
        "Juice of 1 lime",
        "Tortilla wraps, to serve",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/easy-chicken-fajitas",
    },
    "flatbread-pizzas": {
      name: "Flatbread pizzas",
      ingredients: [
        "5 flatbreads",
        "Tomato passata or pizza sauce",
        "Grated mozzarella",
        "Toppings of choice (ham, peppers, sweetcorn, etc.)",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/flatbread-pizzas",
    },
    "tomato-soup": {
      name: "Tomato soup",
      ingredients: [
        "500g ripe tomatoes",
        "1 onion, chopped",
        "1 small carrot, chopped",
        "1 celery stick, chopped",
        "2 tbsp olive oil",
        "2 squirts tomato purée",
        "2 bay leaves",
        "Vegetable stock (bouillon powder)",
        "Bread, to serve",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/tomato-soup",
    },
    "bangers-mash-onion-gravy": {
      name: "Bangers & mash with onion gravy",
      ingredients: [
        "1 tbsp sunflower oil",
        "8 pork sausages",
        "3 small onions, finely sliced",
        "Few sprigs thyme",
        "1 tsp plain flour",
        "1 tbsp red wine vinegar",
        "Splash red wine",
        "Potatoes, for mash",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/bangers-n-mash-with-onion-gravy",
    },
    "classic-lasagne": {
      name: "Lasagne",
      ingredients: [
        "750g lean beef mince",
        "1 onion, chopped",
        "2 garlic cloves, crushed",
        "2 tins chopped tomatoes",
        "200ml beef stock",
        "Lasagne sheets",
        "White sauce (shop-bought or homemade)",
        "Grated cheese",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/classic-lasagne-0",
    },
    "fish-pie": {
      name: "Fish pie",
      ingredients: [
        "400g skinless white fish fillets",
        "400g skinless smoked haddock fillets",
        "2 bay leaves",
        "Milk",
        "Potatoes, for mash",
        "Butter",
        "Plain flour",
        "Frozen peas",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/fish-pie-four-steps",
    },
    "chilli-con-carne": {
      name: "Chilli con carne",
      ingredients: [
        "1 large onion",
        "1 red pepper",
        "1 tbsp oil",
        "1 tsp ground cumin",
        "500g lean minced beef",
        "1 beef stock cube",
        "½ tsp dried marjoram",
        "1 tsp sugar",
        "2 tbsp tomato purée",
        "410g tin red kidney beans",
        "Soured cream, to serve",
        "Rice, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe",
    },
    "toad-in-the-hole": {
      name: "Toad-in-the-hole",
      ingredients: [
        "Plain flour",
        "1 tsp English mustard powder",
        "4 eggs",
        "400ml milk",
        "Few thyme sprigs",
        "8 pork sausages",
        "2 tbsp sunflower oil",
        "2 onions, sliced",
        "Gravy, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/toad-hole-4-easy-steps",
    },
    "macaroni-cheese": {
      name: "Macaroni cheese",
      ingredients: [
        "Macaroni pasta",
        "500ml milk",
        "4 tbsp plain flour",
        "50g butter",
        "100g grated strong cheddar (plus extra for the topping)",
        "Breadcrumbs (optional, for the topping)",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/best-ever-macaroni-cheese-recipe",
    },
    "beef-stew": {
      name: "Beef stew",
      ingredients: [
        "2 celery sticks, thickly sliced",
        "1 onion, chopped",
        "2 large carrots, chopped",
        "Stewing beef, cubed",
        "2 beef stock cubes",
        "Worcestershire sauce",
        "Plain flour",
        "Potatoes, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/beef-vegetable-casserole",
    },
    "chicken-leek-ham-pie": {
      name: "Chicken, leek & ham pie",
      ingredients: [
        "1 tbsp vegetable oil",
        "600g chicken thigh fillets, chopped",
        "60g butter",
        "2 leeks, sliced",
        "2 garlic cloves, crushed",
        "400ml chicken stock",
        "250ml milk",
        "Puff pastry sheet",
        "1 egg, beaten (to glaze)",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/chicken-leek-ham-pie",
    },
    "vegetable-curry": {
      name: "Vegetable curry",
      ingredients: [
        "1 onion, chopped",
        "2 garlic cloves, crushed",
        "Mixed vegetables (potato, cauliflower, peas, etc.)",
        "Curry powder or paste",
        "400g tin chopped tomatoes (or passata)",
        "400ml tin coconut milk",
        "Rice, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/vegetable-curry-crowd",
    },
    "egg-fried-rice": {
      name: "Egg-fried rice",
      ingredients: [
        "3 tbsp vegetable oil",
        "1 onion, finely chopped",
        "4 eggs, beaten",
        "Cooked rice (day-old is best)",
        "2 spring onions, sliced",
        "Soy sauce",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/egg-fried-rice",
    },
    "katsu-curry": {
      name: "Chicken katsu curry",
      ingredients: [
        "2 chicken breasts",
        "100g plain flour",
        "2 eggs, beaten",
        "150g panko breadcrumbs",
        "1 onion, chopped",
        "1 carrot, chopped",
        "1-2 tbsp curry powder",
        "400ml chicken stock",
        "Rice, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/katsu-curry",
    },
    "spaghetti-meatballs": {
      name: "Spaghetti & meatballs",
      ingredients: [
        "400g beef mince",
        "3 tbsp olive oil",
        "4 garlic cloves, crushed",
        "4 tins chopped tomatoes",
        "1 tbsp sugar",
        "Handful flat-leaf parsley",
        "Spaghetti, to serve",
        "Parmesan, to serve",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/spaghetti-meatballs",
    },
    "chicken-traybake": {
      name: "Chicken traybake",
      ingredients: [
        "8 skinless chicken thighs",
        "500g new potatoes, halved",
        "1 red chilli, chopped",
        "3 tbsp tomato purée",
        "3 tbsp olive oil",
        "3 garlic cloves, crushed",
        "4 sprigs thyme",
        "140g pancetta or bacon, chopped",
      ],
      quick: false,
      source: "https://www.bbcgoodfood.com/recipes/amatriciana-chicken-traybake",
    },
    "sausage-pasta": {
      name: "Sausage pasta",
      ingredients: [
        "1 tbsp olive oil",
        "8 pork sausages, cut into chunks",
        "1 large onion, chopped",
        "2 garlic cloves, crushed",
        "400g tin chopped tomatoes",
        "Pasta, to serve",
        "Parmesan, to serve",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/saucy-sausage-pasta-0",
    },
    "minestrone-soup": {
      name: "Minestrone soup",
      ingredients: [
        "1 onion, chopped",
        "2 celery sticks, chopped",
        "1 carrot, chopped",
        "1 courgette, chopped",
        "70g pancetta, chopped (optional)",
        "400g tin cannellini beans",
        "400g tin chopped tomatoes",
        "1 tbsp tomato purée",
        "Vegetable or chicken stock",
        "1 bay leaf",
        "Small pasta shapes",
        "Handful greens (spinach or cabbage)",
      ],
      quick: true,
      source: "https://www.bbcgoodfood.com/recipes/classic-minestrone-soup",
    },

    // Family staples pulled from the household's own meal-idea list — no
    // source link since these aren't from a specific recipe site, just
    // familiar go-tos with a reasonable, simple ingredient list.
    "salmon-veg-boursin": {
      name: "Salmon & veg with boursin",
      ingredients: ["Salmon fillets", "Mixed vegetables", "Boursin cheese", "New potatoes"],
      quick: true,
    },
    "chicken-salad": {
      name: "Chicken salad",
      ingredients: ["Cooked chicken", "Mixed salad leaves", "Cherry tomatoes", "Cucumber", "Dressing"],
      quick: true,
    },
    "steak": {
      name: "Steak",
      ingredients: ["Steak", "Butter", "Potatoes (chips or mash)", "Green vegetables"],
      quick: true,
    },
    "prawn-orzo-pasta": {
      name: "Prawn & orzo pasta",
      ingredients: ["Prawns", "Orzo pasta", "Cherry tomatoes", "Garlic", "Lemon", "Olive oil"],
      quick: true,
    },
    "cheesy-bean-wraps": {
      name: "Cheesy bean wraps",
      ingredients: ["Tortilla wraps", "Baked beans", "Grated cheese"],
      quick: true,
    },
    "chicken-wraps": {
      name: "Chicken wraps",
      ingredients: ["Tortilla wraps", "Cooked chicken", "Salad leaves", "Sauce of choice"],
      quick: true,
    },
    "bagels": {
      name: "Bagels",
      ingredients: ["Bagels", "Cream cheese or filling of choice"],
      quick: true,
    },
    "beany-salad-bowl": {
      name: "Beany salad bowl",
      ingredients: ["Mixed beans (tinned)", "Salad leaves", "Cherry tomatoes", "Cucumber", "Dressing"],
      quick: true,
    },
    "overnight-oats": {
      name: "Overnight oats",
      ingredients: ["Oats", "Milk (or almond milk)", "Yoghurt", "Fruit"],
      quick: true,
    },
    "porridge": {
      name: "Porridge",
      ingredients: ["Oats", "Milk or water", "Honey or sugar"],
      quick: true,
    },
    "scrambled-eggs-toast": {
      name: "Scrambled eggs & toast",
      ingredients: ["Eggs", "Butter", "Bread"],
      quick: true,
    },
    "yoghurt-granola": {
      name: "Yoghurt & granola",
      ingredients: ["Yoghurt", "Granola", "Fruit"],
      quick: true,
    },
  } as Record<string, { name: string; ingredients: string[]; quick: boolean; source?: string }>,

  // What's planned for breakfast/lunch/dinner each day, imported from the
  // Meals sheet's weekly grid. Each value is either null (nothing chosen),
  // { type: "recipe", recipeId } pointing into `recipes`, or
  // { type: "custom", text } for a one-off meal not worth saving as a
  // recipe (e.g. "leftovers"). Breakfast wasn't filled in for specific days
  // in the source, so it's null throughout — the breakfast recipes above
  // are there to pick from whenever.
  meals: {
    Monday: {
      breakfast: null,
      lunch: { type: "recipe", recipeId: "chicken-wraps" },
      dinner: { type: "recipe", recipeId: "salmon-veg-boursin" },
    },
    Tuesday: {
      breakfast: null,
      lunch: { type: "recipe", recipeId: "beany-salad-bowl" },
      dinner: { type: "recipe", recipeId: "chilli-con-carne" },
    },
    Wednesday: {
      breakfast: null,
      lunch: { type: "custom", text: "Leftover chilli" },
      dinner: { type: "recipe", recipeId: "prawn-orzo-pasta" },
    },
    Thursday: {
      breakfast: null,
      lunch: { type: "custom", text: "Leftover orzo / tuna wrap" },
      dinner: { type: "recipe", recipeId: "cheesy-bean-wraps" },
    },
    Friday: {
      breakfast: null,
      lunch: { type: "recipe", recipeId: "beany-salad-bowl" },
      dinner: null,
    },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: {
      breakfast: null,
      lunch: null,
      dinner: { type: "recipe", recipeId: "roast-chicken-gravy" },
    },
  } as Record<string, { breakfast: MealChoice | null; lunch: MealChoice | null; dinner: MealChoice | null }>,

  // The shopping list: a flat checklist, imported from the Meals sheet's
  // list. Items either come from "Generate from this week's meals"
  // (source: "meal-plan") or were typed in directly (source: "manual") —
  // these count as manual since they weren't generated from a recipe.
  shoppingList: [
    "Chicken", "Sausage meat", "Salmon", "Beef", "Prawns", "Chorizo",
    "Milk", "Almond milk", "Yoghurt", "Squeezy yoghurts",
    "Tomatoes", "Spinach", "Potatoes", "Cauliflower", "Bananas", "Berries",
    "Carrots", "Swede", "Broccoli", "Green beans", "Avocados", "Cucumber",
    "Peppers", "Onions", "Celery", "Mushrooms", "Kale",
    "Eggs", "Bread", "Wraps", "Dark chocolate", "Yorkshire puddings",
    "Orzo", "Oat bars", "Crisps", "Loo roll", "Rice cakes",
  ].map((text, i) => ({ id: `seed-shopping-${i}`, text, checked: false, source: "manual" })) as {
    id: string;
    text: string;
    checked: boolean;
    source: string;
  }[],

  updatedAt: null as string | null,
  updatedBy: null as string | null,
};

type MealChoice = { type: "recipe"; recipeId: string } | { type: "custom"; text: string };
