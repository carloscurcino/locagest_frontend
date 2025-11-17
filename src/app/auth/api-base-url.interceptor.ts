import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  private readonly baseUrl = 'http://localhost:8080'; // Substitua pela URL base da sua API

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // ou onde você salvar o token

    let apiReq = req.url.startsWith('http')
      ? req
      : req.clone({ url: `${this.baseUrl}${req.url}` });

    if (token) {
      apiReq = apiReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(apiReq);
  }
}
