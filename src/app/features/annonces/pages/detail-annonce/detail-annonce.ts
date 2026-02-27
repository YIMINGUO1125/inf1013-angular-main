import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { FormBuilder,Validators } from '@angular/forms';
import { AnnoncesService } from '../../annonces';
import { Annonce } from '../../../../models/annonce.model';
import { AuthService } from '../../../../core/auth';

@Component({
  selector: 'app-detail-annonce',
  standalone: false,
  templateUrl: './detail-annonce.html',
  styleUrls: ['./detail-annonce.css']
})
export class DetailAnnonce implements OnInit {
  annonce?: Annonce;
  loading = true;
  notFound = false;
  isConnected = false;
  contactSentMessage = '';

  contactForm: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly annoncesService: AnnoncesService,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.formBuilder.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.isConnected = this.authService.isLoggedIn();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.annoncesService.getAnnonceById(id).subscribe({
      next: (annonce) => {
        this.annonce = annonce;
        this.notFound = !annonce;
        this.cdr.detectChanges();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  sendContact(): void {
    if (!this.isConnected || this.contactForm.invalid || !this.annonce) {
      this.contactForm.markAllAsTouched();
      return;
    }

    console.log('Contact envoyé (simulé):', {
      annonceId: this.annonce.id,
      ...this.contactForm.value
    });
    
    this.contactSentMessage = 'Message envoyé avec succès.';
    this.contactForm.reset();
  }
}

