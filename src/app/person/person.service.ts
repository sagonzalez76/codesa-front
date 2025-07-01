import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from './person.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = environment.apiUrl + '/personas';

  constructor(private http: HttpClient) { }

  getAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<{ content: Person[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);

    return this.http.get<{ content: Person[]; totalElements: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  create(person: Person): Observable<Person> {
    console.log(person);
    return this.http.post<Person>(this.apiUrl, person);
  }

  update(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
