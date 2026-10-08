import React from "react";
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Zap,
  Home,
  ShieldCheck,
  PiggyBank,
  Package,
  Plane,
  Shield,
  Target,
  LucideProps,
} from "lucide-react";
import { TransactionCategory } from "@/lib/types/database.types";
import { getCategoryConfig } from "@/lib/utils";

interface CategoryIconProps extends LucideProps {
  category?: TransactionCategory;
  name?: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({
  category,
  name,
  size = 18,
  className = "",
  ...props
}: CategoryIconProps) {
  const iconName = category ? getCategoryConfig(category).lucideIcon : name;

  switch (iconName) {
    case "Briefcase":
    case "salary":
      return <Briefcase size={size} className={className} {...props} />;
    case "Laptop":
    case "freelance":
      return <Laptop size={size} className={className} {...props} />;
    case "TrendingUp":
    case "investment":
      return <TrendingUp size={size} className={className} {...props} />;
    case "Gift":
    case "gift":
      return <Gift size={size} className={className} {...props} />;
    case "Coins":
    case "other_income":
      return <Coins size={size} className={className} {...props} />;
    case "UtensilsCrossed":
    case "food":
      return <UtensilsCrossed size={size} className={className} {...props} />;
    case "Car":
    case "transport":
      return <Car size={size} className={className} {...props} />;
    case "ShoppingBag":
    case "shopping":
      return <ShoppingBag size={size} className={className} {...props} />;
    case "Gamepad2":
    case "entertainment":
      return <Gamepad2 size={size} className={className} {...props} />;
    case "HeartPulse":
    case "health":
      return <HeartPulse size={size} className={className} {...props} />;
    case "GraduationCap":
    case "education":
      return <GraduationCap size={size} className={className} {...props} />;
    case "Zap":
    case "utilities":
      return <Zap size={size} className={className} {...props} />;
    case "Home":
    case "rent":
      return <Home size={size} className={className} {...props} />;
    case "ShieldCheck":
    case "insurance":
    case "Shield":
      return <ShieldCheck size={size} className={className} {...props} />;
    case "PiggyBank":
    case "savings":
      return <PiggyBank size={size} className={className} {...props} />;
    case "Plane":
      return <Plane size={size} className={className} {...props} />;
    case "Target":
      return <Target size={size} className={className} {...props} />;
    default:
      return <Package size={size} className={className} {...props} />;
  }
}
