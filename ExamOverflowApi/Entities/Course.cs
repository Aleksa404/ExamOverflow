using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamOverflowApi.Entities
{
    public class Course
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Year { get; set; }

        [ForeignKey("Major")]
        public int MajorId { get; set; }
        public Major Major { get; set; }

        [JsonIgnore]
        public IList<ExamPaper> ExamPapers { get; set; }
    }
}