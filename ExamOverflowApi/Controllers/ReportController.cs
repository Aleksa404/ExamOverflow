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
    public class QuestionReportModel
    {
        public int QuestionId { get; set; }
        public string Content { get; set; }
    }
    public class AnswerReportModel
    {
        public int AnswerId { get; set; }
        public string Content { get; set; }
    }

    public class ReportController : BaseController
    {
        public ReportController(ExamOverflowContext db) : base(db)
        {  }

        [HttpPost]
        [Route("reports/questions")]
        public async Task<IActionResult> ReportQuestion(QuestionReportModel reportModel)
        {
            var question = _dbContext.Questions.Find(reportModel.QuestionId);
            if(question == null) return BadRequest("question not found");

            var report = new QuestionReportTable();
            report.QuestionId=reportModel.QuestionId;
            report.Content=reportModel.Content;

            _dbContext.QuestionReportTable.Add(report);
            await _dbContext.SaveChangesAsync();
            return Ok(report.Id);
        }

        [HttpDelete]
        [Route("reports/questions/{id}")]
        public async Task<IActionResult> QuestionRemoveReport(int id)
        {
            var report = _dbContext.QuestionReportTable.Find(id);
            if(report== null) return BadRequest("Not found");

            _dbContext.QuestionReportTable.Remove(report);
            await _dbContext.SaveChangesAsync();
            return Ok(); 
        }

        [HttpPost]
        [Route("reports/answers")]
        public async Task<IActionResult> ReportAnswer(AnswerReportModel reportModel)
        {
            var answer = _dbContext.Answers.Find(reportModel.AnswerId);
            if(answer == null) return BadRequest("Answer not found");

            var report = new AnswerReportTable();
            report.AnswerId=reportModel.AnswerId;
            report.Content=reportModel.Content;

            _dbContext.AnswerReportTable.Add(report);
            await _dbContext.SaveChangesAsync();
            return Ok(report.Id);
        }
        [HttpDelete]
        [Route("reports/answers/{id}")]
        public async Task<IActionResult> AnswerRemoveReport(int id)
        {
            var report = _dbContext.AnswerReportTable.Find(id);
            if(report== null) return BadRequest("Not found");

            _dbContext.AnswerReportTable.Remove(report);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet]
        [Route("reports")]
        public async Task<IActionResult> GetReports()
        {
            var questionReports = await _dbContext.QuestionReportTable.Include(x => x.Question).ToListAsync();
            var answerReports = await _dbContext.AnswerReportTable.Include(x => x.Answer).ToListAsync();
            var retObj = new {
                questionReports = questionReports,
                answerReports = answerReports
            };
            return Ok(retObj);

        }
    }
}