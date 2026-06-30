export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "summer-floral-dress",
    userName: "Sarah M.",
    rating: 5,
    comment: "Absolutely love this dress! The quality is amazing and it fits perfectly. Will definitely order more.",
    timeAgo: "2 days ago"
  },
  {
    id: "rev-2",
    productId: "summer-floral-dress",
    userName: "Jessica L.",
    rating: 4,
    comment: "Beautiful design and very comfortable. Shipping was fast. Slight color difference from photos but still gorgeous.",
    timeAgo: "1 week ago"
  },
  {
    id: "rev-3",
    productId: "summer-floral-dress",
    userName: "Amanda K.",
    rating: 5,
    comment: "Perfect summer dress! Got so many compliments. Highly recommend.",
    timeAgo: "2 weeks ago"
  },

  {
    id: "rev-5",
    productId: "classic-heels",
    userName: "Rebecca T.",
    rating: 5,
    comment: "Unbelievably comfortable for stiletto heels. Felt highly supportive and cushioned on my feet all day.",
    timeAgo: "5 days ago"
  },
  {
    id: "rev-6",
    productId: "leather-tote",
    userName: "Catherine W.",
    rating: 4,
    comment: "Stunning leather structure. Huge compartment space. Only wish the shoulder strap were slightly wider, but overall 5-star quality.",
    timeAgo: "4 days ago"
  }
];
