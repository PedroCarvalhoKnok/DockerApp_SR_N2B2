import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ImageResponse } from "../models/image-resp";
import { ImageRequest } from "../models/image-req";


import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private REST_API_SERVER = "http://127.0.0.1:5000/images";

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError:boolean =false):void{
    this.snackBar.open(msg,'X',{
      duration:3000,
      horizontalPosition:"right",
      verticalPosition: "top",
      panelClass: isError?['msg-error']:['msg-success']
    })
  }

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
    return this.httpClient.post<ImageRequest>(this.REST_API_SERVER + `?imageName=${imageReq.imageName}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // delete an Image by id
  deleteById(imageId: string) {
    return this.httpClient.delete(this.REST_API_SERVER + `?idImage=${imageId}`)
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
