import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdayConfig, BirthdayService } from '../../services/birthday.service';

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

const CONFETTI_COLORS = ['#e8b86d', '#ffb3c1', '#fdfaf3', '#a91e34', '#ffe3a3'];

@Component({
  selector: 'app-cake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.css'],
})
export class CakeComponent implements OnInit {
  config: BirthdayConfig | null = null;
  candlesLit = true;
  celebrated = false;
  confetti: ConfettiPiece[] = [];

  constructor(private birthdayService: BirthdayService) {}

  ngOnInit(): void {
    this.birthdayService.getConfig().subscribe((cfg) => (this.config = cfg));
  }

  blowCandles(): void {
    if (!this.candlesLit) return;
    this.candlesLit = false;
    this.celebrated = true;
    this.confetti = Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotate: Math.random() * 360,
    }));
  }

  relight(): void {
    this.candlesLit = true;
    this.celebrated = false;
    this.confetti = [];
  }
}
