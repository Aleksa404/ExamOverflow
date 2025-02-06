using System.ComponentModel.DataAnnotations.Schema;

namespace ExamOverflowApi.Entities
{
    public class LikeTable
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }
        
        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public Question Question { get; set; }

    }
}