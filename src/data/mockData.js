// Mock data for the Sanova Salon App

export const mockSalons = [
  {
    id: 1,
    name: 'Gustav Salon',
    address: 'Frederiks Alle 28, Copenhagen',
    rating: 4.8,
    distance: '1.2km away',
    services: ['Haircut', 'Coloring', 'Manicure'],
    image: '🏪',
  },
  {
    id: 2,
    name: 'Nail & Spa Studio',
    address: 'Vesterbrogade 45, Copenhagen',
    rating: 4.6,
    distance: '2.5km away',
    services: ['Manicure', 'Pedicure', 'Spa'],
    image: '💅',
  },
  {
    id: 3,
    name: 'Trendy Salon',
    address: 'Nørrebrogade 12, Copenhagen',
    rating: 4.7,
    distance: '1.2km away',
    services: ['Haircut', 'Styling', 'Beard Trim'],
    image: '💇‍♀️',
  },
  {
    id: 4,
    name: 'Wellness Center',
    address: 'Østerbrogade 78, Copenhagen',
    rating: 4.9,
    distance: '1.3km away',
    services: ['Massage', 'Facial', 'Wellness'],
    image: '🧘‍♀️',
  },
];

export const mockServices = [
  {
    id: 1,
    name: 'Classic Manicure',
    price: '200 kr',
    duration: '45 min',
    salon: 'Gustav Salon',
    description: 'A classic manicure includes nail shaping, cuticle care, and polish application.',
    image: '💅',
  },
  {
    id: 2,
    name: "Men's Haircut",
    price: '400 kr',
    duration: '30 min',
    salon: 'Trendy Salon',
    description: 'Professional haircut with styling and finishing touches.',
    image: '👨',
  },
  {
    id: 3,
    name: 'Swedish Massage',
    price: '600 kr',
    duration: '60 min',
    salon: 'Wellness Center',
    description: 'Relaxing Swedish massage to relieve tension and stress.',
    image: '💆‍♀️',
  },
  {
    id: 4,
    name: 'Hair Coloring',
    price: '800 kr',
    duration: '120 min',
    salon: 'Gustav Salon',
    description: 'Professional hair coloring with premium products.',
    image: '💇‍♀️',
  },
];

export const mockProducts = [
  {
    id: 1,
    name: 'Muscular Relief Balm',
    price: '120 kr',
    salon: 'Gustav Salon',
    description: 'A soothing balm for muscle relief and relaxation.',
    image: '🧴',
    category: 'Wellness',
  },
  {
    id: 2,
    name: 'Moisturizing Shampoo',
    price: '150 kr',
    salon: 'Gustav Salon',
    description: 'Gentle, moisturizing shampoo perfect for all hair types.',
    image: '🧴',
    category: 'Hair Care',
  },
  {
    id: 3,
    name: 'Facial Cleanser',
    price: '100 kr',
    salon: 'Gustav Salon',
    description: 'Deep cleansing facial cleanser for all skin types.',
    image: '🧴',
    category: 'Skincare',
  },
  {
    id: 4,
    name: 'Styling Cream',
    price: '80 kr',
    salon: 'Gustav Salon',
    description: 'Professional styling cream for perfect hold and shine.',
    image: '🧴',
    category: 'Hair Care',
  },
];

export const mockBookings = [
  {
    id: 1,
    customer: 'Klara Jenkins',
    service: "Women's Haircut",
    salon: 'Gustav Salon',
    date: '2024-05-07',
    time: '14:00',
    status: 'confirmed',
    avatar: '👩',
  },
  {
    id: 2,
    customer: 'Mark Howard',
    service: 'Beard Trim',
    salon: 'Trendy Salon',
    date: '2024-05-07',
    time: '15:00',
    status: 'confirmed',
    avatar: '👨',
  },
  {
    id: 3,
    customer: 'Emma Wilson',
    service: 'Manicure',
    salon: 'Nail & Spa Studio',
    date: '2024-05-07',
    time: '16:00',
    status: 'confirmed',
    avatar: '👩',
  },
];

export const mockRevenue = {
  today: 250,
  thisWeek: 1100,
  thisMonth: 4200,
  products: 45,
  totalTransactions: 60,
  averagePerCustomer: 115.5,
};

export const mockPaymentMethods = [
  { name: 'Card (Stripe)', amount: 56700, percentage: 61.3 },
  { name: 'MobilePay', amount: 27300, percentage: 29.5 },
  { name: 'Apple Pay', amount: 4500, percentage: 4.9 },
  { name: 'Cash', amount: 3900, percentage: 4.2 },
];

export const mockTaxData = {
  taxableRevenue: 96600,
  nonTaxableRevenue: 12600,
  calculatedTax: 24150,
  taxRate: 25,
};
