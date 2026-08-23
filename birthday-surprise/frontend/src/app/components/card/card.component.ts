import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BirthdayConfig, BirthdayService } from '../../services/birthday.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  config: BirthdayConfig | null = null;
  photoUrl = '';

  constructor(private birthdayService: BirthdayService, private router: Router) {}

  ngOnInit(): void {
    this.birthdayService.getConfig().subscribe((cfg) => {
      this.config = cfg;
      this.photoUrl = this.birthdayService.resolvePhotoUrl(cfg.mainPhotoUrl);
    });
  }

  goToLetter(): void {
    this.router.navigate(['/letter']);
  }
}
