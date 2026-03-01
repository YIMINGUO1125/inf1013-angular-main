import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-edition-annonce',
  standalone: false,
  templateUrl: './edition-annonce.html',
  styleUrls: ['./edition-annonce.css']
})
export class EditionAnnonce implements OnInit {
  annonceId?: number;
  private annonceUserId = 0;
  annonceForm: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly annoncesService: AnnoncesService
  ) {
    this.annonceUserId = this.authService.getCurrentUser()?.id ?? 0;
    this.annonceForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      descriptionCourte: ['', [Validators.required, Validators.maxLength(200)]],
      descriptionLongue: ['', [Validators.required]],
      mensualite: [0, [Validators.required, Validators.min(1)]],
      dateDisponibilite: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      actif: [true, [Validators.required]],
      photos: [[], [Validators.required]]
    });
  }
  
  get photos(): string[] {
    return this.annonceForm.get('photos')?.value ?? [];
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }

    this.annonceId = Number(idParam);
    if (Number.isNaN(this.annonceId)) {
      this.annonceId = undefined;
      return;
    }

    this.annoncesService.getAnnonceById(this.annonceId).subscribe((annonce) => {
      if (!annonce) {
        return;
      }

      this.annonceUserId = annonce.userId;
      this.annonceForm.patchValue({
        titre: annonce.titre,
        descriptionCourte: annonce.descriptionCourte,
        descriptionLongue: annonce.descriptionLongue,
        mensualite: annonce.mensualite,
        dateDisponibilite: annonce.dateDisponibilite,
        adresse: annonce.adresse,
        actif: annonce.actif,
        photos: annonce.photos ?? []
      });
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const currentPhotos = this.photos;
          this.annonceForm.get('photos')?.setValue([...currentPhotos, reader.result]);
          this.annonceForm.get('photos')?.markAsTouched();
          this.annonceForm.get('photos')?.updateValueAndValidity();
        }
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePhoto(index: number): void {
    const currentPhotos = this.photos;
    currentPhotos.splice(index, 1);
    this.annonceForm.get('photos')?.setValue(currentPhotos);
    this.annonceForm.get('photos')?.updateValueAndValidity();
  }

  saveAnnonce(): void {
    if (this.annonceForm.invalid) {
      this.annonceForm.markAllAsTouched();
      return;
    }

    const formValue = this.annonceForm.getRawValue();
    const annoncePayload: Annonce = {
      id: this.annonceId ?? Date.now(),
      titre: formValue.titre ?? '',
      descriptionCourte: formValue.descriptionCourte ?? '',
      descriptionLongue: formValue.descriptionLongue ?? '',
      mensualite: formValue.mensualite ?? 0,
      dateDisponibilite: formValue.dateDisponibilite ?? '',
      adresse: formValue.adresse ?? '',
      consultations: 0,
      actif: formValue.actif ?? true,
      photos: formValue.photos ?? [],
      userId: this.annonceUserId
    };

    if (this.annonceId) {
      this.annoncesService.updateAnnonce(this.annonceId, annoncePayload);
    } else {
      this.annoncesService.createAnnonce(annoncePayload);
    }

    this.router.navigate(['/annonces']);
  }
}
