// IMPORTS
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';

// DÉFINITION DU COMPOSANT
@Component({
  selector: 'app-inscription',          
  standalone: false,                     
  templateUrl: './inscription.html',    
  styleUrls: ['./inscription.css']      
})
export class Inscription implements OnInit {

  // FORMULAIRE ET VARIABLES
  inscriptionForm!: FormGroup;          
  errorMessage: string = '';             

  // CONSTRUCTEUR
  constructor(
    private fb: FormBuilder,             
    private authService: AuthService,    
    private router: Router               
  ) {}

  // MÉTHODE INITIALE
  ngOnInit(): void {
    // Initialisation du formulaire avec les champs requis et validations
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],                              
      prenom: ['', Validators.required],                           
      telephone: ['', Validators.required],                        
      email: ['', [Validators.required, Validators.email]],        
      adresse: ['', Validators.required],                           
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', Validators.required]                  
    }, { validators: this.passwordMatchValidator });              
  }

  // VALIDATION PERSONNALISÉE MOT DE PASSE
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');                    
    const confirmPassword = control.get('confirmPassword');      

    // Retourne null si les mots de passe correspondent, sinon un objet d'erreur
    return password?.value === confirmPassword?.value
      ? null
      : { passwordMismatch: true };
  }

  // MÉTHODE DE SOUMISSION DU FORMULAIRE
  onSubmit(): void {

    // Si le formulaire est invalide, ne rien faire
    if (this.inscriptionForm.invalid) return;

    // Copie des valeurs du formulaire et suppression de confirmPassword avant l'envoi
    const userData = { ...this.inscriptionForm.value };
    delete userData.confirmPassword;

    // Appel du service d'inscription
    this.authService.register(userData).subscribe({
      next: () => {                      
        alert('Compte créé avec succès !');  
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {                 
        this.errorMessage = err.message; 
      }
    });
  }
}