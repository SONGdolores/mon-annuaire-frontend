import { ApiService } from '@/core/services/api.service';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-role-edit',
  standalone: true,
   imports: [ReactiveFormsModule, NgbModalModule,  NgSelectModule],
  templateUrl: './modal-role-edit.component.html',
  styleUrls: ['./modal-role-edit.component.scss']
})
export class ModalRoleEditComponent {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  public activeModal = inject(NgbActiveModal);

  @Input() role!: any;  // role à modifier


  roleForm!: FormGroup;
  permissions: any[] = [];
  isLoading = false;
  dataLoading = signal(true)
  errorMessage: string | null = null;

  ngOnInit() {
    this.roleForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      permissions: new FormControl('', [Validators.required]),
    })
    console.log(this.role),
     this.roleForm.patchValue({
      nom: this.role.nom,
      code: this.role.code,
      description: this.role.description,
      permissions: this.role.permissions.map((perm: any) => perm.id)
    });
    this.loadPermissions();
  }


  // Charger toute les permissions disponibles
  loadPermissions() {
    this.apiService.get('permissions').subscribe({
      next: (data: any) => {this.permissions = data; this.dataLoading.set(false)},
      error: (err) => console.error('Erreur lors du chargement des permissions', err)
    });
  }

  // Soumettre la modification de la permission du code et de la description
  updateRole() {
    if (this.roleForm.invalid) return;

    this.isLoading = true;

    const updatedData = {
    code: this.roleForm.value.code,
    description: this.roleForm.value.description,
    permissions: this.roleForm.value.permissions,
  };

    this.apiService.patch('roles/'+ this.role.id, updatedData).subscribe({
      next: () => {
        this.isLoading = false;
        this.activeModal.close('OK');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour de la permission';
        console.error(err);
      }
    });
  }

  // Fermer la modale sans enregistrer
  close() {
    this.activeModal.dismiss();
  }

}
