// TODO: replace with real product photography if needed (currently populated with high-quality fashion assets from Unsplash)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  tags?: string[];
  subType?: string;
  colorTag?: string;
  audience?: "women" | "men" | "unisex";
}

export const products: Product[] = [
  {
    id: "summer-floral-dress",
    name: "preview dress",
    description: "A gorgeous, lightweight summer dress crafted from highly breathable organic cotton. Featuring an elegant A-line silhouette, delightful floral prints, and a delicately smocked bodice, it is perfect for styling with strappy sandals on sunny beach strolls or during garden tea parties.",
    price: 36000.00,
    compareAtPrice: 52000.00,
    category: "",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#FF5790", "#004CFF", "#202020"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 284,
    tags: ["New Arrival", "Best Seller"],
    subType: "dress",
    colorTag: "#ff5790",
    audience: "women"
  },
  {
    id: "classic-heels",
    name: "preview heels",
    description: "Handcrafted from buttery-soft premium calfskin, these timeless stilettos feature a sleek pointed toe, a supportive memory-foam footbed, and a perfectly balanced 3.5-inch heel designed for effortless, comfortable transition from daytime business meetings to evening soirées.",
    price: 58500.00,
    compareAtPrice: 82500.00,
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#202020", "#FF5790", "#F5F5F5"],
    sizes: ["36", "37", "38", "39", "40"],
    rating: 4.7,
    reviewCount: 94,
    tags: ["Classic", "Staff Pick"],
    audience: "women"
  },
  {
    id: "leather-tote",
    name: "preview bag",
    description: "Re-imagining a classic silhouette, this spacious tote bag features scratch-resistant Saffiano genuine leather, robust top handles, a secure zippered main compartment, a padded divider pocket designed for a 14-inch laptop, and convenient brass feet.",
    price: 97500.00,
    compareAtPrice: 142500.00,
    category: "bags",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#5D4037", "#202020", "#c7c7c7"],
    sizes: ["One Size"],
    rating: 4.8,
    reviewCount: 165,
    tags: ["Best Seller", "Everyday"],
    audience: "women"
  },
  {
    id: "casual-shirt",
    name: "preview casual shirt",
    description: "A crisp oversized cotton shirt with relaxed tailoring, softly dropped shoulders, and a clean finish that works for errands, office layering, and easy weekend dressing.",
    price: 28500.00,
    compareAtPrice: 34000.00,
    category: "casual-clothes",
    images: [
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#f5f5f5", "#202020"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 48,
    colorTag: "#f5f5f5",
    subType: "casual",
    tags: ["New Arrival", "Casual"],
    audience: "women"
  },
  {
    id: "casual-set",
    name: "preview casual set",
    description: "A laid-back matching jersey set with a soft hand feel, relaxed fit shorts, and a matching tee that gives off an effortlessly put-together look.",
    price: 32500.00,
    compareAtPrice: 39500.00,
    category: "casual-clothes",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#202020", "#6e7a8a"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 36,
    colorTag: "#202020",
    subType: "casual",
    tags: ["New Arrival", "Weekend"],
    audience: "women"
  },
  {
    id: "casual-trousers",
    name: "preview casual trousers",
    description: "Tailored yet relaxed trousers in a breathable fabric blend, finished with a flattering high rise and clean front crease for elevated everyday wear.",
    price: 29800.00,
    compareAtPrice: 35500.00,
    category: "casual-clothes",
    images: [
      "https://images.unsplash.com/photo-1506629905607-07b5fdd2f5b7?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#1f3f8b", "#202020"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewCount: 29,
    colorTag: "#1f3f8b",
    subType: "casual",
    tags: ["New Arrival", "Smart Casual"],
    audience: "women"
  },
  {
    id: "casual-knit",
    name: "preview casual knit",
    description: "A soft ribbed knit top with a relaxed neckline and versatile shape, ideal for layering over denim, skirts, or wide-leg trousers.",
    price: 24500.00,
    compareAtPrice: 29500.00,
    category: "casual-clothes",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#f5f5f5", "#ff5790"],
    sizes: ["S", "M", "L"],
    rating: 4.7,
    reviewCount: 31,
    colorTag: "#f5f5f5",
    subType: "casual",
    tags: ["New Arrival", "Lounge"],
    audience: "women"
  },
  {
    id: "casual-linen",
    name: "preview casual linen",
    description: "A breathable linen co-ord with a fluid silhouette and understated details, perfect for hot Lagos days and easy elevated styling.",
    price: 36200.00,
    compareAtPrice: 42000.00,
    category: "casual-clothes",
    images: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#e7e2d8", "#202020"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 24,
    colorTag: "#e7e2d8",
    subType: "casual",
    tags: ["New Arrival", "Linen"],
    audience: "women"
  },
  {
    id: "white-sneakers",
    name: "preview heels",
    description: "Clean, understated, and versatile sneakers crafted with a premium full-grain leather upper, metal eyelets, detailed marginal stitching, and a durable vulcanized rubber cupsole. Features an antibacterial Ortholite insole for supreme day-long walking convenience.",
    price: 48000.00,
    compareAtPrice: 67500.00,
    category: "",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#F5F5F5", "#202020"],
    sizes: ["37", "38", "39", "40", "41"],
    rating: 4.7,
    reviewCount: 142,
    tags: ["Trending", "Athleisure"],
    audience: "women"
  },
  {
    id: "lace-slip-dress",
    name: "preview dress",
    description: "Crafted from liquid-drape luxurious satin silk, this romantic slip dress is finished with a delicate scalloped Chantilly lace trim along the V-neckline and back cutout. Outfitted with adjustable crossover spaghetti shoulder straps for a custom fit.",
    price: 24300.00,
    compareAtPrice: 27000.00,
    category: "lingerie",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["#FF5790", "#202020"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.6,
    reviewCount: 75,
    tags: ["Premium", "Lingerie Collection"],
    subType: "dress",
    colorTag: "#ff5790",
    audience: "women"
  },
  // GROUP 1: Blush Pink (#ff5790)
  {
    id: "dr-001",
    name: "preview dress",
    description: "Cut from luxuriously soft fabric with a flattering silhouette that cinches at all the right places, this versatile dress transitions seamlessly from office sophistication to evening elegance.",
    price: 49500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 45,
    subType: "dress",
    colorTag: "#ff5790",
    audience: "women"
  },
  {
    id: "dr-014",
    name: "preview dress",
    description: "A gorgeous premium georgette wrap dress with a beautifully fitted waist, playful ruffle details along the hem, and soft bishop sleeves. Ideal for daytime brunches or sunset cocktail hours.",
    price: 36000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 38,
    subType: "dress",
    colorTag: "#ff5790"
  },
  {
    id: "tp-002",
    name: "preview two-piece",
    description: "A relaxed-fit modern two-piece made from high-grade French linen. Includes a breezy cropped button-up shirt and matching high-waisted wide-leg trousers for a chic, ready-to-wear look.",
    price: 45000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 52,
    subType: "two-piece",
    colorTag: "#ff5790",
    audience: "women"
  },
  {
    id: "tp-009",
    name: "preview two-piece",
    description: "A modern matching set that offers endless styling possibilities, allowing you to wear the pieces together for a polished look or separately to maximize your wardrobe.",
    price: 48000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewCount: 29,
    subType: "two-piece",
    colorTag: "#ff5790",
    audience: "women"
  },
  {
    id: "dr-021",
    name: "preview dress",
    description: "An effortless 100% fine cotton slip dress adorned with delicate lace accents along the straps and portrait back. Soft, highly breathable, and styled perfectly with single strap slippers.",
    price: 33000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.5,
    reviewCount: 19,
    subType: "dress",
    colorTag: "#ff5790",
    audience: "women"
  },
  {
    id: "tp-015",
    name: "preview two-piece",
    description: "A premium ultra-soft knit co-ord set. Features a sculpted halter-neck knit tank top and a sleek high-waisted ribbed midi skirt that wonderfully contours your body shape.",
    price: 52000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539008835151-34340d043b35?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5790"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 41,
    subType: "two-piece",
    colorTag: "#ff5790",
    audience: "women"
  },

  // GROUP 2: Sage Green (#7a9b76)
  {
    id: "dr-003",
    name: "preview dress",
    description: "Woven from premium cotton-linen blend in organic sage green. Features a sophisticated sweetheart neckline, a smocked back panel for a perfect bust fit, and tiered flowy skirt.",
    price: 38500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 61,
    subType: "dress",
    colorTag: "#7a9b76"
  },
  {
    id: "dr-010",
    name: "preview dress",
    description: "An elegant evening dress crafted in heavy sage satin. Boasting a beautiful cowled back cutout and adjustable thin straps, it falls effortlessly to the floor in a sleek A-line design.",
    price: 55000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1622445262465-24819af52162?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 34,
    subType: "dress",
    colorTag: "#7a9b76"
  },
  {
    id: "dr-018",
    name: "preview dress",
    description: "Lightweight and fully lined sundress with pretty frilled straps and a delightful three-tiered design that makes summer styling a breezy joy.",
    price: 39000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 22,
    subType: "dress",
    colorTag: "#7a9b76"
  },
  {
    id: "tp-004",
    name: "preview two-piece",
    description: "A lovely warm-weather matching set. Features a loose-fit button-up short-sleeve shirt with wooden buttons and breezy matching shorts with a comfy elastic waist.",
    price: 42000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviewCount: 18,
    subType: "two-piece",
    colorTag: "#7a9b76"
  },
  {
    id: "tp-011",
    name: "preview two-piece",
    description: "Extremely soft ribbed lounge set including a breathable scoop-neck crop top and matching high-waisted wide-leg lounge trousers designed for elevated home attire.",
    price: 35000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 27,
    subType: "two-piece",
    colorTag: "#7a9b76"
  },
  {
    id: "tp-020",
    name: "preview two-piece",
    description: "An eco-friendly knitted set. Includes a luxury wrap front knit cardigan top and a matching knit midi pencil skirt with a back walking slit.",
    price: 49000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?auto=format&fit=crop&w=600&q=80"],
    colors: ["#7a9b76"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 30,
    subType: "two-piece",
    colorTag: "#7a9b76"
  },

  // GROUP 3: Electric Blue (#004cff)
  {
    id: "dr-005",
    name: "preview dress",
    description: "A majestic dress crafted with high-lustre, rich royal blue crepe fabric. Embellished with high elegant neck gathering and stunning asymmetric fluid drapes.",
    price: 41000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 29,
    subType: "dress",
    colorTag: "#004cff"
  },
  {
    id: "dr-012",
    name: "preview dress",
    description: "A tailored premium stretch knit bodycon that comfortably hugs curves. Finished with detailed cut-out geometric shoulder straps for a stunning night look.",
    price: 43000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1551803091-e20673f157ad?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 15,
    subType: "dress",
    colorTag: "#004cff"
  },
  {
    id: "dr-019",
    name: "preview dress",
    description: "An elegant evening maxi dress in royal blue chiffon. Detailed with a deep V-neck, delicate flutter cape sleeves, and a beautifully structured pleated waistband.",
    price: 47000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 23,
    subType: "dress",
    colorTag: "#004cff"
  },
  {
    id: "tp-006",
    name: "preview two-piece",
    description: "A beautiful electric blue co-ord. Features a fitted linen tie-front crop bodice styled perfectly with matching wide-leg trousers for a sharp tropical edit.",
    price: 54000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviewCount: 12,
    subType: "two-piece",
    colorTag: "#004cff"
  },
  {
    id: "tp-013",
    name: "preview two-piece",
    description: "Elevated plissé texture lounge top and flare pants set. Soft, luxurious, highly stretchable and completely breathable for beautiful comfort.",
    price: 46000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 21,
    subType: "two-piece",
    colorTag: "#004cff"
  },
  {
    id: "tp-022",
    name: "preview two-piece",
    description: "A premium knitted matching shorts and tank set in vibrant electric blue. Perfect for travel or a relaxed summer weekend look.",
    price: 39500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"],
    colors: ["#004cff"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 16,
    subType: "two-piece",
    colorTag: "#004cff"
  },

  // GROUP 4: Midnight Black (#202020)
  {
    id: "dr-002",
    name: "preview dress",
    description: "Luxurious pure mulberry silk slip dress with a polished bias cut that flows like water. Featuring thin straps and a classic cowl neck.",
    price: 42000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 74,
    subType: "dress",
    colorTag: "#202020"
  },
  {
    id: "dr-015",
    name: "preview dress",
    description: "A spectacular black floor-length gown with hand-sewn Chantilly lace accents, structured bodice, and stunning open back profile.",
    price: 64000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 42,
    subType: "dress",
    colorTag: "#202020"
  },
  {
    id: "dr-023",
    name: "preview dress",
    description: "The ultimate casual knit dress. Structured heavy weight ribbing contouring the waist perfectly for high day-to-night versatility.",
    price: 35000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 56,
    subType: "dress",
    colorTag: "#202020"
  },
  {
    id: "tp-007",
    name: "preview two-piece",
    description: "A sophisticated black tailored set. Includes an asymmetric double-breasted structured blazer and high waisted tailored matching shorts.",
    price: 58000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 39,
    subType: "two-piece",
    colorTag: "#202020"
  },
  {
    id: "tp-012",
    name: "preview two-piece",
    description: "Timeless plissé lounge shirt and wide pants co-ord in rich jet black. High luxury shine fabric that is incredibly comfortable.",
    price: 51200.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 41,
    subType: "two-piece",
    colorTag: "#202020"
  },
  {
    id: "tp-017",
    name: "preview two-piece",
    description: "Cozy knit matching top and skirt duo crafted from fine wool blend. Sophisticated and minimalist look for colder months.",
    price: 47000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?auto=format&fit=crop&w=600&q=80"],
    colors: ["#202020"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviewCount: 22,
    subType: "two-piece",
    colorTag: "#202020"
  },

  // GROUP 5: Sunflower Yellow (#ffd54f)
  {
    id: "dr-004",
    name: "preview dress",
    description: "Breezy bright yellow cotton sundress with delicate self-tie shoulder bows, fully lined and featuring a pleasant tiered lace skirt.",
    price: 36000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 30,
    subType: "dress",
    colorTag: "#ffd54f"
  },
  {
    id: "dr-011",
    name: "preview dress",
    description: "A gorgeous warm marigold yellow tiered dress crafted in premium linen with a smocked chest panel and short volume sleeves.",
    price: 39500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 25,
    subType: "dress",
    colorTag: "#ffd54f"
  },
  {
    id: "dr-022",
    name: "preview dress",
    description: "Ultra-fine liquid silk slip dress in deep golden yellow. Detailed with beautiful lace insertions and adjustable criss-cross back.",
    price: 44000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 18,
    subType: "dress",
    colorTag: "#ffd54f"
  },
  {
    id: "tp-003",
    name: "preview two-piece",
    description: "Bright yellow premium natural linen matching set. Consists of a relaxed halter crop top and breathable high rise paperbag shorts.",
    price: 38000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviewCount: 24,
    subType: "two-piece",
    colorTag: "#ffd54f"
  },
  {
    id: "tp-014",
    name: "preview two-piece",
    description: "Stretchy plissé shirt and lounge wide pants in sun yellow. Beautifully textured and designed for effortless premium styling.",
    price: 45000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 19,
    subType: "two-piece",
    colorTag: "#ffd54f"
  },
  {
    id: "tp-019",
    name: "preview two-piece",
    description: "Exquisite hand-crocheted summer set including a square-neck knitted tank crop and matching drawstring skirt with lining.",
    price: 49000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539008835151-34340d043b35?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ffd54f"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 13,
    subType: "two-piece",
    colorTag: "#ffd54f"
  },

  // GROUP 6: Coral Red (#ff5252)
  {
    id: "dr-006",
    name: "preview dress",
    description: "Stunning vibrant coral-red dress featuring an elegant flared A-line skirt, delicate scoop neckline, and detailed buttoned back closure.",
    price: 42000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1551803091-e20673f157ad?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 31,
    subType: "dress",
    colorTag: "#ff5252"
  },
  {
    id: "dr-013",
    name: "preview dress",
    description: "Sensational cocktail dress in scarlet coral-red georgette. Boasting gorgeous hand-pleated shoulder detailing and a structured wrapped bodice.",
    price: 52000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 22,
    subType: "dress",
    colorTag: "#ff5252"
  },
  {
    id: "dr-025",
    name: "preview dress",
    description: "A gorgeous liquid red-coral satin slip dress with a lovely drape neck and low scoop back with tie string details.",
    price: 38500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviewCount: 11,
    subType: "dress",
    colorTag: "#ff5252"
  },
  {
    id: "tp-008",
    name: "preview two-piece",
    description: "Matching coral red French linen crop tank with pretty button details and paired with high waisted wide-leg flowing trousers.",
    price: 48000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 20,
    subType: "two-piece",
    colorTag: "#ff5252"
  },
  {
    id: "tp-016",
    name: "preview two-piece",
    description: "Supremely cozy cotton-knit crop top and matching high-slit skirt, featuring luxury rib texture and breathable organic yarns.",
    price: 46000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewCount: 14,
    subType: "two-piece",
    colorTag: "#ff5252"
  },
  {
    id: "tp-021",
    name: "preview two-piece",
    description: "Exquisite pleated soft silk long-sleeved tunic shirt and matching flare pants. Flows so beautifully when walking.",
    price: 55000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ff5252"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 18,
    subType: "two-piece",
    colorTag: "#ff5252"
  },

  // GROUP 7: Soft Lilac (#ba68c8)
  {
    id: "dr-007",
    name: "preview dress",
    description: "A dreamy georgette dress in soft lilac with tiered ruffles down the skirt, short puffed elasticated sleeves, and beautiful square neckline.",
    price: 39000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 23,
    subType: "dress",
    colorTag: "#ba68c8"
  },
  {
    id: "dr-016",
    name: "preview dress",
    description: "Breathtaking premium lilac silk wrap dress. Boasting elegant kimono sleeves and a broad self-tie sash that makes an impressive bow.",
    price: 58000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 30,
    subType: "dress",
    colorTag: "#ba68c8"
  },
  {
    id: "dr-024",
    name: "preview dress",
    description: "A sleek soft-lilac fine slip dress with comfortable fluid tailoring, beautiful lace neckline details, and adjustable straps.",
    price: 37000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviewCount: 17,
    subType: "dress",
    colorTag: "#ba68c8"
  },
  {
    id: "tp-001",
    name: "preview two-piece",
    description: "A gorgeous modern co-ord in elegant soft lilac linen. Includes a tailored sleeveless high-neck top and matched high-waisted trousers.",
    price: 46500.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewCount: 40,
    subType: "two-piece",
    colorTag: "#ba68c8"
  },
  {
    id: "tp-010",
    name: "preview two-piece",
    description: "A highly soft premium ribbed knit set. Composed of an off-the-shoulder wide-rib long-sleeve crop top and matching knit skirts.",
    price: 49000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewCount: 22,
    subType: "two-piece",
    colorTag: "#ba68c8"
  },
  {
    id: "tp-018",
    name: "preview two-piece",
    description: "Luxurious, beautifully flowing plissé set in rich lilac. Relaxed fit shirt paired with pleated wide flare trousers.",
    price: 52000.00,
    category: "",
    images: ["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?auto=format&fit=crop&w=600&q=80"],
    colors: ["#ba68c8"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 16,
    subType: "two-piece",
    colorTag: "#ba68c8"
  }
];

// Let's ensure each category has exactly 70 items of high quality

const dressImage = "https://dexstitches.com/image/cache/catalog/2024%20October/14TH/200/New%20Women%20Lace%20Dress%20Pink%20online%20shopping%20website%201-1080x1440.jpg";
const twoPieceImage = "https://i.ibb.co/G3CN15v9/Gemini-Generated-Image-g4v7uyg4v7uyg4v7.png";
const shoesImage = "https://m.media-amazon.com/images/I/61C3dJuLiQL._AC_UF894,1000_QL80_.jpg";
const bagsImage = "https://d21d281c1yd2en.cloudfront.net/media/product_images/6085a837-778d-4e08-9862-12f68a32ba09.jpeg";
const casualImage = "https://tove-studio.com/cdn/shop/files/MarloJeanIndigo_TOVE.jpg?v=1738755608";
const menAccessoriesImage = "https://i5.walmartimages.com/seo/POEDAGAR-Top-Brand-Luxury-Mens-Watches-Luminous-Waterproof-Stainless-Steel-Watch-Men-Date-Calendar-Business-Quartz-Wristwatch_d069966a-9085-4912-889a-d205f02c51e3.672da074b006c70bf69bc2cf54dd4f76.jpeg";

// Mutate product images to match the new image assets specified by the user
products.forEach((p) => {
  if (p.subType === "dress") {
    p.images = [dressImage];
  } else if (p.subType === "two-piece") {
    p.images = [twoPieceImage];
  } else if (p.category === "shoes") {
    p.images = [shoesImage];
  } else if (p.category === "bags") {
    p.images = [bagsImage];
  } else if (p.category === "men-accessories") {
    p.images = [menAccessoriesImage];
  } else if (p.category === "casual-clothes") {
    p.images = [casualImage];
  }
});

// Helper function to fill missing products up to 70 per category
const fillTo70 = (
  filterFn: (p: Product) => boolean,
  createFn: (index: number) => Product
) => {
  const currentCount = products.filter(filterFn).length;
  const needed = 70 - currentCount;
  for (let i = 0; i < needed; i++) {
    products.push(createFn(i + 1));
  }
};

// Fill dresses
fillTo70(
  (p) => p.subType === "dress",
  (i) => ({
    id: `dress-gen-${i}`,
    name: "preview dress",
    description: `An exquisite Evening Dress meticulously designed for stunning appeal and refined comfort. Hand-crafted seams, premium materials, and structured draping make it an unparalleled silhouette.`,
    price: 35000.00 + (i * 250) % 15000,
    compareAtPrice: 50000.00 + (i * 250) % 15000,
    category: "",
    images: [dressImage],
    colors: ["#202020", "#004cff"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: parseFloat((4.5 + (i % 6) * 0.1).toFixed(1)),
    reviewCount: 15 + (i * 7) % 250,
    subType: "dress",
    colorTag: "#202020",
    tags: i % 2 === 0 ? ["New Arrival"] : ["Classic Collection"]
  })
);

// Fill two-pieces
fillTo70(
  (p) => p.subType === "two-piece",
  (i) => ({
    id: `two-piece-gen-${i}`,
    name: "preview two-piece",
    description: `A stunning styled set consisting of perfectly coordinated top and trousers. Tailored from highly luxurious, breathable fabrics to ensure effortless comfort and impeccable panache.`,
    price: 42000.00 + (i * 310) % 18000,
    compareAtPrice: 58000.00 + (i * 310) % 18000,
    category: "",
    images: [twoPieceImage],
    colors: ["#ffffff", "#202020"],
    sizes: ["S", "M", "L", "XL"],
    rating: parseFloat((4.4 + (i % 7) * 0.1).toFixed(1)),
    reviewCount: 10 + (i * 9) % 200,
    subType: "two-piece",
    colorTag: "#ffffff",
    tags: i % 3 === 0 ? ["Limited Edition"] : ["Best Seller"]
  })
);

// Fill shoes
fillTo70(
  (p) => p.category === "shoes",
  (i) => ({
    id: `shoes-gen-${i}`,
    name: "preview heels",
    description: `Designed with a chic block heel and cushioned insole, these stunning pumps deliver sky-high style without sacrificing all-day comfort.`,
    price: 28000.00 + (i * 450) % 12000,
    compareAtPrice: 39000.00 + (i * 450) % 12000,
    category: "shoes",
    images: [shoesImage],
    colors: ["#202020", "#ffffff"],
    sizes: ["s-36", "s-37", "s-38", "s-39", "s-40"],
    rating: parseFloat((4.6 + (i % 5) * 0.1).toFixed(1)),
    reviewCount: 8 + (i * 12) % 320,
    colorTag: "#202020",
    tags: i % 4 === 0 ? ["Must Have"] : ["Trending"]
  })
);

// Fill Accessories
fillTo70(
  (p) => p.category === "bags",
  (i) => ({
    id: `Accessories-gen-${i}`,
    name: "preview bag",
    description: `Crafted from premium pebbled leather with gold-tone hardware, this spacious yet structured handbag is the perfect finishing touch for any outfit.`,
    price: 49000.00 + (i * 520) % 25000,
    compareAtPrice: 65000.00 + (i * 520) % 25000,
    category: "bags",
    images: [bagsImage],
    colors: ["#202020"],
    sizes: ["One Size"],
    rating: parseFloat((4.7 + (i % 4) * 0.1).toFixed(1)),
    reviewCount: 20 + (i * 6) % 180,
    colorTag: "#202020",
    tags: i % 5 === 0 ? ["Exclusive"] : ["Top Rated"]
  })
);

// Fill men’s accessories
fillTo70(
  (p) => p.category === "men-accessories",
  (i) => ({
    id: `men-accessories-gen-${i}`,
    name: "premium men's accessory",
    description: `A luxury men’s accessory designed with precision detailing, polished finishes, and versatile styling for both daytime and evening looks.`,
    price: 52000.00 + (i * 430) % 18000,
    compareAtPrice: 72000.00 + (i * 430) % 18000,
    category: "men-accessories",
    images: [menAccessoriesImage],
    colors: ["#202020", "#C0C0C0"],
    sizes: ["One Size"],
    rating: parseFloat((4.5 + (i % 5) * 0.1).toFixed(1)),
    reviewCount: 18 + (i * 6) % 150,
    colorTag: "#202020",
    tags: i % 4 === 0 ? ["Luxury"] : ["Best Seller"],
    audience: "men"
  })
);

// Fill Casuals
fillTo70(
  (p) => p.category === "casual-clothes",
  (i) => ({
    id: `casual-gen-${i}`,
    name: "preview casual outfit",
    description: `A modern everyday look with an easy silhouette and polished finishing touches. Designed to feel relaxed while still looking refined from morning to evening.`,
    price: 18000.00 + (i * 380) % 9000,
    compareAtPrice: 25000.00 + (i * 380) % 9000,
    category: "casual-clothes",
    images: [casualImage],
    colors: ["#f5f5f5", "#202020", "#1f3f8b"],
    sizes: ["S", "M", "L", "XL"],
    rating: parseFloat((4.6 + (i % 5) * 0.1).toFixed(1)),
    reviewCount: 12 + (i * 5) % 160,
    colorTag: "#f5f5f5",
    subType: "casual",
    tags: i % 4 === 0 ? ["New Arrival"] : ["Casual"]
  })
);

// Treat all existing catalog items as women's products unless explicitly tagged otherwise.
products.forEach((product) => {
  if (!product.audience) {
    product.audience = "women";
  }
});

const menShirtImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSMK09JdqrcfF99S1HbH-V7vtHChFdoKXGy_h3lqcwjA&s=10";
const menPantsImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzT50vEdYpU8sC4VIpasltWWTUiUvQk6Bn0etQQcNrMQ&s=10";
const menShoesImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTSErkGUSQaaSbqqVRAHGkJ-rZgoZp3m9h15c1bXQrgA&s=10";

products.push(
  {
    id: "men-top-001",
    name: "premium men's shirt",
    description: "A sharp cotton shirt with a modern tailored fit, clean collar structure, and breathable fabric that works for workdays, dinners, and smart casual styling.",
    price: 28500.00,
    compareAtPrice: 34000.00,
    category: "men-tops",
    images: [menShirtImage],
    colors: ["#202020", "#f5f5f5"],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 31,
    tags: ["New Arrival", "Tailored"],
    subType: "tops",
    audience: "men",
  },
  {
    id: "men-pant-001",
    name: "classic men's pants",
    description: "Slim straight trousers cut from a flexible woven blend, finished with crisp lines and a comfortable waistband for polished everyday wear.",
    price: 32500.00,
    compareAtPrice: 39500.00,
    category: "men-pants",
    images: [menPantsImage],
    colors: ["#202020", "#6e7a8a"],
    sizes: ["30", "32", "34", "36", "38"],
    rating: 4.7,
    reviewCount: 24,
    tags: ["Popular", "Smart"],
    subType: "pants",
    audience: "men",
  },
  {
    id: "men-shoe-001",
    name: "men's sneakers",
    description: "Minimal leather sneakers with a cushioned sole, durable construction, and clean lines that pair easily with jeans, joggers, or tailored pants.",
    price: 44500.00,
    compareAtPrice: 56000.00,
    category: "men-shoes",
    images: [menShoesImage],
    colors: ["#202020", "#f5f5f5"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    rating: 4.8,
    reviewCount: 28,
    tags: ["Best Seller", "Everyday"],
    subType: "shoes",
    audience: "men",
  }
);

fillTo70(
  (p) => p.category === "men-tops",
  (i) => ({
    id: `men-top-gen-${i}`,
    name: "premium men's shirt",
    description: "A refined men's top with a breathable finish, structured shoulders, and a versatile silhouette suited for both polished and relaxed dressing.",
    price: 24000.00 + (i * 320) % 10000,
    compareAtPrice: 32000.00 + (i * 320) % 10000,
    category: "men-tops",
    images: [menShirtImage],
    colors: ["#202020", "#f5f5f5"],
    sizes: ["M", "L", "XL", "XXL"],
    rating: parseFloat((4.5 + (i % 5) * 0.1).toFixed(1)),
    reviewCount: 12 + (i * 7) % 150,
    subType: "tops",
    audience: "men",
    tags: i % 2 === 0 ? ["New Arrival"] : ["Classic"],
  })
);

fillTo70(
  (p) => p.category === "men-pants",
  (i) => ({
    id: `men-pant-gen-${i}`,
    name: "classic men's pants",
    description: "Smart tailored pants cut for daily movement, with a clean front crease and premium fabric handfeel.",
    price: 28000.00 + (i * 410) % 12000,
    compareAtPrice: 36000.00 + (i * 410) % 12000,
    category: "men-pants",
    images: [menPantsImage],
    colors: ["#202020", "#6e7a8a"],
    sizes: ["30", "32", "34", "36", "38"],
    rating: parseFloat((4.4 + (i % 6) * 0.1).toFixed(1)),
    reviewCount: 10 + (i * 8) % 160,
    subType: "pants",
    audience: "men",
    tags: i % 3 === 0 ? ["Popular"] : ["Tailored"],
  })
);

fillTo70(
  (p) => p.category === "men-shoes",
  (i) => ({
    id: `men-shoe-gen-${i}`,
    name: "men's sneakers",
    description: "Low-profile sneakers with premium finishing, supportive cushioning, and a versatile look.",
    price: 38000.00 + (i * 460) % 15000,
    compareAtPrice: 49000.00 + (i * 460) % 15000,
    category: "men-shoes",
    images: [menShoesImage],
    colors: ["#202020", "#f5f5f5"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    rating: parseFloat((4.5 + (i % 5) * 0.1).toFixed(1)),
    reviewCount: 8 + (i * 9) % 180,
    subType: "shoes",
    audience: "men",
    tags: i % 4 === 0 ? ["Trending"] : ["Everyday"],
  })
);

// Keep only products that fall strictly under our approved categories
const approvedProducts = products.filter((p) => {
  return (
    p.subType === "dress" ||
    p.subType === "two-piece" ||
    p.category === "shoes" ||
    p.category === "bags" ||
    p.category === "casual-clothes" ||
    p.category === "men-tops" ||
    p.category === "men-pants" ||
    p.category === "men-shoes" ||
    p.category === "men-accessories"
  );
});

// Mutate original products array in-place
products.length = 0;
products.push(...approvedProducts);

const normalizePreviewImages = (images: string[]) => {
  if (images.length === 0) {
    return [];
  }

  if (images.length >= 4) {
    return images.slice(0, 4);
  }

  return Array.from({ length: 4 }, (_, index) => images[index % images.length]);
};

products.forEach((product) => {
  product.images = normalizePreviewImages(product.images);
});


