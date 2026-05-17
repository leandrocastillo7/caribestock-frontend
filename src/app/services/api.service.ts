import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://caribestock-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`, { headers: this.getHeaders() });
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto, { headers: this.getHeaders() });
  }

  updateProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto, { headers: this.getHeaders() });
  }

  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, { headers: this.getHeaders() });
  }

  getMovimientos(productoId?: string): Observable<any> {
    const url = productoId ? `${this.apiUrl}/movimientos?productoId=${productoId}` : `${this.apiUrl}/movimientos`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  createMovimiento(movimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimientos`, movimiento, { headers: this.getHeaders() });
  }
}