# Etapa 1: Usar o SDK completo para desenvolvimento (necessário para hot-reloading)
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copiar os arquivos de projeto e restaurar as dependências (usando cache se disponível)
COPY zelo-core.csproj ./
RUN dotnet restore

# Copiar todo o código-fonte para dentro do container
COPY . .

# Definir variáveis de ambiente para hot-reload
ENV DOTNET_USE_POLLING_FILE_WATCHER=1 \
    ASPNETCORE_ENVIRONMENT=Development

# Instalação do inotify-tools para que o dotnet watch possa observar mudanças de arquivos
RUN apt-get update && apt-get install -y inotify-tools

# Comando para rodar a aplicação com hot reload
ENTRYPOINT ["dotnet", "watch", "run", "--urls", "http://*:80"]


# # Etapa 1: Build da aplicação
# FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
# WORKDIR /app

# # Etapa 2: Restaura as dependências e publica a aplicação
# FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# WORKDIR /src

# # Copia o arquivo de projeto e restaura as dependências (aproveitamento do cache)
# COPY zelo-core.csproj ./
# RUN dotnet restore

# # Copia todos os arquivos do código
# COPY . .

# # Publica diretamente (sem build separado)
# RUN dotnet publish zelo-core.csproj -c Release -o /app/publish

# # Etapa 3: Configuração da imagem final
# FROM base AS final
# WORKDIR /app
# COPY --from=build /app/publish .

# # Define a instrução para rodar a aplicação
# ENTRYPOINT ["dotnet", "zelo-core.dll"]
