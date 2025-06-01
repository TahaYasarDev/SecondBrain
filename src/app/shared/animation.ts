// src/app/shared/animations.ts
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
  transition('visible => hidden', animate('500ms ease-out')),
  transition('hidden => visible', animate('500ms ease-in')),
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate('500ms ease-out'),
  ]),
  transition(':leave', [
    animate(
      '500ms ease-in',
      style({ opacity: 0, transform: 'translateY(-10px)' })
    ),
  ]),
]);
