export type ShopMenuAction =
  | { type: 'category'; category: string; query?: string }
  | { type: 'product'; productId: string }
  | { type: 'pet'; pet: string }
  | { type: 'section'; selector: string }
  | { type: 'appointments' };

export type ShopMenuLink = { label: string; action: ShopMenuAction };
export type ShopMenuGroup = { title: string; links: ShopMenuLink[] };
export type ShopMenuConfig = {
  id: string;
  label: string;
  heading: string;
  description: string;
  cta: string;
  action: ShopMenuAction;
  groups: ShopMenuGroup[];
};

const category = (name: string, query?: string): ShopMenuAction => ({ type: 'category', category: name, query });
const product = (productId: string): ShopMenuAction => ({ type: 'product', productId });
const pet = (name: string): ShopMenuAction => ({ type: 'pet', pet: name });
const link = (label: string, action: ShopMenuAction): ShopMenuLink => ({ label, action });

export const shopMenus: ShopMenuConfig[] = [
  {
    id: 'pets', label: 'Pets', heading: 'Explore Pets', description: 'Find your perfect companion at PetMeta.',
    cta: 'Shop All Pets', action: {type:'pet',pet:'all'}, groups: [
      { title: 'Dogs', links: [link('All Dog Breeds', pet('dog')), link('Dog Food', category('food', 'dog food')), link('Dog Accessories', category('accessories', 'dog')), link('Dog Toys', product('toy'))] },
      { title: 'Cats', links: [link('All Cat Breeds', pet('cat')), link('Cat Food', category('food', 'cat food')), link('Cat Accessories', category('accessories', 'cat')), link('Cat Toys', product('cat-toy'))] },
      { title: 'Other Pets', links: [link('Rabbits', pet('rabbit')), link('Birds', pet('bird')), link('Fish', pet('fish')), link('Tortoises', pet('tortoise'))] },
      { title: 'Care & Comfort', links: [link('Grooming', category('grooming')), link('Veterinary Care', category('vet')), link('Health & Wellness', category('health')), link('My Appointments', { type: 'appointments' })] },
    ],
  },
  {
    id: 'food', label: 'Food', heading: 'Explore Pet Food', description: 'Everyday meals and little rewards.',
    cta: 'Shop Pet Food', action: category('food'), groups: [
      { title: 'Dog food', links: [link('Chicken & rice dog food', product('food-dog')), link('Training treats', product('treats'))] },
      { title: 'Cat food', links: [link('Salmon recipe cat food', product('food-cat')), link('Gentle kitten recipe', product('kitten-food'))] },
      { title: 'Treats & young pets', links: [link('Dog training treats', product('treats')), link('Kitten food', product('kitten-food'))] },
    ],
  },
  {
    id: 'accessories', label: 'Accessories', heading: 'Explore Accessories', description: 'Useful finds for life together.',
    cta: 'Shop Accessories', action: category('accessories'), groups: [
      { title: 'Walk & travel', links: [link('Classic walk collar', product('collar')), link('Adventure harness', product('harness')), link('Travel water bottle', product('bottle'))] },
      { title: 'Dining', links: [link('Ceramic dining duo', product('bowls')), link('Shop food', category('food'))] },
      { title: 'At home', links: [link('Scratch lounge', product('scratch')), link('Play bundle', product('toy'))] },
    ],
  },
  {
    id: 'grooming', label: 'Grooming', heading: 'Pet Grooming', description: 'Fresh fur and gentle care.',
    cta: 'Explore Grooming', action: category('grooming'), groups: [
      { title: 'Book a service', links: [link('Bath & brush', category('grooming')), link('Haircut & nail care', category('grooming'))] },
      { title: 'Brushes & combs', links: [link('Soft-touch grooming brush', product('brush')), link('Quick-dry bath kit', product('towel'))] },
      { title: 'Bath care', links: [link('Oat & aloe shampoo', product('shampoo')), link('Explore groomers', category('grooming'))] },
    ],
  },
  {
    id: 'vet', label: 'Veterinary', heading: 'Veterinary Care', description: 'Find nearby professional care.',
    cta: 'Find Veterinary Care', action: category('vet'), groups: [
      { title: 'Clinics', links: [link('Find veterinary hospitals', category('vet')), link('Explore nearby clinics', category('vet'))] },
      { title: 'Appointments', links: [link('Book a consultation', category('vet')), link('My appointments', { type: 'appointments' })] },
      { title: 'Pet health', links: [link('Care essentials', product('care')), link('Daily wellness blend', product('wellness'))] },
    ],
  },
  {
    id: 'toys', label: 'Toys', heading: 'Pet Toys', description: 'More play for every personality.',
    cta: 'Shop Toys', action: category('accessories', 'play'), groups: [
      { title: 'Dog play', links: [link('Everyday play bundle', product('toy'))] },
      { title: 'Cat play', links: [link('Little hunter play set', product('cat-toy'))] },
      { title: 'Scratch & explore', links: [link('Scratch lounge', product('scratch')), link('All accessories', category('accessories'))] },
    ],
  },
  {
    id: 'health', label: 'Health & Wellness', heading: 'Pet Health & Wellness', description: 'Daily support and thoughtful essentials.',
    cta: 'Explore Pet Wellness', action: category('health'), groups: [
      { title: 'Daily wellness', links: [link('Daily wellness blend', product('wellness'))] },
      { title: 'Care essentials', links: [link('Everyday care essentials', product('care'))] },
      { title: 'Grooming care', links: [link('Oat & aloe shampoo', product('shampoo')), link('Soft-touch brush', product('brush'))] },
    ],
  },
  {
    id: 'offers', label: 'Offers', heading: 'Latest Offers', description: 'Current picks from the PetMeta catalog.',
    cta: 'View All Offers', action: category('offers'), groups: [
      { title: 'Bomb Deals', links: [link('Reveal current deals', { type: 'section', selector: '.bomb-deals' })] },
      { title: 'Deals of the day', links: [link('See daily deals', { type: 'section', selector: '.daily-deals' })] },
      { title: 'Current offers', links: [link('Travel water bottle', product('bottle')), link('Adventure harness', product('harness'))] },
    ],
  },
];
