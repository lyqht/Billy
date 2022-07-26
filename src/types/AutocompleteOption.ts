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
  TownCouncil = 'Town Councils',
  Insurance = 'Insurance Companies',
  Government = 'Government Agencies',
  Education = 'Educational Institution',
  CreditCard = 'Credit Cards / DBS Cashline',
  CountryRecreationClubs = 'Country Clubs / Recreational Clubs',
  BrokerageSecurity = 'Brokerage / Securities Firms',
}

export type PayeeWithCategory = {
  payee: string;
  category: string;
};
