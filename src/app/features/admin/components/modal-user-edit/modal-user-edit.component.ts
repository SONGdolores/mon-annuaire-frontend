import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-user-edit',
  standalone: true,
  imports: [NgbModalModule, ReactiveFormsModule],
  templateUrl: './modal-user-edit.component.html',
  styleUrls: ['./modal-user-edit.component.scss']
})
export class ModalUserEditComponent {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  public activeModal = inject(NgbActiveModal);

  @Input() user!: any;  // utilisateur à modifier


  userForm!: FormGroup;
  roles: any[] = [];
  isLoading = false;
  dataLoading = signal(true)
  errorMessage: string | null = null;

  ngOnInit() {
    this.userForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
    })
    console.log(this.user),
     this.userForm.patchValue({
      login: this.user.login,
      roleId: this.user.roleId
    });
    this.loadRoles();
  }


  // Charger tous les rôles disponibles
  loadRoles() {
    this.apiService.get('roles').subscribe({
      next: (data: any) => {this.roles = data; this.dataLoading.set(false)},
      error: (err) => console.error('Erreur lors du chargement des rôles', err)
    });
  }

  // Soumettre la modification du rôle
  updateUserRole() {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    this.apiService.patch('utilisateurs/'+ this.user.id, this.userForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.activeModal.close('OK'); // fermer la modale
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour du rôle';
        console.error(err);
      }
    });
  }

  // Fermer la modale sans enregistrer
  close() {
    this.activeModal.dismiss();
  }
}
