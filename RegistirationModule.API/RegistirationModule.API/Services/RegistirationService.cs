using Microsoft.EntityFrameworkCore;
using RegistirationModule.API.Data;
using RegistirationModule.API.DTOs;
using RegistirationModule.API.Models;

namespace RegistirationModule.API.Services
{
    public class RegistirationService
    {
        private readonly DataContext _context;
        public RegistirationService(DataContext context)
        {
            _context = context;
        }
        public async Task<List<Registiration>> GetRegistirations(int pageIndex,int pageSize)
        {
            var registirations = await _context.Registirations.Skip(pageIndex * pageSize).Take(pageSize).AsNoTracking().ToListAsync();
            return registirations;
        }
        public async Task<bool> isEmailExist(string email)
        {
            var isExist = await _context.Registirations.AnyAsync(r => r.EmailAddress == email);
            return isExist;
        }
        public async Task<Registiration> CreateRegistiration(CreateRegistrationDTO registirationDTO)
        {
            Registiration registiration = new Registiration
            {
                FullName = registirationDTO.FullName,
                PhoneNumber = registirationDTO.PhoneNumber,
                EmailAddress = registirationDTO.EmailAddress,
                Age = registirationDTO.Age,
            };
            await _context.AddAsync(registiration);
            await _context.SaveChangesAsync();
            return registiration;
        }
        public async Task<Registiration?> GetRegistirationById(int id)
        {
            return await _context.Registirations.FindAsync(id);
        }

        public async Task<(List<Registiration>? registiration,string message)> Search(InputSearchDTO inputSearch)
        {
            if (inputSearch.SearchType == SearchType.EmailAddress)
            {
                var registiration = await _context.Registirations.Where(r => string.Equals(r.EmailAddress, inputSearch.Input)).ToListAsync();
                if(registiration.Count == 0)
                    return ( null ,"Email not found");

                return (registiration,string.Empty);
            }
            else if (inputSearch.SearchType == SearchType.FullName)
            {
                var registiration = await _context.Registirations.Where(r => string.Equals(r.FullName, inputSearch.Input)).ToListAsync();
                if (registiration.Count == 0)
                    return (null, "Name not found");
                
                return (registiration, string.Empty);
            }
            return (null, "Invalid Search Type");
        }

    }
}
