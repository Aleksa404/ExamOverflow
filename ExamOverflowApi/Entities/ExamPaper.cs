using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamOverflowApi.Entities
{
    public class ExamPaper
    {
        public int Id { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public string Term { get; set; }
        [Required]
        public string DocumentUrl { get; set; }
        [Required]
        [DefaultValue(false)]
        public bool Approved { get; set ;}
        
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public Course Course { get; set; }


        [JsonIgnore]
        public IList<Question> Questions { get; set; }


    }
}