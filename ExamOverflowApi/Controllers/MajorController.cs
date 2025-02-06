using System.Linq;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamOverflowApi.Controllers
{
    public class MajorController : BaseController
    {
        public MajorController(ExamOverflowContext db) : base(db)
        {

        }
        [HttpGet]
        [Route("majors")]
        public async Task<IActionResult> GetMajors()
        {
            var majors = await _dbContext.Majors.ToListAsync();
            return Ok(majors.OrderBy(x => x.Name));
        }


        [HttpPost]
        [Route("majors")]
        public async Task<IActionResult> PostMajor(Major major)
        {
            var maj  = await _dbContext.Majors.Where(x => x.Name == major.Name).FirstOrDefaultAsync();
            if(maj != null) return BadRequest("Name Already exists");
            await _dbContext.Majors.AddAsync(major);
            await _dbContext.SaveChangesAsync();
            return Ok(major);
        }
    }
}