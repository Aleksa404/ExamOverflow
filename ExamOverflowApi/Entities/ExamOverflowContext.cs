using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ExamOverflowApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ExamOverflowApi.Entities
{
    public class ExamOverflowContext : IdentityDbContext<User>
    {
        public ExamOverflowContext(DbContextOptions options) : base(options) { }

        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Major> Majors { get; set; }
        public DbSet<ExamPaper> ExamPapers { get; set; }
        public DbSet<LikeTable> LikeTable { get; set; }
        public DbSet<DIslikeTable> DIslikeTable { get; set; }
        public DbSet<AnswerLikeTable> AnswerLikeTable { get; set;}
        public DbSet<AnswerDIslikeTable> AnswerDislikeTable { get; set; }
        public DbSet<QuestionReportTable> QuestionReportTable { get; set; }
        public DbSet<AnswerReportTable> AnswerReportTable { get; set; }


    }
}