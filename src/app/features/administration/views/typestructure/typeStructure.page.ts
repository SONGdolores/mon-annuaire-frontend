import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@/core/services/api.service';
import { ModalTypeAdminComponent } from '../../components/modal-type-admin/modal-type-admin.component';
import { ModalTypeAdminEditComponent } from '../../components/modal-type-admin-edit/modal-type-admin-edit.component';

@Component({
  selector: 'app-typeStructure',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './typeStructure.page.html',
  styleUrls: ['./typeStructure.page.scss'],
})
export class TypeStructurePage implements OnInit {
  private modalService = inject(NgbModal);
  private apiService = inject(ApiService);

  typeAdministration = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
    this.getTypeAdministration();
  }

  open() {
    const modal = this.modalService.open(ModalTypeAdminComponent);
    modal.result.then((res: any) => {
      if (res === 'OK') {
        this.getTypeAdministration();
      }
    }).catch(() => { });
  }


  openEdit(typeAdmin: any) {
    const modalRef = this.modalService.open(ModalTypeAdminEditComponent);
    modalRef.componentInstance.typeAdmin = typeAdmin;

    modalRef.result.then((res: any) => {
      if (res === 'OK') {
        this.getTypeAdministration();
      }
    });
  }


  getTypeAdministration() {
    this.isLoading.set(true)
    this.apiService.get('type-administration').subscribe({
      next: (data: any) => {
        console.log(data);
        this.typeAdministration.set(data);
        this.isLoading.set(false);
      }
    })
  }

  deleteTypeAdministration(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce type dadministrations ?')) {
      this.apiService.delete('type-administration', id).subscribe({
        next: () => {
          this.getTypeAdministration();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du Type dadministration', err);
        }
      });
    }
  }
}

