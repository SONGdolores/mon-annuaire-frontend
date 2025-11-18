import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient)
  private apiUrl = environment.endpoint;

  post(url:string, data: any) {
    return this.http.post(this.apiUrl+url, data)
  }

  /*get(url: string) {
    return this.http.get(this.apiUrl+url)
  }
*/

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams });
  }

 delete(url: string, id: string) {
    return this.http.delete(`${this.apiUrl+url}/${id}`);
}

  patch(url: string, data:any) {
    return this.http.patch(this.apiUrl+url, data)
  }

  uploadCover(administrationId: string, formData: FormData): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/administrations/${administrationId}/cover`,
    formData
  );
  
}

  // getAllCovers(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  // getCoverById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`);
  // }

}
