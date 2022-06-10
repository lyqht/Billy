import {Category, PayeeWithCategory} from '../types/AutocompleteOption';

const defaultCategoryIcons = {
  [Category.Electricity]: 'flash-outline',
  [Category.Telecommunications]: 'smartphone-outline',
  [Category.Mortage]: 'home-outline',
  [Category.Waste]: 'trash-2-outline',
  [Category.Videos]: 'tv-outline',
  [Category.Music]: 'headphones-outline',
  [Category.Utilities]: 'droplet-outline',
};

const defaultCategories = Object.keys(defaultCategoryIcons);

const defaultPayeesWithCategory: PayeeWithCategory[] = [
  {
    payee: 'Singtel',
    category: Category.Telecommunications,
  },
  {
    payee: 'M1',
    category: Category.Telecommunications,
  },
  {
    payee: 'Starhub',
    category: Category.Telecommunications,
  },
  {
    payee: 'Senoko',
    category: Category.Electricity,
  },
  {
    payee: 'Geneco',
    category: Category.Electricity,
  },
  {
    payee: 'HDB',
    category: Category.Mortage,
  },
  {
    payee: 'SP',
    category: Category.Utilities,
  },
  {
    payee: 'Sembcorp',
    category: Category.Waste,
  },
  {
    payee: 'Youtube',
    category: Category.Videos,
  },
  {
    payee: 'Netflix',
    category: Category.Videos,
  },
  {
    payee: 'Spotify',
    category: Category.Music,
  },
  {
    payee: 'Supabase',
    category: Category.Electricity,
  },
];

const defaultPayees = defaultPayeesWithCategory.map(
  payeeWithCategory => payeeWithCategory.payee,
);

const getCategoryForPayee = (payee: string) =>
  defaultPayeesWithCategory.find(
    payeeWithCategory => payeeWithCategory.payee === payee,
  )!.category;

export {
  getCategoryForPayee,
  defaultCategoryIcons,
  defaultCategories,
  defaultPayees,
  defaultPayeesWithCategory,
};
