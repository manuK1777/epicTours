import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  // {
  //   navCap: 'Home',
  // },
  // {
  //   displayName: 'Home',
  //   iconName: 'ic:outline-home',
  //   route: '/home',
  // },
  {
    displayName: 'Artists',
    iconName: 'tabler:users-group',
    route: 'home/artist-card',
  },
  {
    displayName: 'Venues',
    iconName: 'solar:point-on-map-perspective-bold-duotone',
    route: 'home/venues',
  },
  {
    displayName: 'Calendar',
    iconName: 'solar:calendar-line-duotone',
    route: 'home/calendar',
  },
  // {
  //   displayName: 'Charts',
  //   iconName: 'solar:chart-bold-duotone',
  //   route: 'home/charts',
  // },
]; //move down to have the res

// {
//   divider: true,
//   navCap: 'Other',
// },
// {
//   displayName: 'Menu Level',
//   iconName: 'solar:align-horizontal-center-line-duotone',
//   route: '/menu-level',
// children: [
//   {
//     displayName: 'Menu 1',
//     iconName: 'solar:round-alt-arrow-right-line-duotone',
//     route: '/menu-1',
//     children: [
//       {
//         displayName: 'Menu 1',
//         subItemIcon: true,
//         iconName: 'solar:round-alt-arrow-right-line-duotone',
//         route: '/menu-1',
//       },

//       {
//         displayName: 'Menu 2',
//         subItemIcon: true,
//         iconName: 'solar:round-alt-arrow-right-line-duotone',
//         route: '/menu-2',
//       },
//     ],
//   },

//   {
//     displayName: 'Menu 2',
//     iconName: 'solar:round-alt-arrow-right-line-duotone',
//     route: '/menu-2',
//   },
// ],
// },
// {
//   displayName: 'Disabled',
//   iconName: 'solar:bookmark-circle-line-duotone',
//   route: '/disabled',
//   disabled: true,
// },
// {
//   displayName: 'Chip',
//   iconName: 'solar:branching-paths-up-line-duotone',
//   route: '/',
//   chip: true,
//   chipClass: 'bg-primary text-white',
//   chipContent: '9',
// },
// {
//   displayName: 'Outlined',
//   iconName: 'solar:add-square-line-duotone',
//   route: '/',
//   chip: true,
//   chipClass: 'b-1 border-primary text-primary',
//   chipContent: 'outlined',
// },
// {
//   displayName: 'External Link',
//   iconName: 'solar:link-round-angle-bold-duotone',
//   route: 'https://www.google.com/',
//   external: true,
// },
