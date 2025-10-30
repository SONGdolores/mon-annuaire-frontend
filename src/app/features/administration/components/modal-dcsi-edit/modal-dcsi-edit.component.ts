import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-modal-dcsi-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-dcsi-edit.component.html',
  styleUrl: './modal-dcsi-edit.component.scss',
})
export class ModalDcsiEditComponent {
  @Input() dcsi: any;

 
  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  apiService = inject(ApiService);

  dcsiForm!: FormGroup;
  administrations: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadAdministrations();
  }

  private initForm(): void {
    this.dcsiForm = this.fb.group({
      responsableNom: [this.dcsi?.responsableNom ?? '', Validators.required],
      responsableEmail: [this.dcsi?.responsableEmail ?? '', [Validators.required, Validators.email]],
      responsablePhone: [this.dcsi?.responsablePhone ?? ''],
      chefServiceNom: [this.dcsi?.chefServiceNom ?? '', Validators.required],
      chefServiceEmail: [this.dcsi?.chefServiceEmail ?? '', [Validators.required, Validators.email]],
      chefServicePhone: [this.dcsi?.chefServicePhone ?? ''],
      administrationId: [this.dcsi?.administrationId ?? '', Validators.required],
    });
  }

  loadAdministrations(): void {
    this.apiService.get('administrations').subscribe({
      next: (data: any) => (this.administrations = data),
      error: (err) => console.error('Erreur lors du chargement des administrations', err),
    });
  }

  onSubmit(): void {
    if (this.dcsiForm.invalid) {
      this.dcsiForm.markAllAsTouched();
      return;
    }

    const dcsiData = this.dcsiForm.value;

    this.apiService.patch(`dcsi/${this.dcsi.id}`, dcsiData).subscribe({
      next: (response: any) => {
        console.log('✅ DCSI mis à jour avec succès', response);
        this.successMessage = 'Le DCSI a été mis à jour avec succès';
        this.errorMessage = null;
        this.activeModal.close('OK');
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour du DCSI', err);

        if (err.status === 409) {
          this.errorMessage = 'Un DCSI pour cette administration existe déjà';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour du DCSI';
        }

        this.successMessage = null;
      },
    });
  }
}
