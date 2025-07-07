import { Theme as NavigationTheme } from '@react-navigation/native';

export interface CustomTheme extends NavigationTheme {
  colors: NavigationTheme['colors'] & {
    accent: string;
    onSurface: string;
    onBackground: string;
    placeholder: string;
    backdrop: string;
    surface: string;
  };
}
