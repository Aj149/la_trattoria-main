import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authservice {
  private apiUrl = 'http://127.0.0.1:5000/app';

  constructor(private http: HttpClient) {}

  realizarPago(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return this.http.post(`${this.apiUrl}/insertar/Reservas`, data, { headers });
  }

  obtenerPago(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ver/ambientes/${id}`);
  }

  obtenerPagos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ver/pagos/`);
  }

  eliminarPago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarPago(id: string, data: any): Observable<any> {
    return this.procesarPeticion('put', `${this.apiUrl}/actualizar/pagos/${id}`, data);
  }

  procesarPeticion(method: string, url: string, data = {}): Observable<any> {
    let request$: Observable<any> | undefined;

    switch (method.toLowerCase()) {
      case 'get':
        request$ = this.http.get(url);
        break;
      case 'post':
        request$ = this.http.post(url, data);
        break;
      case 'put':
        request$ = this.http.put(url, data);
        break;
      case 'delete':
        request$ = this.http.delete(url);
        break;
      default:
        console.error('Método HTTP no soportado');
        request$ = new Observable<any>(); 
        break;
    }

    if (!request$) {
      request$ = new Observable<any>(); 
    }

    return request$;
  }
}
