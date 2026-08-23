import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PasscodeResponse {
  success: boolean;
  message: string | null;
}

export interface BirthdayConfig {
  recipientName: string;
  mainPhotoUrl: string;
  mainCaption: string;
  letterTitle: string;
  letterBody: string;
  signatureName: string;
}

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private readonly apiUrl = environment.apiUrl;
  private readonly assetsBase = environment.photosBaseUrl;
  private unlocked = false;

  constructor(private http: HttpClient) {}

  verifyPasscode(code: string): Observable<PasscodeResponse> {
    return this.http.post<PasscodeResponse>(`${this.apiUrl}/verify-passcode`, { code });
  }

  getConfig(): Observable<BirthdayConfig> {
    return this.http.get<BirthdayConfig>(`${this.apiUrl}/config`);
  }

  getGalleryPhotos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/photos`);
  }

  /** Turns a relative "/photos/x.jpg" path from the API into a full, loadable URL. */
  resolvePhotoUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    return relativeUrl.startsWith('http') ? relativeUrl : `${this.assetsBase}${relativeUrl}`;
  }

  markUnlocked(): void {
    this.unlocked = true;
    sessionStorage.setItem('birthday_unlocked', 'true');
  }

  isUnlocked(): boolean {
    return this.unlocked || sessionStorage.getItem('birthday_unlocked') === 'true';
  }
}
