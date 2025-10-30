import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-modal-dcsi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-dcsi.component.html',
  styleUrls: ['./modal-dcsi.component.scss'],
})
export class ModalDcsiComponent {

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  activeModal = inject(NgbActiveModal);


  administrations = signal<any[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);


  dcsiForm = this.fb.group({
    responsableNom: ['', Validators.required],
    responsableEmail: ['', [Validators.required, Validators.email]],
    responsablePhone: [''],
    chefServiceNom: ['', Validators.required],
    chefServiceEmail: ['', [Validators.required, Validators.email]],
    chefServicePhone: [''],
    administrationId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadAdministrations();
  }


  loadAdministrations(): void {
  this.apiService.get('administrations').subscribe({
    next: (res: any) => {
      const list = Array.isArray(res.data) ? res.data : [];
      this.administrations.set(list);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des administrations', err);
      this.errorMessage.set("Impossible de charger la liste des administrations.");
    },
  });
}


  onSubmit(): void {
    if (this.dcsiForm.invalid) {
      this.dcsiForm.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      this.successMessage.set(null);
      return;
    }

    const dcsiData = this.dcsiForm.value;

    this.apiService.post('dcsi', dcsiData).subscribe({
      next: (response: any) => {
        console.log('✅ DCSI créé avec succès', response);
        this.successMessage.set('Le DCSI a été créé avec succès');
        this.errorMessage.set(null);


        setTimeout(() => {
          this.activeModal.close(response);
        }, 800);
      },
      error: (err) => {
        console.error('Erreur lors de la création du DCSI', err);

        if (err.status === 409) {
          this.errorMessage.set('Un DCSI pour cette administration existe déjà');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Une erreur est survenue lors de la création du DCSI');
        }

        this.successMessage.set(null);
      },
    });
  }
}
