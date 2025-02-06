using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamOverflowApi.Entities
{
    public class Answer
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Ovo je obavezno polje")]
        [StringLength(5000, ErrorMessage = "Odgovor može da sadrži do 10000 karaktera")]
        public string Content { get; set; }
        public int Likes { get; set; }
        public DateTime PostTime { get; set; }
        
        [ForeignKey("User")]
        public string UserID { get; set; }
        
         public User User { get; set; }

         [ForeignKey("Question")]
         public int QuestionId { get; set; }
         public Question Question { get; set; }

    }
}