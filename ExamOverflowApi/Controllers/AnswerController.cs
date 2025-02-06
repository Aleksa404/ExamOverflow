using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using ExamOverflowApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ExamOverflowApi.Controllers
{

    public class AnswerController : BaseController
    {
        public AnswerController(ExamOverflowContext db) : base(db)
        {  }


        [HttpPost]
        [Route("answers")]
        public async Task<IActionResult> PostAnswer(Answer answer)
        {
            Answer answ = new Answer();
            answ.UserID=answer.UserID;
            answ.Content=answer.Content;
            answ.Likes=0;
            answ.PostTime=DateTime.Now;
            answ.QuestionId = answer.QuestionId;

            _dbContext.Answers.Add(answ);
            await _dbContext.SaveChangesAsync();
            return Ok(answ);
        }

        [HttpGet]
        [Route("answers")]
        public async Task<IActionResult> GetAnswer(int id) 
        {
            var question =await _dbContext.Questions
            .Include(question => question.Answers)  
            .Where(quest => quest.Id == id).FirstOrDefaultAsync();
            if(question == null)
                return BadRequest("Question not found");
            var answers = question.Answers.OrderByDescending(a => a.PostTime).ToList();

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
                    var liked = await _dbContext.AnswerLikeTable.Where(x => x.UserId == userID).ToListAsync();
                    var disliked = await _dbContext.AnswerDislikeTable.Where(x => x.UserId == userID).ToListAsync();

                    List<Object> answerNiz = new List<Object>();
                    foreach (var answer in answers)
                    {

                        var imaLike = liked.Where(x => x.AnswerId == answer.Id).FirstOrDefault();
                        bool isLiked = imaLike != null ? true : false;
                        var imaDislike = disliked.Where(x => x.AnswerId == answer.Id).FirstOrDefault();
                        bool isDisliked = imaDislike != null ? true : false;

                        var answ = new
                        {
                            id = answer.Id,
                            content = answer.Content,
                            postTime = answer.PostTime,
                            likes = answer.Likes,
                            userID = answer.UserID,
                            User = answer.User,
                            questionId = answer.QuestionId,
                            question = answer.Question,
                            liked = isLiked,
                            disliked = isDisliked
                        };
                        answerNiz.Add(answ);
                    }


                    return Ok(answerNiz);
                }
            }
            return Ok(answers);
        }
        [HttpDelete]
        [Route("answers/{id}")]
        public async Task<IActionResult> RemoveAnswer(int id)
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

                var answer = await _dbContext.Answers.FindAsync(id);
                if(answer == null) return BadRequest();
                if (userID != null)
                {
                    if(answer.UserID == userID)
                    {
                        _dbContext.Answers.Remove(answer);
                        await _dbContext.SaveChangesAsync();
                        return Ok();
                    }
                    else if(role == Role.Admin)
                    {
                        _dbContext.Answers.Remove(answer);
                        await _dbContext.SaveChangesAsync();
                        return Ok();
                    }
                }
            }
            return BadRequest();

        }
        
        [HttpGet]
        [Route("answers/like/{answerId}/{userId}")]
        public async Task<IActionResult> Like(int answerId, string userId)
        {
            var answer = _dbContext.Answers.Find(answerId);
            if (answer == null) return BadRequest("Answer not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isLiked = await _dbContext.AnswerLikeTable.Where(x => x.UserId == userId && x.AnswerId == answerId).FirstOrDefaultAsync();
            if (isLiked != null) return BadRequest("Already liked");

            var userKarma = _dbContext.Users.Where(x => x.Id == answer.UserID).FirstOrDefault();

            var like = new AnswerLikeTable();
            like.UserId = userId;
            like.AnswerId = answerId;
            _dbContext.Add(like);
            answer.Likes++;
            userKarma.Karma++;
            _dbContext.Answers.Update(answer);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("answers/unlike/{answerId}/{userId}")]
        public async Task<IActionResult> Unlike(int answerId, string userId)
        {
            var answer = _dbContext.Answers.Find(answerId);
            if (answer == null) return BadRequest("Answer not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isLiked = await _dbContext.AnswerLikeTable.Where(x => x.UserId == userId && x.AnswerId == answerId).FirstOrDefaultAsync();
            if (isLiked == null) return BadRequest("Not liked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == answer.UserID).FirstOrDefaultAsync();

            _dbContext.AnswerLikeTable.Remove(isLiked);
            answer.Likes--;
            userKarma.Karma--;
            _dbContext.Answers.Update(answer);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("answers/dislike/{answerId}/{userId}")]
        public async Task<IActionResult> Dislike(int answerId, string userId)
        {
            var answer = _dbContext.Answers.Find(answerId);
            if (answer == null) return BadRequest("Answer not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isDisliked = await _dbContext.AnswerDislikeTable.Where(x => x.UserId == userId && x.AnswerId == answerId).FirstOrDefaultAsync();
            if (isDisliked != null) return BadRequest("Already disliked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == answer.UserID).FirstOrDefaultAsync();

            var dislike = new AnswerDIslikeTable();
            dislike.UserId = userId;
            dislike.AnswerId=answerId;
            _dbContext.Add(dislike);
            answer.Likes--;
            userKarma.Karma--;
            _dbContext.Answers.Update(answer);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("answers/unDislike/{answerId}/{userId}")]
        public async Task<IActionResult> UnDislike(int answerId, string userId)
        {
            var answer = _dbContext.Answers.Find(answerId);
            if (answer == null) return BadRequest("Answer not found");
            var user = _dbContext.Users.Find(userId);
            if (user == null) return BadRequest("User not found");

            var isDisliked = await _dbContext.AnswerDislikeTable.Where(x => x.UserId == userId && x.AnswerId == answerId).FirstOrDefaultAsync();
            if (isDisliked == null) return BadRequest("Not disliked");

            var userKarma = await _dbContext.Users.Where(x => x.Id == answer.UserID).FirstOrDefaultAsync();

            _dbContext.AnswerDislikeTable.Remove(isDisliked);
            answer.Likes++;
            userKarma.Karma++;
            _dbContext.Answers.Update(answer);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        
    }
}