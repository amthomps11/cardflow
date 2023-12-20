export type condition = 'poor' | 'played' | 'good' | 'excellent';

export type PaginatedItem<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type YugiohSet = {
  id: number;
  card_set_name: string;
  set_code: string;
};

export type YugiohCardRarity = {
  id: number;
  rarity: string;
  rarity_code: string;
};

export type YugiohCardSet = {
  card_in_set_id: number;
  set: YugiohSet;
  rarity: YugiohCardRarity;
};

export type YugiohCard = {
  id: number;
  card_name: string;
  type: string;
  frame_type: string;
  description: string;
  attack: string;
  defense: string;
  level: string;
  race: string;
  attribute: string;
  archetype: string;
  image: string;
  card_in_sets: YugiohCardSet[];
};

export type YugiohCardListing = {
  id: number;
  card: number;
  card_name: string;
  card_set_id: number;

  /** This is the user's ID */
  user: number;

  user_name: string;
  price: number;
  condition: condition;
  quantity: number;
  is_listed: boolean;
  is_sold: boolean;
};

export type YugiohCardInSet = {
  id: number;
  yugioh_card: {
    id: number;
    card_name: string;
    type: string;
    frame_type: string;
    description: string;
    attack: string;
    defense: string;
    level: string;
    race: string;
    attribute: string;
    archetype: string;
    image: string;
  };
  set: YugiohSet;
  rarity: YugiohCardRarity;
};

/**
 * This is the type of the object returned by the ``/details/yugioh/{id}`` loader
 */
export type CardDetailsLoaderData = {
  cardInSet: YugiohCardInSet;
};
