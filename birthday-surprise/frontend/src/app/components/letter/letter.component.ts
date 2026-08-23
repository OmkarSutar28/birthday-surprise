import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BirthdayConfig, BirthdayService } from '../../services/birthday.service';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css'],
})
export class LetterComponent implements OnInit {
  config: BirthdayConfig | null = null;
  paragraphs: string[] = [];
  photos: string[] = [];
  liked = false;

  constructor(private birthdayService: BirthdayService, private router: Router) {}

  ngOnInit(): void {
    this.birthdayService.getConfig().subscribe((cfg) => {
      this.config = cfg;
      this.paragraphs = cfg.letterBody.split('\n').filter((p) => p.trim().length > 0);
    });

    this.birthdayService.getGalleryPhotos().subscribe((photos) => {
      this.photos = photos.map((p) => this.birthdayService.resolvePhotoUrl(p));
    });
  }

  toggleLike(): void {
    this.liked = !this.liked;
  }

  goToCake(): void {
    this.router.navigate(['/cake']);
  }
}
