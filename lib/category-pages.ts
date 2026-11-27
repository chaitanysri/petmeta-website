import {shopMenus,type ShopMenuAction} from './shop-menu';

/** The nav items that open their own page (Pets already has /pets). */
export const CATEGORY_SLUGS=['food','accessories','grooming','vet','toys','health','offers'] as const;
export type CategorySlug=typeof CATEGORY_SLUGS[number];

/** Which store-catalog products belong on each page. */
export const CATEGORY_PRODUCTS:Record<CategorySlug,{categories?:string[];ids?:string[]}>={
  food:{categories:['food']},
  accessories:{categories:['accessories'],ids:['collar','harness','bottle','bowls','scratch','toy']},
  grooming:{categories:['grooming']},
  vet:{categories:['health'],ids:['care','wellness']},
  toys:{ids:['toy','cat-toy','scratch']},
  health:{categories:['health','grooming'],ids:[]},
  offers:{categories:['offers']},
};

/** Pages where the main job is booking a provider rather than buying a product. */
export const SERVICE_PAGES:Partial<Record<CategorySlug,{label:string;href:string}>>={
  grooming:{label:'Book a grooming session',href:'/home?category=grooming#appointment-form'},
  vet:{label:'Book a vet consultation',href:'/home?category=vet#appointment-form'},
};

const PRODUCT_PAGE:Record<string,CategorySlug>={
  'food-dog':'food','food-cat':'food','treats':'food','kitten-food':'food',
  brush:'grooming',shampoo:'grooming',towel:'grooming',
  wellness:'health',care:'health',
  toy:'toys','cat-toy':'toys',scratch:'toys',
  collar:'accessories',harness:'accessories',bottle:'accessories',bowls:'accessories',
};

/** The page URL for any shop-menu action. Pets keep their own routes. */
export function actionHref(action:ShopMenuAction):string|null{
  if(action.type==='pet')return action.pet==='all'?'/pets':`/pets/${action.pet}`;
  if(action.type==='category'){
    if(action.category==='accessories'&&action.query==='play')return '/toys';
    if(action.category==='pets')return '/pets';
    const slug=action.category as CategorySlug;
    if(!CATEGORY_SLUGS.includes(slug))return null;
    return action.query?`/${slug}?search=${encodeURIComponent(action.query)}`:`/${slug}`;
  }
  if(action.type==='product')return `/${PRODUCT_PAGE[action.productId]??'accessories'}?product=${encodeURIComponent(action.productId)}`;
  if(action.type==='section')return `/offers?section=${action.selector.replace(/^\./,'')}`;
  return null; // appointments stays an in-page panel
}

export type CategoryPoint={title:string;image:string;links:{label:string;action:ShopMenuAction}[]};
export type CategoryPageConfig={slug:CategorySlug;label:string;eyebrow:string;heading:string;description:string;cta:string;ctaAction:ShopMenuAction;points:CategoryPoint[]};

/** Each dropdown group becomes one "point" with its own image (/category-images/<slug>-<n>.svg). */
export function categoryConfig(slug:CategorySlug):CategoryPageConfig{
  const menu=shopMenus.find(m=>m.id===slug)!;
  return {
    slug,label:menu.label,eyebrow:menu.label.toUpperCase(),heading:menu.heading,description:menu.description,cta:menu.cta,ctaAction:menu.action,
    points:menu.groups.map((g,i)=>({title:g.title,image:`/category-images/${slug}-${i}.svg`,links:g.links})),
  };
}
