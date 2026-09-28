using System.Threading.RateLimiting;
using LuminiaAPI.Context;
using LuminiaAPI.Controllers;
using LuminiaAPI.Handlers.GemstoneExchangeHandlers;
using LuminiaAPI.Handlers.Secrets;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Settings that must stay out of git (e.g. the Discord webhook URL). The file is git-ignored but published with the app.
builder.Configuration.AddJsonFile("appsettings.Secrets.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddTransient<ILuminiaContext, LuminiaContext>();
builder.Services.AddTransient<ICreateGemstoneExchangesHandler, CreateGemstoneExchangesHandler>();
builder.Services.AddTransient<ISecretClaimedNotifier, SecretClaimedNotifier>();
builder.Services.AddHttpClient();
builder.Services.AddDbContext<LuminiaContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("LuminiaDbOnline")!));

// Add automapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllersWithViews();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Secret answers: a few guesses per minute per IP, so nobody can brute-force a puzzle
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(SecretsController.AttemptRateLimitPolicy, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1) }));
    // Path secrets are checked on every page visit once a player has read the directions, so allow more
    options.AddPolicy(SecretsController.WalkRateLimitPolicy, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 30, Window = TimeSpan.FromMinutes(1) }));
});
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.UseCors(x => x.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

app.Run();
