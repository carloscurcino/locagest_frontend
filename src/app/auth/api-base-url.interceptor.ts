import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token && this.auth.isTokenExpired(token)) {
      this.auth.logout();
      return next.handle(req);
    }

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

    return next.handle(apiReq).pipe(
      tap(
        () => {},
        (error: any) => {
          if (error.status === 401) {
            this.auth.logout();
          }
        }
      )
    );
  }
}
