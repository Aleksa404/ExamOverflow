using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamOverflowApi.Entities
{
    public class Question
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Pitanje mora da sadrži naslov")]
        [StringLength(200, ErrorMessage = "Naslov može da sadrži do 200 karaktera")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Pitanje mora da ima sadržaj")]
        [StringLength(5000, ErrorMessage = "Pitanje može da sadrži do 5000 karaktera")]
        public string Content { get; set; }
        [Required]
        public DateTime PostTime { get; set; }
        public int Likes { get; set; }
        [ForeignKey("User")]
        public string UserID { get; set; }
        
         public User User { get; set; }

         [ForeignKey("ExamPaper")]
         public int ExamPaperId { get; set;}
         public ExamPaper ExamPaper { get; set;}


        [JsonIgnore]
        public IList<Answer> Answers { get; set; }


    }
}