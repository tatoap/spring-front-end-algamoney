import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  constructor(private http: HttpClient) { }

  categoriasUrl = 'http://localhost:8080/categorias';

  categoriaToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNjIxOTExNTc1LCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSJdLCJqdGkiOiJmMTM5OWU0Ni0zNzJlLTQ3OWQtOTZlMi0xOTEzYTNjYzZjMzciLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.INgAtrxZU59LX0YxtXGXBmNMUVNEyi3KdEAva_y1efk';

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders()
      .append("Authorization", this.categoriaToken);

    return this.http.get(this.categoriasUrl, { headers })
      .toPromise();
  }
}
