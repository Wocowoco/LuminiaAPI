using LuminiaAPI.Context;
using LuminiaAPI.Handlers.GemstoneExchangeHandlers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddTransient<ILuminiaContext, LuminiaContext>();
builder.Services.AddTransient<ICreateGemstoneExchangesHandler, CreateGemstoneExchangesHandler>();
builder.Services.AddDbContext<LuminiaContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("LuminiaDbOnline")!));

// Add automapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllersWithViews();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
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

app.UseAuthorization();

app.MapControllers();

app.Run();
