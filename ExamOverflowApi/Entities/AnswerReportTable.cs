using System.ComponentModel.DataAnnotations.Schema;

namespace ExamOverflowApi.Entities
{
    public class AnswerReportTable
    {
        public int Id { get; set; }
        public string Content { get; set; }
        
        [ForeignKey("Answer")]
        public int AnswerId { get; set; }
        public Answer Answer { get; set; }

    }
}