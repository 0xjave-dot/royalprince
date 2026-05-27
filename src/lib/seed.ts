import { Product } from '../types';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export const STATIC_PRODUCTS: Product[] = [
  // Dresses
  {
    id: "dress-scarlet",
    name: "Scarlet Wrap Dress",
    price: 28000,
    description: "An elegant, figures-flattering wrap dress cut from lightweight premium linen. Perfect for hot afternoon events or romantic dinners in Victoria Island.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Cream"],
    mainImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop",
    category: "Dresses",
    tags: ["Trending", "New Arrival", "Best Seller"]
  },
  {
    id: "dress-noir",
    name: "Noir Bodycon Midi",
    price: 32000,
    description: "Form-fitting sleek dress crafted with high-stretch ribbed fabric designed to structure your curves beautifully.",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    mainImage: "https://images.unsplash.com/photo-1539008835140-73604de08a2a?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop",
    category: "Dresses",
    tags: ["Trending", "Classic"]
  },
  {
    id: "dress-ivory",
    name: "Ivory Linen Shift",
    price: 24000,
    description: "Graceful and breezy, this effortless shift dress offers peak breathable comfort.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Sandy Brown"],
    mainImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549064492-ccde2a212267?w=800&auto=format&fit=crop",
    category: "Dresses",
    tags: ["New Arrival"]
  },
  {
    id: "dress-leopard",
    name: "Leopard Maxi Dress",
    price: 35000,
    description: "Unapologetically bold maxi dress layout featuring custom silk print overlays.",
    sizes: ["M", "L", "XL"],
    colors: ["Animal Print"],
    mainImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop",
    category: "Dresses",
    tags: ["Trending"]
  },

  // Co-ords
  {
    id: "coord-camel",
    name: "Camel Blazer Set",
    price: 45000,
    description: "A tailored modern power suit. Features a double-breasted soft-shoulder blazer paired. Perfect for dynamic boardroom presentations.",
    sizes: ["S", "M", "L"],
    colors: ["Camel", "Ivory"],
    mainImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop",
    category: "Co-ords",
    tags: ["Trending", "Best Seller"]
  },
  {
    id: "coord-black",
    name: "Black Linen Co-ord",
    price: 38000,
    description: "Sartorial relaxation. A matching camp-collar shirt and wide-leg trousers cut in lightweight linen.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    mainImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop",
    category: "Co-ords",
    tags: ["Classic"]
  },
  {
    id: "coord-sage",
    name: "Sage Green Two-Piece",
    price: 42000,
    description: "Sleek and serene. Features a refined wrap top and structured matching shorts ideal for Ikoyi weekend brunch.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Sage Green"],
    mainImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop",
    category: "Co-ords",
    tags: ["New Arrival"]
  },
  {
    id: "coord-burgundy",
    name: "Burgundy Power Set",
    price: 48000,
    description: "Command respect in our heritage burgundy tailored double-breasted jacket and high-rise flared trousers.",
    sizes: ["S", "M", "L"],
    colors: ["Burgundy Noir"],
    mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop",
    category: "Co-ords",
    tags: ["Trending"]
  },

  // Tops
  {
    id: "top-white",
    name: "White Puff Sleeve Blouse",
    price: 15000,
    description: "Romance meets craftsmanship. Organza puff sleeves on sleek cotton body panel layouts.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White"],
    mainImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop",
    category: "Tops",
    tags: ["New Arrival", "Best Seller"]
  },
  {
    id: "top-brown",
    name: "Brown Corset Top",
    price: 18000,
    description: "Premium structured corset top crafted to define curves. Pairs wonderfully under jackets.",
    sizes: ["S", "M", "L"],
    colors: ["Tan Brown"],
    mainImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop",
    category: "Tops",
    tags: ["Trending"]
  },
  {
    id: "top-stripe",
    name: "Stripe Knit Crop",
    price: 14000,
    description: "Chic striped knit designed for casual lightweight daywear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Stripe"],
    mainImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop",
    category: "Tops",
    tags: ["Casual"]
  },
  {
    id: "top-black",
    name: "Black Satin Cami",
    price: 12000,
    description: "Luxury satin flow with delicate strap loops. Highly modular layering piece.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Classic Black"],
    mainImage: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&auto=format&fit=crop",
    category: "Tops",
    tags: ["Essential"]
  },

  // Blazers
  {
    id: "blazer-cream",
    name: "Oversized Cream Blazer",
    price: 52000,
    description: "Drape yourself in effortless elegance. Custom oversized fit with double-notched lapels and fine horn buttons.",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Beige"],
    mainImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1611042553975-08733608b2db?w=800&auto=format&fit=crop",
    category: "Blazers",
    tags: ["Trending", "Best Seller"]
  },
  {
    id: "blazer-stripes",
    name: "Pinstripe Power Blazer",
    price: 55000,
    description: "Sophisticated navy blazer patterned with soft lines to project confidence.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue"],
    mainImage: "https://images.unsplash.com/photo-1548624149-f9b18590bc42?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
    category: "Blazers",
    tags: ["Professional"]
  },
  {
    id: "blazer-black",
    name: "Double-Breasted Black Blazer",
    price: 58000,
    description: "Ultimate high-fashion wardrobe piece. Timeless structure with soft linings.",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    mainImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
    category: "Blazers",
    tags: ["Classic"]
  },
  {
    id: "blazer-rust",
    name: "Rust Boyfriend Blazer",
    price: 49000,
    description: "Vibrant autumnal rust blazer designed with soft drape curves.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rust Brown"],
    mainImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format&fit=crop",
    category: "Blazers",
    tags: ["New Arrival"]
  },

  // Bags
  {
    id: "bag-crimson",
    name: "Crimson Leather Tote",
    price: 36000,
    description: "Finely stitched luxury calfskin tote with double straps and interior organizing sleeves.",
    sizes: ["O/S"],
    colors: ["Crimson Red"],
    mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop",
    category: "Bags",
    tags: ["Trending", "Luxury"]
  },
  {
    id: "bag-gold",
    name: "Gold Clutch Elegance",
    price: 22000,
    description: "Minimal metallic frame evening bag with heavy chain loop straps. Beautifully captures Lagos nightlife elegance.",
    sizes: ["O/S"],
    colors: ["Gild Gold"],
    mainImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop",
    category: "Bags",
    tags: ["Evening"]
  },

  // Shoes
  {
    id: "shoes-gilded",
    name: "Gilded Strappy Heels",
    price: 40000,
    description: "Slender elegant gold-strapped stiletto sandals featuring high cushioning support.",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["Warm Gold"],
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop",
    category: "Shoes",
    tags: ["Best Seller", "Evening"]
  },
  {
    id: "shoes-onyx",
    name: "Onyx Patent Pump",
    price: 38000,
    description: "Ultra glossy patent leather black pumps designed to turn heads.",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Mirror Black"],
    mainImage: "https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop",
    category: "Shoes",
    tags: ["Classic"]
  }
];

export async function seedDatabase() {
  const productsPath = 'products';
  try {
    const querySnapshot = await getDocs(collection(db, productsPath));
    if (querySnapshot.empty) {
      console.log("No inventory found. Seeding products into Firestore...");
      const batch = writeBatch(db);
      for (const p of STATIC_PRODUCTS) {
        const docRef = doc(db, productsPath, p.id);
        batch.set(docRef, p);
      }
      await batch.commit();
      console.log("Firestore successfully seeded with 20 items!");
    } else {
      console.log("Firestore catalog already populated with products.");
    }
  } catch (err: any) {
    console.error("Firestore Seeding failed. Using client-side catalog backup instead. Code: ", err);
    // Suppress throwing error to make application fully resilient
  }
}
