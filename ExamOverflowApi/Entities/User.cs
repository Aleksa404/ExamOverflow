using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace ExamOverflowApi.Entities
{
    public class User : IdentityUser
    {
        public int Karma { get; set; }
        public string Role { get; set; }
        public string Avatar { get; set; }
        [DefaultValue(false)]
        public bool Banned { get; set; }
        public IList<Question> Questions { get; set; }
        [JsonIgnore]
        public IList<Answer> Answers { get; set; }



    }
}