export type AutocompleteOption = {
  name: string;
  icon?: string;
};

export enum Category {
  Electricity = 'Electricity',
  Telecommunications = 'Telecommunications',
  Mortage = 'Mortage/Rent',
  Waste = 'Waste Removal',
  Videos = 'Videos',
  Music = 'Music',
  Utilities = 'Utilities',
}

export type PayeeWithCategory = {
  payee: string;
  category: string;
};
