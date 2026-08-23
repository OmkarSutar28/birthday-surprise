import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BirthdayService } from './birthday.service';

export const unlockedGuard: CanActivateFn = () => {
  const birthdayService = inject(BirthdayService);
  const router = inject(Router);

  if (birthdayService.isUnlocked()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
