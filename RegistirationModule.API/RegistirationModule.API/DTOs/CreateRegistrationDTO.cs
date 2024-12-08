using System.ComponentModel.DataAnnotations;

namespace RegistirationModule.API.DTOs
{
    public class CreateRegistrationDTO
    {
        [Required]
        [MinLength(3, ErrorMessage = "Full Name must be at least 3 characters.")]
        [MaxLength(50, ErrorMessage = "Full Name cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Full Name must contain only letters and spaces.")]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string EmailAddress { get; set; } = null!;

        [Required]
        [RegularExpression(@"^\+\d{1,3}\d{10,15}$", ErrorMessage = "Phone Number must include a valid country code and be numeric.")]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        [Range(18, 99, ErrorMessage = "Age must be between 18 and 99.")]
        public int Age { get; set; }
    }
}
