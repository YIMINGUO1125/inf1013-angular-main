import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AnnoncesService } from '../../annonces';
import { Annonce } from '../../../../models/annonce.model';

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

  // Jalon I: bool mock (later bind with AuthService)
  isConnected = false;

  contactForm: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly annoncesService: AnnoncesService,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.formBuilder.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
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

  sendContact(): void {
    if (!this.isConnected || this.contactForm.invalid || !this.annonce) {
      this.contactForm.markAllAsTouched();
      return;
    }

    console.log('Contact envoyé (simulé):', {
      annonceId: this.annonce.id,
      ...this.contactForm.value
    });

    this.contactForm.reset();
  }
}

