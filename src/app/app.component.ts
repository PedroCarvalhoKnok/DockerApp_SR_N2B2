import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
 import { ContainersService } from 'src/app/services/containerservice';
import { ImagesService } from 'src/app/services/imageservice';
import { ContainerResponse } from './models/container-resp';
import { ContainerRequest } from './models/container-req';
import { ImageRequest } from './models/image-req';
import { ImageResponse } from './models/image-resp';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Resources Manager';
  angForm!: FormGroup;
  imageForm!: FormGroup;
  _isDisabled = false;
  container = {} as ContainerResponse
  containerRequest = {} as ContainerRequest
  containers!: ContainerResponse[];
  image = {} as ImageResponse
  imageRequest = {} as ImageRequest
  images!: ImageResponse[];

  constructor(private fb: FormBuilder, private imageService: ImagesService, private containerService: ContainersService) {
    this.createContainerForm();
    this.createImageForm();
  }

  async ngOnInit() {
    this.findAllContainers();
    this.findAllImages();
  }
  

  createContainerForm() {
    this.angForm = this.fb.group({
      transferId: [{ value: 0, disabled: this._isDisabled }, [Validators.pattern("^[0-9]*$"), Validators.min(0)]],
      imageNameTag: ['', Validators.required],
      containerPort: ['', Validators.pattern("[0-9]+:[0-9]+")],
      containerEnvFull: ['',Validators.pattern("(([A-Za-z0-9_]+=[A-Za-z0-9_]+),?)+")],
      containername: ['',''],      
    });
  }

  createImageForm(){
    this.imageForm = this.fb.group({
      imageName: ['', Validators.required],
      imageTag: ['',''],
    })
  }

  isDisabled() {
    if (this._isDisabled) {
      this.angForm.controls['transferId'].enable();
      this._isDisabled = false;
    } else {
      this.angForm.controls['transferId'].disable();
      this.angForm.controls['transferId'].setValue(0);
      this._isDisabled = true;
    }
  }

  public findAllImages(): void {
    this.imageService.getAll().subscribe((data: ImageResponse[])=>{
      this.images = data;
    })  
  }

  public findAllContainers(): void {
    
    this.containerService.getAll().subscribe((data: ContainerResponse[])=>{
      console.log(data)
      this.containers = data;
      
    })  
  }


  public deleteImageById(imageId: string): void {
    this.imageService.deleteById(imageId).subscribe(() => {
      this.containerService.showMessage(`Image ${imageId} foi deletada com sucesso`);
      this.findAllImages();
    })
  }

  public deleteAllImages(): void{
    this.imageService.deleteAll().subscribe(() => {
      this.containerService.showMessage('Todas as images foram deletadas');
      this.findAllImages();
    })
  }
  
  public deleteContainerById(imageId: string): void {
    this.containerService.deleteById(imageId).subscribe(() => {
      this.containerService.showMessage(`O container ${imageId} foi deletado com sucesso`);
      this.findAllContainers();
    })
  }

  public deleteAllContainers(): void{
    this.containerService.deleteAll().subscribe(() => {
      this.containerService.showMessage('Todos os containers foram deletado');
      this.findAllContainers();
    })
  }

  public findImageById(imageID: string): void {
    this.imageService.getById(imageID).subscribe((data: ImageResponse) =>{
      this.image = data;
      // console.log(this.image);      
    });
  }  
  
  public findContainerById(containerId: string): void {
    this.containerService.getById(containerId).subscribe((data: ContainerResponse) =>{
      this.container = data;
      // console.log(this.image);      
    });
  }

  public pullImage(): void {
    this.imageService.pull(this.imageRequest).subscribe(() => {
      this.findAllImages();
    });
    this.angForm.reset()
  }

  public enableButton(): boolean{
    return true
  }

  public runContainer(): void{
    this.containerService.run(this.containerRequest).subscribe(() => {
        this.containerService.showMessage('Container iniciado');
        this.findAllContainers();
    });
    this.angForm.reset()
  }

  createImg():void{
    this.imageService.pull(this.imageRequest).subscribe(() => {
     this.imageService.showMessage('Imagem enviada');
    })
  }

  // //UTILS

  // public extractPort(object: Object): string{
  //   try {
  //     return object["Ports"] != null ? Object.entries(object["Ports"])[0][1][0]["HostPort"] + ":" + Object.entries(object["Ports"])[0][0] : "null"      
  //   } catch (error) {
  //     return "null"
  //   }
  // }

  // public extractLink(object: Object): string{
  //   try {
  //     return object["Ports"] != null ? environment.dockerHost + Object.entries(object["Ports"])[0][1][0]["HostPort"] : ""      
  //   } catch (error) {
  //     return "null"
  //   }
  // }


}
