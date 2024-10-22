# Etapa 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Etapa 2: Restaura as dependências e publica a aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências (aproveitamento do cache)
COPY zelo-core.csproj ./
RUN dotnet restore

# Copia todos os arquivos do código
COPY . .

# Publica diretamente (sem build separado)
RUN dotnet publish zelo-core.csproj -c Release -o /app/publish

# Etapa 3: Configuração da imagem final
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Define a instrução para rodar a aplicação
ENTRYPOINT ["dotnet", "zelo-core.dll"]

# # Etapa 1: Build da aplicação
# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app

# # Etapa 2: Restaura as dependências e build
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src

# # Copia o arquivo de solução e de projeto
# COPY ["zelo-core.csproj", "./"]

# # Restaura as dependências
# RUN dotnet restore "./zelo-core.csproj"

# # Copia todos os arquivos e faz o build da aplicação
# COPY . .
# WORKDIR "/src"
# RUN dotnet build "zelo-core.csproj" -c Release -o /app/build

# # Etapa 3: Publicação da aplicação
# FROM build AS publish
# RUN dotnet publish "zelo-core.csproj" -c Release -o /app/publish

# # Etapa 4: Configuração da imagem final
# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .

# # Define a instrução para rodar a aplicação
# ENTRYPOINT ["dotnet", "zelo-core.dll"]