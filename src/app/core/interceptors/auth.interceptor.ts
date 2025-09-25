import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


Injectable()
export function loginInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn): Observable<HttpEvent<any>> {

  //recuperer le token dans le localStorage
  const token = localStorage.getItem('token');

  // verifie si le token existe si oui ca clone
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // sinon laisser la requete 

  return next(req);
}




