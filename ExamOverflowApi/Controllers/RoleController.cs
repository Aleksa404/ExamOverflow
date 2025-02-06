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
    public class RoleController : BaseController
    {
        
        private readonly UserManager<User> _userManager;

        public RoleController( UserManager<User> um,ExamOverflowContext db ):base(db)
        {
            _userManager=um;
        }


        [Authorize(Roles=Role.Admin)]
        [HttpPost]
        [Route("updateUserRole")]
        public async Task<IActionResult> Update(RoleModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if(user==null)
                return BadRequest( new JsonResult("User not found"));

            if(user.Role==Role.Admin)
                return BadRequest(new JsonResult("User is already admin"));

            user.Role=Role.Admin;
            try
            {
                _dbContext.Update(user);
                await _dbContext.SaveChangesAsync(); 
            }
            catch(Exception e)
            {
                return BadRequest(e);
            }
            return Ok("sljaka");
        }
        
        [Authorize(Roles=Role.Admin)]
        [HttpPost]
        [Route("removeUserRole")]
        public async Task<IActionResult> Remove(RoleModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if(user==null) return BadRequest(new JsonResult("User not found"));
            if(user.Role!=Role.Admin)
                return BadRequest(new JsonResult("User is not an admin"));

            user.Role=Role.User;

            try
            {
                _dbContext.Update(user);
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception e)
            {
                return BadRequest(e);
            }
            return Ok();
        }
    

    }
}