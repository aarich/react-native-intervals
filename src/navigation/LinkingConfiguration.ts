import { LinkingOptions } from '@react-navigation/native';

const options: LinkingOptions = {
  prefixes: ['https://projects.mrarich.com/intervals/', 'intervals://'],
  config: {
    initialRouteName: 'Flows',
    screens: {
      Flows: {
        initialRouteName: 'LibraryScreen',
        path: '/intervals/flows',
        screens: {
          LibraryScreen: '/all',
          ViewScreen: '/view',
          EditScreen: '/edit',
        },
      },
      More: {
        path: '/intervals/options',
        initialRouteName: 'MoreScreen',
        screens: {
          MoreScreen: '',
          AboutScreen: 'about',
          FeedbackScreen: 'feedback',
          HelpScreen: 'help',
        },
      },
      NotFound: '*',
    },
  },
};

export default options;
