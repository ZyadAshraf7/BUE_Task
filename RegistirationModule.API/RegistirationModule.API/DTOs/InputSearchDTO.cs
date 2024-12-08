using System.ComponentModel.DataAnnotations;

namespace RegistirationModule.API.DTOs
{
    public class InputSearchDTO
    {
        [Required]
        public string Input { get; set; } = null!;
        [Required]
        public SearchType SearchType { get; set; }
    }
    public enum SearchType
    {
        EmailAddress,
        FullName
    }
}
