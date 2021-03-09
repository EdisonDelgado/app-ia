import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_SERVER } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  /**
   * Sube una nueva imagen para su clasificación
   * @param imageBase64 base64 imagen
   */
  detect(formdata: any): Observable<any> {
    return this.http.post(`${API_SERVER}/predict`, formdata, { headers: this.headers });
  }
}
