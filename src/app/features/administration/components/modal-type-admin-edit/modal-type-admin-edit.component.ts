import { ApiService } from '@/core/services/api.service';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-type-admin-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './modal-type-admin-edit.component.html',
  styleUrls: ['./modal-type-admin-edit.component.scss']
})
export class ModalTypeAdminEditComponent {

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  public activeModal = inject(NgbActiveModal);

  @Input() typeAdmin!: any;

  typeAdminForm!: FormGroup;
  isLoading = false;
  dataLoading = signal(true)
  errorMessage: string | null = null;

   ngOnInit() {
    this.typeAdminForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
    });

    // la valeur qui etait dans le  champ
    if (this.typeAdmin) {
      this.typeAdminForm.patchValue({
        libelle: this.typeAdmin.libelle
      });
    }
  }

  // la modification
  updateTypeAdmin() {
    if (this.typeAdminForm.invalid) return;

    this.isLoading = true;

    const updatedData = {
      libelle: this.typeAdminForm.value.libelle
    };

    this.apiService.patch('type-administration/' + this.typeAdmin.id, updatedData).subscribe({
      next: () => {
        this.isLoading = false;
        this.activeModal.close('OK');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour du type d’administration';
        console.error(err);
      }
    });
  }

  // Fermer la modale
  close() {
    this.activeModal.dismiss();
  }
}
