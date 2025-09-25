import { ApiService } from '@/core/services/api.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


interface TypeAdministration {
  libelle: string;
}
@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule],   
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
   @Output() filterChange = new EventEmitter<{ search: string, categorie: string }>();

  form = new FormGroup({
    search: new FormControl(''),
    categorie: new FormControl('')
  });

  categories: TypeAdministration[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.get('type-administration').subscribe({
      next: (res: any) => {
        console.log('Types récupérés:', res);
        this.categories = res.map((type: any) => ({
          libelle: type.libelle,
          id: type.id,
        }));
      },
      error: (err) => console.error('Erreur récupération catégories', err)
    });
  }

  applySearch() {
    this.filterChange.emit({
      search: this.form.controls.search.value || '',
      categorie: this.form.controls.categorie.value || ''
    });
  }
}

