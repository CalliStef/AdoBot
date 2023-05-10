using System.Linq;
using System.Text.Json.Serialization;
using ado_bot_server.Hubs;
using ado_bot_server.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


DotNetEnv.Env.Load();


var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8081";
builder.WebHost.UseUrls($"http://*:{port}");

var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

builder.Services.AddDbContext<DatabaseContext>(opt =>
{
    opt.UseNpgsql(
        connectionString,
        o => o.MigrationsAssembly("ado-bot-server")
    );
    if (builder.Environment.IsDevelopment())
    {
        opt.LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors();
    }
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services
    .AddControllers()
    .AddNewtonsoftJson(
        options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
    );

builder.Services.AddSignalR().AddJsonProtocol(o =>
{
    o.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

app.MapControllers();
app.MapHub<ChannelHub>("/r/chat");
app.MapGet("/api/predict", (string comment ) =>
{
    
    ToxicModel.ModelInput input = new ToxicModel.ModelInput(){ Text = comment };

    var sortedScoresWithLabel = ToxicModel.PredictAllLabels(input);
    var isToxic = sortedScoresWithLabel.First().Key == "1";

    return new
    {
        isToxic,
        scores = sortedScoresWithLabel
    };
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");


app.Run();