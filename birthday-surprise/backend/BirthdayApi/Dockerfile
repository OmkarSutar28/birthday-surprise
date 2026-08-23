# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY BirthdayApi.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080

# Render injects PORT at runtime; Program.cs reads it and binds Kestrel accordingly.
ENTRYPOINT ["dotnet", "BirthdayApi.dll"]
