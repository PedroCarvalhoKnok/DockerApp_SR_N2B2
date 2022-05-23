import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ImageResponse } from "../models/image-resp";
import { ImageRequest } from "../models/image-req";


import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private REST_API_SERVER = "http://localhost:8000/images";

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  //Get All Images
  getAll(): Observable<ImageResponse[]> {
    return this.httpClient.get<ImageResponse[]>(this.REST_API_SERVER)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  // get a Image by id
  getById(imageId: string): Observable<ImageResponse> {
    return this.httpClient.get<ImageResponse>(this.REST_API_SERVER + '/' + imageId)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // pull an Image
  pull(imageReq: ImageRequest): Observable<ImageRequest> {
    return this.httpClient.post<ImageRequest>(this.REST_API_SERVER, JSON.stringify(imageReq), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // delete an Image by id
  deleteById(imageId: string) {
    return this.httpClient.delete(this.REST_API_SERVER + '/' + imageId)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // delete all Images
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error["Error"]}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}