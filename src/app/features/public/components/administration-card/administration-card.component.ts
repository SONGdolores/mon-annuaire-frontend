import { Component, inject, Input } from '@angular/core';
import { AdministrationModel } from '../../models/administration.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration-card',
  standalone: true,
  templateUrl: './administration-card.component.html',
  styleUrls: ['./administration-card.component.scss']
})
export class AdministrationCardComponent {
@Input() administration!: AdministrationModel;


router = inject(Router)

goToDetails(id: string) {
  alert(id)
  this.router.navigate(['/public/detailscards/'+id]);
}
}

