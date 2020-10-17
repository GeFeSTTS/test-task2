import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REQUEST_API } from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }

  getAllTodos() {
    return this.http.get(`${REQUEST_API}/items`);
  }

  getChosenTodo(id) {
    return this.http.get(`${REQUEST_API}/items/${id}`);
  }

  addNewTodo(body) {
    return this.http.post(`${REQUEST_API}/items`, {...body});
  }

  editTodo(body) {
    return this.http.put(`${REQUEST_API}/items/${body.id}`, {...body});
  }

  deleteTodo(id) {
    return this.http.delete(`${REQUEST_API}/items/${id}`);
  }
}
