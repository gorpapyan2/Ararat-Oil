import type { Preview } from '@storybook/react';

/**
 * Ararat OIL Design System Colors
 * Olive-Lime Palette
 */
const colors = {
  black: '#000000',
  darkOlive: '#3E432E',
  olive: '#616F39',
  lime: '#A7D129',
  white: '#FFFFFF',
  lightOlive: '#F8F9F5',
};

/**
 * Storybook preview configuration for Ararat OIL project
 * Organizes stories and applies design system parameters
 */
const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: colors.lightOlive },
        { name: 'dark', value: colors.black },
        { name: 'olive', value: colors.olive },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default organized by feature for navigation in sidebar
    options: {
      storySort: {
        order: ['Core', 'Features', 'Shared', '*'],
        method: 'alphabetical',
      },
    },
    // Responsive testing viewports
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '812px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        widescreen: {
          name: 'Widescreen',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    // Branding in Storybook docs
    docs: {
      theme: {
        brandTitle: 'Ararat OIL Component Library',
        brandUrl: '/',
        brandTarget: '_self',
        colorPrimary: colors.olive,
        colorSecondary: colors.lime,
      },
    },
  },
};

export default preview;