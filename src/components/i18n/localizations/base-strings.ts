const baseStrings = {
    'routes.home': '/',
    'routes.about': '/om-oss',

    'home.title': 'Hem',
    'home.content': 'Tack för besöket!',

    'about.title': 'Om oss',
    'about.content': 'Detta är vi',

    'error.title': 'Fel!',
    'error.content': 'Ooops!'
};

export type LanguageStrings = typeof baseStrings;
export const sv = baseStrings;