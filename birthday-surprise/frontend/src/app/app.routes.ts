import { Routes } from '@angular/router';
import { unlockedGuard } from './services/unlocked.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/lock-screen/lock-screen.component').then((m) => m.LockScreenComponent),
  },
  {
    path: 'card',
    canActivate: [unlockedGuard],
    loadComponent: () => import('./components/card/card.component').then((m) => m.CardComponent),
  },
  {
    path: 'letter',
    canActivate: [unlockedGuard],
    loadComponent: () =>
      import('./components/letter/letter.component').then((m) => m.LetterComponent),
  },
  {
    path: 'cake',
    canActivate: [unlockedGuard],
    loadComponent: () => import('./components/cake/cake.component').then((m) => m.CakeComponent),
  },
  { path: '**', redirectTo: '' },
];
