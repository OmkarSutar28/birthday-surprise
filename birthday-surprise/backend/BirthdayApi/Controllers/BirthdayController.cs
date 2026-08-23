using Microsoft.AspNetCore.Mvc;

namespace BirthdayApi.Controllers;

[ApiController]
[Route("api")]
public class BirthdayController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;

    // Simple in-memory rate limiting per server run, so a wrong passcode
    // can't be brute-forced without at least being throttled.
    private static int _failedAttempts = 0;

    public BirthdayController(IConfiguration config, IWebHostEnvironment env)
    {
        _config = config;
        _env = env;
    }

    public record PasscodeRequest(string Code);
    public record PasscodeResponse(bool Success, string? Message);
    public record BirthdayConfig(
        string RecipientName,
        string MainPhotoUrl,
        string MainCaption,
        string LetterTitle,
        string LetterBody,
        string SignatureName
    );

    /// <summary>Checks the entered passcode against the configured one.</summary>
    [HttpPost("verify-passcode")]
    public ActionResult<PasscodeResponse> VerifyPasscode([FromBody] PasscodeRequest request)
    {
        if (_failedAttempts >= 10)
        {
            return StatusCode(429, new PasscodeResponse(false, "Too many attempts. Try again later."));
        }

        var correctCode = _config["Birthday:Passcode"] ?? "0000";

        if (string.Equals(request.Code?.Trim(), correctCode, StringComparison.Ordinal))
        {
            _failedAttempts = 0;
            return Ok(new PasscodeResponse(true, "Unlocked"));
        }

        _failedAttempts++;
        return Unauthorized(new PasscodeResponse(false, "Wrong passcode, try again."));
    }

    /// <summary>Returns all the text/content the frontend needs (no passcode included).</summary>
    [HttpGet("config")]
    public ActionResult<BirthdayConfig> GetConfig()
    {
        var section = _config.GetSection("Birthday");
        var mainPhoto = section["MainPhoto"] ?? "main.jpg";

        var result = new BirthdayConfig(
            RecipientName: section["RecipientName"] ?? "",
            MainPhotoUrl: $"/photos/{mainPhoto}",
            MainCaption: section["MainCaption"] ?? "",
            LetterTitle: section["LetterTitle"] ?? "HAPPY Birthday",
            LetterBody: section["LetterBody"] ?? "",
            SignatureName: section["SignatureName"] ?? ""
        );

        return Ok(result);
    }

    /// <summary>
    /// Lists every image currently sitting in wwwroot/photos, EXCLUDING the main photo.
    /// This is how you "choose which pics to add": just drop files into wwwroot/photos
    /// and they show up in the gallery automatically, no code or redeploy needed.
    /// </summary>
    [HttpGet("photos")]
    public ActionResult<IEnumerable<string>> GetPhotos()
    {
        var photosDir = Path.Combine(_env.ContentRootPath, "wwwroot", "photos");
        if (!Directory.Exists(photosDir))
        {
            return Ok(Array.Empty<string>());
        }

        var mainPhoto = _config["Birthday:MainPhoto"] ?? "main.jpg";
        var extensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

        var files = Directory.GetFiles(photosDir)
            .Select(Path.GetFileName)
            .Where(f => f != null
                        && extensions.Contains(Path.GetExtension(f).ToLowerInvariant())
                        && !string.Equals(f, mainPhoto, StringComparison.OrdinalIgnoreCase))
            .OrderBy(f => f)
            .Select(f => $"/photos/{f}")
            .ToList();

        return Ok(files);
    }
}
