import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalRoleComponent } from '../../components/modal-role/modal-role.component';
import { ApiService } from '@/core/services/api.service';
import { RoleService } from '@/core/services/role.service';
import { ModalRoleEditComponent } from '../../components/modal-role-edit/modal-role-edit.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
})
export class RolePage  {
  private modalService = inject( NgbModal );
  private apiService = inject(ApiService);

  roles = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
      this.getRoles()
  }

  open() {
		const modal = this.modalService.open(ModalRoleComponent);
    modal.result.then((res: any) => {
      if (res === 'OK') {
        this.getRoles()
      }
    });
}

 openEdit(role: any) {
  const modalRef = this.modalService.open(ModalRoleEditComponent);
  modalRef.componentInstance.role = role;

  modalRef.result.then((res: any) => {
    if (res === 'OK') {
      this.getRoles();
    }
  });
}



  getRoles() {
    this.isLoading.set(true)
    this.apiService.get('roles').subscribe({
      next: (data: any) => {
        console.log(data);
        this.roles.set(data) ;
        this.isLoading.set(false);

      }
    })
  }

deleteRole(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce role ?')) {
      this.apiService.delete('roles', id).subscribe({
        next: () => {
          this.getRoles()
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du role', err);
        }
      });
    }
  }
}
