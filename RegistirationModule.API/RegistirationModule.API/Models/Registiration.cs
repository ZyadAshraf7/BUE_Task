namespace RegistirationModule.API.Models
{
    public class Registiration
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public int Age { get; set; }
    }
}
