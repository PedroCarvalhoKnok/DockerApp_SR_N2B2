from flask import Flask
from flask_restful import Resource, Api, reqparse
from matplotlib import container, image
import pandas as pd
import ApiDocker
import ast
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
CORS(app)


class Containers(Resource):
    def get(self):

        containers_list = ApiDocker.get_all_containers()
        listaRetorno = list()
        
        for container in containers_list:
            dicionarioContainers = dict()
            dicionarioContainers['id'] = container.id
            dicionarioContainers['short_id'] = container.short_id
            dicionarioContainers['name'] = container.name
            dicionarioContainers['status'] = container.status

            listaRetorno.append(dicionarioContainers.copy())

        return listaRetorno, 200  # return data and 200 OK code

    def post(self):
        parser = reqparse.RequestParser()  # initialize]
        
        parser.add_argument('image', location='args')  # add arguments
        parser.add_argument('name', location='args')  # add arguments
        args = parser.parse_args()  # parse arguments to dictionary
        image = args['image']
        name = args['name']

        container = ApiDocker.create_and_start_container(image, name)

        if (container == None):
            return {"Error": "Image not created"}, 404
        dicionarioContainers = dict()
        dicionarioContainers['id'] = container.id
        dicionarioContainers['short_id'] = container.short_id
        dicionarioContainers['name'] = container.name
        dicionarioContainers['status'] = container.status

        return dicionarioContainers, 200



    def delete(self):
        parser = reqparse.RequestParser()  # initialize]
        
        parser.add_argument('idContainer', location='args')  # add arguments
        args = parser.parse_args()  # parse arguments to dictionary
        id = args['idContainer']

        if (id == None):
            removed, not_removed = ApiDocker.remove_all_containers()
        else:
            removed, not_removed = ApiDocker.remove_container_by_id(id)

        return {'Removed': removed, 'Not_Removed': not_removed}, 200


class Images(Resource):
    def get(self):
        listaRetorno = list()
        images_list = ApiDocker.get_all_images()
        for image in images_list:
            dicionarioContainers = dict()
            dicionarioContainers['id'] = image.id
            dicionarioContainers['short_id'] = image.short_id
            dicionarioContainers['tags'] = image.tags
            dicionarioContainers['labels'] = image.labels

            listaRetorno.append(dicionarioContainers.copy())

        return listaRetorno, 200

    def post(self):
        parser = reqparse.RequestParser()  # initialize]
        
        parser.add_argument('imageName', required=True, location='args')  # add arguments
        args = parser.parse_args()  # parse arguments to dictionary
        image = args['imageName']

        image = ApiDocker.pull_image(image)

        if (image == None):
            return {"Error": "Image not created"}, 404
        dicionarioContainers = dict()
        dicionarioContainers['id'] = image.id
        dicionarioContainers['short_id'] = image.short_id
        dicionarioContainers['tags'] = image.tags
        dicionarioContainers['labels'] = image.labels

        return dicionarioContainers, 200
        
            



    
    def delete(self):
        parser = reqparse.RequestParser()  # initialize]
        
        parser.add_argument('idImage', location='args')  # add arguments
        args = parser.parse_args()  # parse arguments to dictionary
        id = args['idImage']

        if (id == None):
            removed, not_removed = ApiDocker.remove_all_images()
        else:
            removed, not_removed = ApiDocker.remove_image_by_id(id)

        return {'Removed': removed, 'Not Removed': not_removed}, 200



api.add_resource(Containers, '/containers')
api.add_resource(Images, '/images')

if __name__ == '__main__':
    app.run()  # run our Flask app