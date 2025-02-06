using System.ComponentModel.DataAnnotations.Schema;

namespace ExamOverflowApi.Entities
{
    public class QuestionReportTable
    {
        public int Id { get; set; }
        public string Content { get; set; }
        
        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public Question Question { get; set; }

    }
}
