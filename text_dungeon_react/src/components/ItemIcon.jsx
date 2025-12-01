import React from 'react';
import { Sword, Axe, Swords as DualSwords, Crosshair, Shield, Shirt } from 'lucide-react';

const ICON_MAP = {
  sword: Sword,
  dagger: Crosshair,
  axe: Axe,
  bow: Crosshair,
  dual: DualSwords,
  cloth: Shirt,
  leather: Shirt,
  wood: Shield,
  iron: Shield,
  steel: Shield
};

const TIER_COLORS = [
  'text-gray-400',
  'text-blue-400',
  'text-purple-400',
  'text-yellow-400',
  'text-pink-400'
];

const ItemIcon = ({ type, tier = 1, size = 24 }) => {
  const IconComponent = ICON_MAP[type] || Sword;
  const colorClass = TIER_COLORS[tier - 1] || TIER_COLORS[0];

  return <IconComponent className={`${colorClass}`} size={size} />;
};

export default ItemIcon;
