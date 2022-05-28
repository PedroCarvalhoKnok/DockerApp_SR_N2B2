from tokenize import Name
from unicodedata import name
import docker

client = docker.from_env()

def get_all_containers():
    container_list = client.containers.list()

    for container in container_list:
        print(f'container ID: {container.id}')
        print(f'container Short ID: {container.short_id}')
        print(f'container Name: {container.name}')
        print(f'container Status: {container.status}')
        print()

    return container_list

def get_containers_running():
    container_list = client.containers.list(filters={'status': 'running'})
    if container_list:
        return container_list

def get_container_by_id(containerId):
    try:
        container = client.containers.get(containerId)
        return container
    except docker.errors.NotFound:
        print('Container does not exist.')
        return None

def remove_all_containers():
    removed_list = list()
    not_removed_list = list()
    containers_list = client.containers.list()
    if containers_list:
        for container in containers_list:
            try:
                print(f'Try remove container {container.name}')
                container.remove(force=True)
                removed_list.append(container.name)
                print(f'Container called {container.name} sucessfully removed')
            except Exception as err:
                print(f'Failed to remove the container named {container.name}')
                not_removed_list.append(container.name)
                print(f'\nErro: {err}')
        
    return removed_list, not_removed_list

def remove_container_by_id(containerId):
    try:
        removed_list = list()
        not_removed_list = list()
        container = client.containers.get(containerId)
        if container:
            try:
                print(f'Try remove container {container.name}')
                container.remove(force=True)
                removed_list.append(container.name)
                print(f'Container called {container.name} sucessfully removed')
            except Exception as err:
                print(f'Failed to remove the container named {container.name}')
                not_removed_list.append(container.name)
                print(f'\nErro: {err}')
    except docker.errors.NotFound:
        print('Container does not exist.')
    
    return removed_list, not_removed_list

def start_container(containerId):
    try:
        container = client.containers.get(containerId)
        try:
            container.start()
            print(f'Container call {container.name} sucessfully start')
        except Exception as err:
            print(f'Failed to start the container {container.name}')
    except docker.errors.NotFound:
        print('Container does not exist.')

def stop_container(containerId):
    try:
        container = client.containers.get(containerId)
        try:
            container.stop()
            print(f'Container call {container.name} sucessfully stop')
        except Exception as err:
            print(f'Failed to start the container {container.name}')
    except docker.errors.NotFound:
        print('Container does not exist.')

def get_all_images():
    image_list = client.images.list()

    for image in image_list:
        print(f'image ID: {image.id}')
        print(f'image Short ID: {image.short_id}')
        print(f'image Tags: {image.tags}')
        print(f'image Labels: {image.labels}')
        print()

    return image_list

def remove_all_images():
    removed_list = list()
    not_removed_list = list()
    image_list = client.images.list()
    if image_list:
        for image in image_list:
            try:
                print(f'Try remove image {image.tags}')
                client.images.remove(image.id, force=True)
                removed_list.append(image.tags[0])
            except Exception as err:
                print(f'Failed to remove the image named {image.tags[0]}')
                not_removed_list.append(image.tags[0])
                print(f'\nErro: {err}')
    return removed_list, not_removed_list

def remove_image_by_id(imageId):
    removed_list = list()
    not_removed_list = list()
    try:
        image = client.images.get(imageId)
        try:
            client.images.remove(imageId,force=True)
            print(f'Image id {imageId} sucessfully removed')
            removed_list.append(image.tags[0])
        except Exception as err:
            print(f'Failed to remove the image Id {imageId}')
            not_removed_list.append(image.tags[0])
            print(f'\nErro: {err}')

    except docker.errors.NotFound:
        print('Image does not exist.')
    
    return removed_list, not_removed_list

def pull_image(imageName):
    try:
        #client.images.list()
        client.images.pull(imageName)
        return client.images.get(imageName)
    except:
        print("Não foi possível obter a imagem.") 
        return False

def create_and_start_container(image, name):
    try:
        container = client.containers.create(image, name=name)
        start_container(container.id)
        return container
    except:
        print("Não foi possível criar o container")

  
    
    


        

#start_container('2c8b03e02c')
#get_all_containers('2c8b03e02c')
#stop_container('2c8b03e02c')
#remove_container_by_id('2c8b03e02cb2917a2a4862dfe0c5fc1dad0870253071cb3476e0ba1d29e69169')
#remove_image_by_id('sha256:d2e4e1f511320dfb2d0baff2468fcf0526998b73fe10c8890b4684bb7ef8290f')
#get_all_containers()
#get_all_images()
#pull_image("nginx")

#get_all_images()

create_and_start_container("ubuntu", "Maquina_teste")