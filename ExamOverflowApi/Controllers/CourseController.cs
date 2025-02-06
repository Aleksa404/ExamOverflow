using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ExamOverflowApi.Controllers
{
    public class CourseController : BaseController
    {
        public CourseController(ExamOverflowContext db) : base(db)
        {

        }

        [HttpGet]
        [Route("courses")]
        public async Task<IActionResult> GetCourses(int id, int year = 0)
        {
            var majors = await _dbContext.Majors.Include(major => major.Courses).Where(x => x.Id == id).FirstOrDefaultAsync();
            if (majors == null) return BadRequest("major not found");
            var courses = majors.Courses;
            if (year != 0)
            {
                courses = courses.Where(x => x.Year == year).ToList();
            }
            return Ok(courses.OrderBy(x => x.Name));
        }


        [HttpPost]
        [Route("courses")]
        // [Authorize]
        public async Task<IActionResult> PostCourse(Course course)
        {
            var cur = await _dbContext.Courses.Where(x => x.Name == course.Name).FirstOrDefaultAsync();
            if(cur != null) return BadRequest("Name already exists");
            
            await _dbContext.Courses.AddAsync(course);
            await _dbContext.SaveChangesAsync();
            return Ok(course);
        }
        [HttpGet]
        [Route("courses/{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _dbContext.Courses.FindAsync(id);
            if(course == null ) return BadRequest();
            return Ok(course);
        }
    }
}