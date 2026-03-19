export type FoodCategory = "Tandoor" | "Rice" | "Noodles" | "Pizza" | "Burger" | "Chinese" | "Beverages";

export type FoodTag = "spicy" | "popular" | "healthy" | "bestseller";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: FoodCategory | string;
  isVeg: boolean;
  image: string;
  popular?: boolean;
  tags?: FoodTag[] | string[];
}

export const categories: { name: FoodCategory; emoji: string; image: string }[] = [
  { name: "Tandoor", emoji: "🔥", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop" },
  { name: "Rice", emoji: "🍚", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop" },
  { name: "Noodles", emoji: "🍜", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop" },
  { name: "Pizza", emoji: "🍕", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop" },
  { name: "Burger", emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
  { name: "Chinese", emoji: "🥡", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=100&h=100&fit=crop" },
  { name: "Beverages", emoji: "🥤", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop" },
];

export const menuItems: FoodItem[] = [
  { id: "1", name: "Tandoori Chicken", description: "Juicy chicken marinated in yogurt and spices, cooked in tandoor", price: 320, category: "Tandoor", isVeg: false, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", popular: true, tags: ["popular", "spicy"] },
  { id: "2", name: "Paneer Tikka", description: "Grilled cottage cheese cubes with bell peppers and onions", price: 280, category: "Tandoor", isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop", popular: true, tags: ["popular", "healthy"] },
  { id: "3", name: "Seekh Kebab", description: "Minced lamb kebabs with aromatic spices", price: 350, category: "Tandoor", isVeg: false, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop", tags: ["spicy"] },
  { id: "4", name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken", price: 300, category: "Rice", isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", popular: true, tags: ["popular", "bestseller"] },
  { id: "5", name: "Veg Pulao", description: "Aromatic rice cooked with mixed vegetables and whole spices", price: 220, category: "Rice", isVeg: true, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop", tags: ["healthy"] },
  { id: "6", name: "Egg Fried Rice", description: "Wok-tossed rice with eggs, vegetables and soy sauce", price: 200, category: "Rice", isVeg: false, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
  { id: "7", name: "Hakka Noodles", description: "Stir-fried noodles with vegetables in Indo-Chinese style", price: 220, category: "Noodles", isVeg: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop", popular: true, tags: ["popular"] },
  { id: "8", name: "Chicken Chow Mein", description: "Classic stir-fried noodles with chicken and vegetables", price: 260, category: "Noodles", isVeg: false, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop" },
  { id: "9", name: "Schezwan Noodles", description: "Spicy noodles tossed in schezwan sauce with vegetables", price: 240, category: "Noodles", isVeg: true, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop", tags: ["spicy"] },
  { id: "10", name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, tomato sauce and basil", price: 350, category: "Pizza", isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", popular: true, tags: ["popular", "bestseller"] },
  { id: "11", name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and melted cheese", price: 420, category: "Pizza", isVeg: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", tags: ["spicy"] },
  { id: "12", name: "BBQ Chicken Pizza", description: "Smoky BBQ chicken with onions and mozzarella", price: 450, category: "Pizza", isVeg: false, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", tags: ["bestseller"] },
  { id: "13", name: "Classic Chicken Burger", description: "Crispy chicken patty with lettuce, tomato and mayo", price: 220, category: "Burger", isVeg: false, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", popular: true, tags: ["popular", "bestseller"] },
  { id: "14", name: "Veggie Burger", description: "Crunchy veggie patty with fresh greens and special sauce", price: 180, category: "Burger", isVeg: true, image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc739?w=400&h=300&fit=crop", tags: ["healthy"] },
  { id: "15", name: "Double Cheese Burger", description: "Double patty loaded with melted cheese and pickles", price: 300, category: "Burger", isVeg: false, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop", tags: ["bestseller"] },
  { id: "16", name: "Manchurian", description: "Vegetable balls in spicy Indo-Chinese gravy", price: 240, category: "Chinese", isVeg: true, image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop", tags: ["spicy"] },
  { id: "17", name: "Chilli Chicken", description: "Crispy chicken tossed with peppers in chilli sauce", price: 280, category: "Chinese", isVeg: false, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop", popular: true, tags: ["popular", "spicy"] },
  { id: "18", name: "Spring Rolls", description: "Crispy rolls stuffed with vegetables and glass noodles", price: 180, category: "Chinese", isVeg: true, image: "https://images.unsplash.com/photo-1548507200-e9e0e7e5e3c5?w=400&h=300&fit=crop", tags: ["healthy"] },
  { id: "19", name: "Mango Lassi", description: "Creamy yogurt drink blended with fresh mango", price: 120, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop", tags: ["healthy"] },
  { id: "20", name: "Fresh Lime Soda", description: "Refreshing lime soda – sweet or salted", price: 80, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop", tags: ["healthy"] },
  { id: "21", name: "Cold Coffee", description: "Chilled coffee blended with ice cream and cream", price: 150, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop", tags: ["popular"] },
];