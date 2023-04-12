import { IPuff } from '../components';
import { Category } from '../graphql/__generated__/Category';

const areasColors: ColorGroupOverride = {
  accent: 'pinkPop', //Color for puff title
  background: 'gray800',
};

const themesColors: ColorGroupOverride = {
  accent: 'gray900', //Color for puff title
  background: 'pinkPop',
};

//todo: Get icons from strapi
let iconInject: DiggIcon[] = ['bookThin', 'ehalsodata', 'elektriskavagar', 'rymddata', 'statistik'];

export const populatePuffs = (categories: Category[], type: 'dataomraden' | 'teman'): IPuff[] => {
  const isArea = type === 'dataomraden';
  return categories.map((category, i) => ({
    title: category.name,
    slug: category.slug,
    colors: isArea ? areasColors : themesColors,
    ...(isArea ? { icon: iconInject[i] } : {}),
  }));
};
