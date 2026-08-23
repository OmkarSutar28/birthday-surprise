var builder = WebApplication.CreateBuilder(args);

// Render/Railway assign a port at runtime via the PORT env var; bind Kestrel to it.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://+:{port}");
}

// CORS origins can come from config (appsettings.json) or from a comma-separated
// FRONTEND_URL env var set in the hosting dashboard (e.g. "https://your-site.netlify.app").
var envOrigins = Environment.GetEnvironmentVariable("FRONTEND_URL")
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

var allowedOrigins = envOrigins?.Length > 0
    ? envOrigins
    : builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
      ?? new[] { "http://localhost:4200" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Make sure wwwroot/photos exists so the app never 500s on a fresh clone
var photosPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "photos");
Directory.CreateDirectory(photosPath);

app.UseCors("Frontend");
app.UseStaticFiles(); // serves everything in wwwroot, including /photos/*.jpg at /photos/*.jpg

app.MapControllers();

app.Run();
