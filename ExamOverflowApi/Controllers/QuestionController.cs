using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using ExamOverflowApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;
using System.IdentityModel.Tokens.Jwt;

namespace ExamOverflowApi.Controllers
{

    public class QuestionModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int ExamPaperId { get; set; }
        public string UserId { get; set; }
    }
    [EnableCors("CORS")]
    public class QuestionController : BaseController
    {
        public QuestionController(ExamOverflowContext db) : base(db)
        {

        }

        [HttpPost]
        [Route("questions")]
        public async Task<IActionResult> AddQuestion(QuestionModel question)
        {

            // User user = await _dbContext.Users.FindAsync(question.UserId);
            // if(user == null) return BadRequest("User not found");

            Question quest = new Question();
            quest.UserID=question.UserId;
            quest.Title=question.Title;
            quest.Content=question.Content;
            quest.Likes=0;
            quest.PostTime=DateTime.Now;
            quest.ExamPaperId = question.ExamPaperId;

            _dbContext.Questions.Add(quest);
            await _dbContext.SaveChangesAsync();
            return Ok(quest);
        }
        [HttpGet]
        [Route("questions/{id}")]
        public async Task<IActionResult> GetQuestion(int id)
        {
            var question = await _dbContext.Questions.FindAsync(id);
            if(question== null) return BadRequest();

            return Ok(question);
        }

        [HttpGet]
        [Route("questions")]
        public async Task<IActionResult> GetQuestions(int id)
        {
            var examPaper = await _dbContext.ExamPapers
            .Include(examp => examp.Questions)
            .Where(ex => ex.Id == id).FirstOrDefaultAsync();
            if (examPaper == null) return BadRequest("Question not found");
            var questions = examPaper.Questions.OrderByDescending(q => q.PostTime).ToList();



            string jwt = Request.Headers["Authorization"];
            if (jwt != null)
            {
                var handler = new JwtSecurityTokenHandler();
                if (jwt.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    jwt = jwt.Substring("Bearer ".Length).Trim();
                }
                var token = handler.ReadJwtToken(jwt);

                string userID = token.Payload["unique_name"].ToString();
                if (userID != null) 
                {
                    var liked = await _dbContext.LikeTable.Where(x => x.UserId == userID).ToListAsync();
                    var disliked = await _dbContext.DIslikeTable.Where(x => x.UserId == userID).ToListAsync();

                    List<Object> questionsNiz = new List<Object>();
                    foreach (var question in questions)
                    {

                        var imaLike = liked.Where(x => x.QuestionId == question.Id).FirstOrDefault();
                        bool isLiked = imaLike != null ? true : false;
                        var imaDislike = disliked.Where(x => x.QuestionId == question.Id).FirstOrDefault();
                        bool isDisliked = imaDislike != null ? true : false;

                        var quest = new
                        {
                            id = question.Id,
                            title = question.Title,
                            content = question.Content,
                            postTime = question.PostTime,
                            likes = question.Likes,
                            userID = question.UserID,
                            User = question.User,
                            examPaperId = question.ExamPaperId,
                            examPaper = question.ExamPaper,
                            liked = isLiked,
                            disliked = isDisliked
                        };
                        questionsNiz.Add(quest);
                    }


                    return Ok(questionsNiz);
                }
            }
            return Ok(questions);
        }

        [HttpDelete]
        [Route("questions/{id}")]
        public async Task<IActionResult> RemoveQuestion(int id)
        {
            string jwt = Request.Headers["Authorization"];
            if (jwt != null)
            {
                var handler = new JwtSecurityTokenHandler();
                if (jwt.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    jwt = jwt.Substring("Bearer ".Length).Trim();
                }
                var token = handler.ReadJwtToken(jwt);

                string userID = token.Payload["unique_name"].ToString();
                string role = token.Payload["role"].ToString();

                var question = await _dbContext.Questions.FindAsync(id);
                if(question == null) return BadRequest();
                if (userID != null)
                {
                    if(question.UserID == userID)
                    {
                        _dbContext.Questions.Remove(question);
                        await _dbContext.SaveChangesAsync();
                        return Ok();
                    }
                    else if(role == Role.Admin)
                    {
                        _dbContext.Questions.Remove(question);
                        await _dbContext.SaveChangesAsync();
                        return Ok();
                    }
                }
            }
            return BadRequest();

        }

        [HttpGet]
        [Route("questions/like/{questionId}/{userId}")]
        public async Task<IActionResult> Like(int questionId, string userId)
        {
            var question = _dbContext.Questions.Find(questionId);
            if (question == null) return BadRequest("Question not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isLiked = await _dbContext.LikeTable.Where(x => x.UserId == userId && x.QuestionId == questionId).FirstOrDefaultAsync();
            if (isLiked != null) return BadRequest("Already liked");

            var userKarma = _dbContext.Users.Where(x => x.Id == question.UserID).FirstOrDefault();

            var like = new LikeTable();
            like.UserId = userId;
            like.QuestionId = questionId;
            _dbContext.Add(like);
            question.Likes++;
            userKarma.Karma++;
            _dbContext.Questions.Update(question);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet]
        [Route("questions/unlike/{questionId}/{userId}")]
        public async Task<IActionResult> Unlike(int questionId, string userId)
        {
            var question = _dbContext.Questions.Find(questionId);
            if (question == null) return BadRequest("Question not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isLiked = await _dbContext.LikeTable.Where(x => x.UserId == userId && x.QuestionId == questionId).FirstOrDefaultAsync();
            if (isLiked == null) return BadRequest("Not liked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == question.UserID).FirstOrDefaultAsync();

            _dbContext.LikeTable.Remove(isLiked);
            question.Likes--;
            userKarma.Karma--;
            _dbContext.Questions.Update(question);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("questions/dislike/{questionId}/{userId}")]
        public async Task<IActionResult> Dislike(int questionId, string userId)
        {
            var question = _dbContext.Questions.Find(questionId);
            if (question == null) return BadRequest("Question not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isDisliked = await _dbContext.DIslikeTable.Where(x => x.UserId == userId && x.QuestionId == questionId).FirstOrDefaultAsync();
            if (isDisliked != null) return BadRequest("Already disliked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == question.UserID).FirstOrDefaultAsync();

            var dislike = new DIslikeTable();
            dislike.UserId = userId;
            dislike.QuestionId = questionId;
            _dbContext.Add(dislike);
            question.Likes--;
            userKarma.Karma--;
            _dbContext.Questions.Update(question);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("questions/unDislike/{questionId}/{userId}")]
        public async Task<IActionResult> UnDislike(int questionId, string userId)
        {
            var question = _dbContext.Questions.Find(questionId);
            if (question == null) return BadRequest("Question not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isDisliked = await _dbContext.DIslikeTable.Where(x => x.UserId == userId && x.QuestionId == questionId).FirstOrDefaultAsync();
            if (isDisliked == null) return BadRequest("Not disliked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == question.UserID).FirstOrDefaultAsync();

            _dbContext.DIslikeTable.Remove(isDisliked);
            question.Likes++;
            userKarma.Karma++;
            _dbContext.Questions.Update(question);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }




    }
}