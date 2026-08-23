import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BirthdayService } from '../../services/birthday.service';

const CODE_LENGTH = 5;

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.css'],
})
export class LockScreenComponent {
  digits: string[] = [];
  error = false;
  shake = false;
  checking = false;
  keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  codeLength = CODE_LENGTH;

  constructor(private birthdayService: BirthdayService, private router: Router) {}

  press(key: string): void {
    if (this.checking) return;

    if (key === '⌫') {
      this.digits.pop();
      this.error = false;
      return;
    }
    if (key === '') return;

    if (this.digits.length < CODE_LENGTH) {
      this.digits.push(key);
      this.error = false;
    }

    if (this.digits.length === CODE_LENGTH) {
      this.submit();
    }
  }

  private submit(): void {
    this.checking = true;
    const code = this.digits.join('');

    this.birthdayService.verifyPasscode(code).subscribe({
      next: () => {
        this.checking = false;
        this.birthdayService.markUnlocked();
        this.router.navigate(['/card']);
      },
      error: () => {
        this.checking = false;
        this.error = true;
        this.shake = true;
        setTimeout(() => {
          this.shake = false;
          this.digits = [];
        }, 500);
      },
    });
  }
}
