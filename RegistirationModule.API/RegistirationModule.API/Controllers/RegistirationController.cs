using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegistirationModule.API.Data;
using RegistirationModule.API.DTOs;
using RegistirationModule.API.Models;
using RegistirationModule.API.Services;

namespace RegistirationModule.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistirationController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<RegistirationController> _logger;
        public RegistirationController(DataContext context, ILogger<RegistirationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Route("GetRegistirations")]
        public async Task<IActionResult> GetRegistirations(int pageIndex, int pageSize)
        {
            try
            {
                RegistirationService service = new RegistirationService(_context);
                var registrations = await service.GetRegistirations(pageIndex, pageSize);
                _logger.LogInformation($"Registrations fetched");
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occured fetching registrations: ${ex.ToString()}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.ToString() });
            }
        }
        [HttpGet]
        [Route("GetRegistirationsCount")]
        public async Task<IActionResult> GetRegistirationsCount()
        {
            try
            {
                int count = await _context.Registirations.CountAsync();
                _logger.LogInformation($"Get registrations count: {count}");
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get registrations count. message: {ex.ToString()}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.ToString() });
            }
        }
        [HttpPost]
        [Route("CreateRegistiration")]
        public async Task<IActionResult> CreateRegistiration(CreateRegistrationDTO registrationDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                RegistirationService service = new RegistirationService(_context);
                var isExist = await service.isEmailExist(registrationDTO.EmailAddress);
                if (isExist)
                    return Conflict(new { message = "Email already exists" });
                var registiration = await service.CreateRegistiration(registrationDTO);
                _logger.LogInformation($"Registration created successfully with email: {registiration.EmailAddress}", registrationDTO.EmailAddress);
                return CreatedAtAction(nameof(GetRegistiration), new { id = registiration.Id }, registiration);

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occured creating registration: ${ex.ToString()}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.ToString() });
            }
        }
        [HttpGet("{id}")]
        public IActionResult GetRegistiration(int id)
        {
            RegistirationService service = new RegistirationService(_context);
            var registiration = service.GetRegistirationById(id);
            _logger.LogInformation($"Get Registration by Id: {registiration.Id}");
            return registiration != null ? Ok(registiration) : NotFound(new { message = "Registiration not found" });
        }
        [HttpPost]
        [Route("Search")]
        public async Task<IActionResult> Search(InputSearchDTO inputSearchDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid data was provided to search endpoint");
                return BadRequest(ModelState);
            }
            try
            {
                RegistirationService service = new RegistirationService(_context);
                (List<Registiration>? registirations, string message) = await service.Search(inputSearchDTO);
                if (registirations is null)
                {
                    _logger.LogInformation($"No results found for {inputSearchDTO.Input} via {inputSearchDTO.SearchType.ToString()}");
                    return NotFound(new { message = message });

                }
                _logger.LogInformation($"Search is done via {inputSearchDTO.SearchType.ToString()} for {inputSearchDTO.Input}");
                return Ok(registirations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occured searching for registration: ${ex.ToString()}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.ToString() });
            }
        }
    }
}
