using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using ExamOverflowApi.Helpers;
using ExamOverflowApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace ExamOverflowApi.Controllers
{

    [ApiController]
    [Route("api")]
    public class UserController : BaseController
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;


        public UserController(ExamOverflowContext db, UserManager<User> um, SignInManager<User> sim) : base(db)
        {
            _userManager = um;
            _signInManager = sim;

        }


        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                Role=Role.User
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var signInResult = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
                if (signInResult.Succeeded)
                {
                    return Ok(result);
                }
            }
            return BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                if(user.Banned == true) return BadRequest("User is banned");

                var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);

                if (result.Succeeded)
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(Helpers.AppSettings.Secret);
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                         {
                            new Claim(ClaimTypes.Name, user.Id.ToString()),
                            new Claim(ClaimTypes.Role, user.Role)

                        }),
                        Expires = DateTime.UtcNow.AddDays(7),
                        
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

                    };
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var hashToken = tokenHandler.WriteToken(token);

                    return Ok(new { Token = hashToken });
                }
            }
            return BadRequest("Invalid email or password");
        }

        [HttpGet]
        [Route("logout")]
        public async Task Logout()
        {
            await _signInManager.SignOutAsync();
        }


        [Authorize(Roles=Role.Admin)]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> AllUsers()
        {
            var all =await _dbContext.Users.ToListAsync();
            return Ok(all);
        }
        [HttpGet]
        [Route("users/{id}")]
        public async Task<IActionResult> GetUser(string id) 
        {
            var user = await _dbContext.Users.FindAsync(id);
            if(user == null) return BadRequest("User not found");
            return Ok( new { Id = user.Id, UserName = user.UserName, email = user.Email, Karma = user.Karma, Role = user.Role, Avatar = user.Avatar});

        }
        [HttpGet]
        [Route("users/avatar/{id}")]
        public async Task<IActionResult> GetAvatar(string id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if(user == null) return BadRequest("User not found");
            return Ok(user.Avatar);
        }

        [HttpPost]
        [Route("users/edit/{id}")]
        public async Task<IActionResult> EditProfile(string id, [FromBody]PatchModel patchModel)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if(user == null) return BadRequest("User not found");
            bool changed = false;

            if(user.UserName != patchModel.UserName)
            {
                var exists = await _dbContext.Users.Where(x => x.UserName == patchModel.UserName).FirstOrDefaultAsync();
                if(exists != null) return BadRequest("Username already exists");

                user.UserName = patchModel.UserName;
                await _userManager.UpdateAsync(user); 
                changed = true;
            }
            if(user.Avatar != patchModel.Avatar)
            {
                user.Avatar = patchModel.Avatar;
                changed = true;
            }
            
            if(changed == true)
            {
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
            }
            return Ok();
        }
        [Authorize(Roles=Role.Admin)]
        [HttpGet]
        [Route("users/ban/{id}")]
        public async Task<IActionResult> BanUser(string id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if(user == null) return BadRequest("User not found");
            if(user.Banned == true) return BadRequest("User is already banned");

            user.Banned = true;
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _dbContext.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if(user == null) return BadRequest("User not found");

            return Ok(user);

        }


    }
}