import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ContainerResponse } from "../models/container-resp";
import { ContainerRequest } from "../models/container-req";


@Injectable({
  providedIn: 'root'
})
export class ContainersService {
  private REST_API_SERVER = "http://localhost:8000/containers";

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  //Get All Containers
  getAll(): Observable<ContainerResponse[]> {
    return this.httpClient.get<ContainerResponse[]>(this.REST_API_SERVER)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  // get a Container by id
  getById(containerId: string): Observable<ContainerResponse> {
    return this.httpClient.get<ContainerResponse>(this.REST_API_SERVER + '/' + containerId)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // run a container
  run(containerReq: ContainerRequest): Observable<ContainerRequest> {
    return this.httpClient.post<ContainerRequest>(this.REST_API_SERVER, JSON.stringify(containerReq), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // delete a Container by id
  deleteById(containerId: string) {
    return this.httpClient.delete(this.REST_API_SERVER + '/' + containerId)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // delete all Containers
  deleteAll() {
    return this.httpClient.delete(this.REST_API_SERVER)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}