using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Models.ProfileModels
{
    public class DeleteAccountDto
    {
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
