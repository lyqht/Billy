import {sortBy, uniqBy} from 'lodash-es';
import {Category, PayeeWithCategory} from '../types/AutocompleteOption';
import sgBillingOrganisations from './sgBillingOrganisations.json';

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

const cloudPlatformPayees = [
  {
    payee: 'Supabase',
    category: Category.Utilities,
  },
];

const sgBillOrganisationPayees = uniqBy(
  sgBillingOrganisations.map(org => ({
    payee: org['Billing Organisation'],
    category: org.Category,
  })),
  'payee',
);

const defaultPayeesWithCategory: PayeeWithCategory[] = sortBy(
  [
    ...cloudPlatformPayees,
    ...sgBillOrganisationPayees,
    {
      payee: 'Senoko',
      category: Category.Electricity,
    },
    {
      payee: 'HDB',
      category: Category.Mortage,
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
  ],
  'payee',
);

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
