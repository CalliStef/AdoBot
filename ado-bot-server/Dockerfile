FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY ./ToxicModel.mlnet ./ToxicModel.mlnet

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ado-bot-server.csproj", "./"]
RUN dotnet restore "ado-bot-server.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "ado-bot-server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ado-bot-server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ado-bot-server.dll"]
