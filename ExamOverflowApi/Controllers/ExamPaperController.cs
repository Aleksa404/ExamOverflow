using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;
using static System.Net.Mime.MediaTypeNames;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using Microsoft.AspNetCore.Http;
using ExamOverflowApi.Helpers;

namespace ExamOverflowApi.Controllers
{
    public class ExamPaperModel 
    {
        public int CourseId { get; set; }
        public string Type { get; set; }
        public int Year { get; set; }
        public string Term { get; set; }
        public string DocumentUrl { get; set; }

    }
    public class ExamPaperController : BaseController
    {
        

        public ExamPaperController(ExamOverflowContext db) : base(db)
        {
            
        }
        [HttpGet]
        [Route("exampapers")]
        public async Task<IActionResult> GetExamPapers(int id, int year = 0)
        {
            var course = await _dbContext.Courses.Include(course => course.ExamPapers).Where(x => x.Id == id).FirstOrDefaultAsync();
            if (course == null) return BadRequest("Course not found");
            var examPapers = course.ExamPapers.Where(x => x.Approved == true);
        
            if (year != 0)
            {
                examPapers = examPapers.Where(x => x.Year == year).ToList();
                
            }
            return Ok(examPapers.OrderByDescending(x => x.Year).ToList());
        }
        [HttpGet]
        [Route("exampapers/unapproved")]
        public async Task<IActionResult> GetUnapproved()
        {
            var examp = await _dbContext.ExamPapers.Include(x => x.Course).Where(x => x.Approved == false).ToListAsync();


            return Ok(examp);
        }
        [HttpGet]
        [Route("exampapers/approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var examp = await _dbContext.ExamPapers.FindAsync(id);
            if(examp == null) return BadRequest("Not found");
            if(examp.Approved == true) return BadRequest("Already approved");
            examp.Approved = true;
            _dbContext.ExamPapers.Update(examp);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete]
        [Route("exampapers/unapprove/{id}")]
        public async Task<IActionResult> Unapprove(int id)
        {
            var examp = await _dbContext.ExamPapers.FindAsync(id);
            if(examp == null) return BadRequest("Not found");
            if(examp.Approved == true) return BadRequest("Already appoved");
            _dbContext.ExamPapers.Remove(examp);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet]
        [Route("exampapers/unapprovedCount")]
        public async Task<IActionResult> GetCount()
        {
            var lenght = _dbContext.ExamPapers.Where(x => x.Approved == false).ToList().Count;
            return Ok( new { Count = lenght});
        }

        [HttpGet]
        [Route("exampapers/{id}")]
        public async Task<IActionResult> GetExamUrl(int id)
        {
            var examp = await _dbContext.ExamPapers.FindAsync(id);
            if(examp == null) return BadRequest("Exam paper not found");

            return Ok(examp);
        }


        [HttpPost]
        [Route("exampapers")]
        public async Task<IActionResult> PostExamPaper(ExamPaperModel examPaper)
        {
            var course =await _dbContext.Courses.FindAsync(examPaper.CourseId);
            if(course == null) return BadRequest("Course not found");


            var examp = new ExamPaper();
            examp.Type = examPaper.Type;
            examp.Year = examPaper.Year;
            examp.Term = examPaper.Term;
            examp.CourseId=examPaper.CourseId;
            examp.DocumentUrl = examPaper.DocumentUrl;
            examp.Approved = false;

            _dbContext.ExamPapers.Add(examp);
            await _dbContext.SaveChangesAsync();
            
            return Ok(examp.DocumentUrl);    
        }
    }
}