using System.Net.Http.Json;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Handlers.Secrets;

public interface ISecretClaimedNotifier
{
    /// <summary>Tells the DM that a secret was claimed. Never throws: a failed notification mustn't cost the player their claim.</summary>
    public Task NotifyAsync(Secret secret, string claimedBy);
}

/// <summary>
/// Posts a message to a Discord channel through a webhook when a secret is claimed.
/// The webhook URL is read from "Discord:SecretsWebhookUrl" (appsettings.json, or appsettings.Development.json locally);
/// without it, nothing is sent.
/// </summary>
public class SecretClaimedNotifier
    : ISecretClaimedNotifier
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SecretClaimedNotifier> _logger;

    public SecretClaimedNotifier(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<SecretClaimedNotifier> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task NotifyAsync(Secret secret, string claimedBy)
    {
        var webhookUrl = _configuration["Discord:SecretsWebhookUrl"];
        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            return;
        }

        var message = new
        {
            content = $"**{EscapeMarkdown(claimedBy)}** feels inspired after having solved **{EscapeMarkdown(secret.Name)}**.",
            // The name is typed in by a player: don't let it ping @everyone or anyone else
            allowed_mentions = new { parse = Array.Empty<string>() },
        };

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(5);
            var response = await client.PostAsJsonAsync(webhookUrl, message);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Discord notification for secret {SecretKey} failed with {StatusCode}.", secret.SecretKey, response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Discord notification for secret {SecretKey} failed.", secret.SecretKey);
        }
    }

    private static string EscapeMarkdown(string text)
    {
        return System.Text.RegularExpressions.Regex.Replace(text, @"([\\*_~`|>#\[\]()])", @"\$1");
    }
}
