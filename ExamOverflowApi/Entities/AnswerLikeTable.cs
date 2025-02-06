using System.ComponentModel.DataAnnotations.Schema;

namespace ExamOverflowApi.Entities
{
    public class AnswerLikeTable
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }
        
        [ForeignKey("Answer")]
        public int AnswerId { get; set; }
        public Answer Answer { get; set; }
    }
}