FROM node:22              [ Avisas en que imagen se basa el proyecto ]

RUN mkdir -p /home/app             [ Donde va a contenerse el proyecto DENTRO DEL CONTENEDOR ]

COPY . /home/app                   [ De donde va a sacar Docker el proyecto y cual sera el destino  ]

EXPOSE 8080                        [ Expone el puerto donde se va a ejecutar el proyecto ]

CMD ["npm", "run","start"] [ Comando de ejecucion del proyecto dentro del contenedor ]